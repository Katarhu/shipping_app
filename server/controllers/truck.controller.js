const { User } = require('../models/User');
const { Truck } = require('../models/Truck');
const ApiError = require('../error/ApiError');
const createTruckDimensions = require('../utils/createTruck');

async function isUserOnLoad(_id) {
    const activeTruck = await Truck.findOne({assigned_to: _id});

    if( !activeTruck ) return false;
    return activeTruck.status === "OL";
}

class TruckController {
    async getTrucks(req, res, next ) {
        try {
            const user = req.user;

            const userTrucks = await Truck.find({created_by: user._id});

            if( !userTrucks ) return next(ApiError.badRequest('User doesn\'t have any trucks'));

            return res.status(200).json({ trucks: userTrucks });

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
    async addTruck(req, res, next ) {
        try {
            const user = req.user;

            if( await isUserOnLoad(user._id) ) return next(ApiError.badRequest('Can\'t change nothing while on load'));

            const { type } = req.body;

            if( !type ) return next(ApiError.badRequest('Truck type is not provided'));

            const truckInfo = createTruckDimensions(type);

            if( !truckInfo ) return next(ApiError.badRequest('Invalid type'));

            const newTruck = new Truck({
                created_by: user._id,
                type,
                dimensions: truckInfo.dimensions,
                payload: truckInfo.payload
            });

            await newTruck.save();

            return res.status(200).json({message: 'Truck created successfully'})

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
    async getTruck(req, res, next ) {
        try {
            const {id: _id} = req.params;
            const user = req.user;

            const truck = await Truck.findById(_id);

            if( !truck ) return next(ApiError.badRequest('There is no truck with such id'));

            if( truck.created_by !== user._id ) return next(ApiError.forbidden('This operation is forbidden'));

            res.status(200).json({truck});

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
    async updateTruck(req, res, next ) {
        try {
            const {id: _id} = req.params;
            const user = req.user;


            if( await isUserOnLoad(user._id) ) return next(ApiError.badRequest('Can\'t change nothing while on load'))

            const truck = await Truck.findById(_id);

            if( !truck ) return next(ApiError.badRequest('There is no truck with such id'));

            if( truck.created_by !== user._id ) return next(ApiError.forbidden('This operation is forbidden'));

            const { type } = req.body;


            if( !type ) return next(ApiError.badRequest('Type is not provided'));

            const truckInfo = createTruckDimensions(type);

            if( !truckInfo ) return next(ApiError.badRequest('Invalid type'));

            await Truck.findByIdAndUpdate(_id, {
                payload: truckInfo.payload,
                dimensions: truckInfo.dimensions,
                type
            });

            return res.status(200).json({message: 'Truck details changed successfully'});

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
    async deleteTruck(req, res, next ) {
        try {
            const {id: _id} = req.params;
            const user = req.user;

            if( await isUserOnLoad(user._id) ) return next(ApiError.badRequest('Can\'t change nothing while on load'))

            const truck = await Truck.findById(_id);

            if( !truck ) return next(ApiError.badRequest('There is no truck with such id'));

            if( truck.created_by !== user._id ) return next(ApiError.forbidden('This operation is forbidden'));

            await Truck.findByIdAndDelete(_id);

            return res.status(200).json({message: 'Truck deleted successfully'});
        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
    async assignTruck(req, res, next ) {
        try {
            const {id: _id} = req.params;
            const user = req.user;

            if( await isUserOnLoad(user._id) ) return next(ApiError.badRequest('Can\'t change nothing while on load'))

            const truck = await Truck.findById(_id);

            if( !truck ) return next(ApiError.badRequest('There is no truck with such id'));

            if( truck.created_by !== user._id ) return next(ApiError.forbidden('This operation is forbidden'));

            await Truck.updateOne({ assigned_to: user._id}, { assigned_to: null, status: ""});
            await Truck.findByIdAndUpdate(truck._id, { assigned_to: user._id, status: "IS"});

            res.status(200).json({message: "Truck assigned successfully"});

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
}

module.exports = new TruckController();