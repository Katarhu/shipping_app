const ApiError = require('../error/ApiError');
const { Load, LoadJoi } = require('../models/Load');
const { Truck } = require('../models/Truck');
const proceedLoadState = require('../utils/proceedLoadState');

class LoadController {
    async getLoads(req, res, next) {
        try {

            let { status = '', limit = Number.MAX_SAFE_INTEGER, offset = 0 } = req.query;
            const regex = new RegExp(`${status}`, 'g');

            if( !Number.isInteger(+limit) || limit <= 0) limit = Number.MAX_SAFE_INTEGER;
            if( !Number.isInteger(+offset) ) offset = 0;

            let loads;

            if( req.user.role === 'SHIPPER') {
                loads = await Load.aggregate([
                    { $match: {
                        status: {$regex: regex},
                        created_by: { $eq: req.user._id}
                    }},
                    { $limit: +limit },
                    { $skip: +offset },
                    { $sort: {created_date: -1}}
                ]);
            } else {
                loads = await Load.aggregate([
                    { $match: {status: {$regex: regex}}},
                    { $limit: +limit },
                    { $skip: +offset }
                ]);
            }

            res.status(200).json({ loads });

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }

    async createLoad(req, res, next) {
        try {
            const user = req.user;

            const { name, payload, pickup_address, delivery_address, dimensions } = req.body;

            await LoadJoi.validateAsync({ name, payload, pickup_address, delivery_address,
                width: dimensions.width,
                length: dimensions.length,
                height: dimensions.height
            });

            const newLoad = new Load({
                name,
                created_by: user._id,
                payload,
                pickup_address,
                delivery_address,
                dimensions
            });

            await newLoad.save();

            res.status(200).json({ message: 'Load created successfully'});

        } catch (err) {
            return next(ApiError.badRequest(err.message));
        }
    }

    async getActiveLoads(req, res, next) {
        try {
            const user = req.user;

            const load = await Load.findOne({assigned_to: user._id});

            res.status(200).json({ load });
        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }

    async proceedLoadState(req, res, next) {
        try {
            const user = req.user;

            const activeLoad = await Load.findOne({assigned_to: user._id});

            if( !activeLoad ) return next(ApiError.badRequest('Driver doesn\'t have active load'));

            const newLoadState = proceedLoadState(activeLoad.state);

            if( newLoadState === 'Arrived to delivery' ) {
                await Truck.updateOne({assigned_to: user._id}, {status: 'IS'});
                await Load.updateOne({assigned_to: user._id}, {status: 'SHIPPED',
                    state: newLoadState,
                    assigned_to: null,
                    $push: { logs: {message: `Load status is: ${newLoadState}`, time: new Date().toLocaleDateString()}}
                });
            }

            await Load.updateOne(
                {assigned_to: user._id},
                {state: newLoadState,  $push: { logs: {message: `Load status is: ${newLoadState}`, time: new Date().toLocaleDateString()}}});


            res.status(200).json({ message: `Load state changed to ${newLoadState}`});
        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }

    async getLoad(req, res, next) {
        try {
            const { id: _id } = req.params;

            const load = await Load.findById(_id);

            if(!load) return next(ApiError.badRequest('There is no load with such id'));

            res.status(200).json({ load });

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }

    async updateLoad(req, res, next) {
        try {
            const user = req.user
            const { id: _id} = req.params;

            const load = await Load.findById(_id);

            if( !load ) return next(ApiError.badRequest('There is no load with such id'));
            if( load.created_by !== user._id ) return next(ApiError.forbidden('This operation is forbidden'));
            if( load.status !== 'NEW' ) return next(ApiError.badRequest('Can\'t change load info while its active'));

            const { name, payload, pickup_address, delivery_address, dimensions } = req.body;

            await LoadJoi.validateAsync({ name, payload, pickup_address, delivery_address,
                width: dimensions.width,
                length: dimensions.length,
                height: dimensions.height
            });

            await Load.findByIdAndUpdate(_id, { name, payload, pickup_address, delivery_address, dimensions });

            return res.status(200).json({message: 'Load details changed successfully'});

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }

    async deleteLoad(req, res, next) {
        try {
            const user = req.user;
            const  { id: _id} = req.params;

            const load = await Load.findById(_id);

            if( !load ) return next(ApiError.badRequest('There is no load with such id'));
            if( load.created_by !== user._id ) return next(ApiError.forbidden('This operation is forbidden'));
            if( load.status !== 'NEW' && load.status !== 'SHIPPED') return next(ApiError.badRequest('Can\'t delete load while its active'));

            await Load.findByIdAndDelete(_id);

            res.status(200).json({ message: 'Load deleted successfully'});
        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }

    async postLoad(req, res, next) {
        try {
            const user = req.user;
            const { id: _id } = req.params;

            const load = await Load.findById(_id);

            if( !load ) return next(ApiError.badRequest('There is no load with such id'));
            if( load.created_by !== user._id ) return next(ApiError.forbidden('This operation is forbidden'));
            if( load.status !== 'NEW' ) return next(ApiError.badRequest('This load is already active'));


            const freeTruck = await Truck.findOne({
                assigned_to: { $ne: null},
                status: { $eq: 'IS'},
                payload: { $gt: load.payload },
                "dimensions.width": { $gt: load.dimensions.width },
                "dimensions.length": { $gt: load.dimensions.length },
                "dimensions.height": { $gt: load.dimensions.height }
            });


            if( !freeTruck ) {
                await Load.findByIdAndUpdate(_id,
                    { $push: { logs: {message: `Couldn\'t find a driver`, time: new Date().toLocaleTimeString()}}
                    });
                return next(ApiError.badRequest('There is no free drivers'));
            }

            await Truck.findByIdAndUpdate(freeTruck._id, {status: 'OL'});
            await Load.findByIdAndUpdate(_id, {
                assigned_to: freeTruck.assigned_to,
                status: "ASSIGNED",
                state: 'En route to Pick Up',
                $push: { logs: {message: `Driver found. Driver id: ${freeTruck.assigned_to}`, time: new Date().toLocaleTimeString()}}
            });

            res.status(200).json({
                "message": "Load posted successfully",
                "driver_found": true
            });

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }

    async getLoadShippingInfo(req, res, next) {
        try {
            const { id: _id } = req.params;
            const user = req.user;
            const load = await Load.findById(_id);

            if( load.created_by !== user._id ) return next(ApiError.forbidden('This operation is forbidden'));

            let truck = null;

            if( load.assigned_to !== null ) {
                truck = await Truck.findOne({assigned_to: load.assigned_to});
            }

            res.status(200).json({
                load,
                truck
            })

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
}

module.exports = new LoadController();