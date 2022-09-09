const { User } = require('../models/User');
const { Truck } = require('../models/Truck');
const { Load } = require('../models/Load');
const ApiError = require('../error/ApiError');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { fileURLToPath } = require('url');

async function isUserOnLoad(_id, role) {
    if( role === 'SHIPPER') return false;


    const activeTruck = await Truck.findOne({assigned_to: _id});

    if( !activeTruck ) return false;
    return activeTruck.status === "OL";
}

class UserController {
    async getUser(req, res, next) {
        try {
            const user = await User.findById(req.user._id);

            if( !user ) return next(ApiError.badRequest('User doesn\'t exist'));

            res.status(200).json({
                _id: user._id,
                role: user.role,
                email: user.email,
                imgUrl: user.imgUrl,
                created_date: user.created_date
            })

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
    async getUserById(req, res, next) {
        try {
            const { id: _id} = req.params;
            const user = await User.findById(_id);

            if( !user ) return next(ApiError.badRequest('User doesn\'t exist'));

            res.status(200).json({
                email: user.email,
                imgUrl: user.imgUrl,
            });

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
    async deleteUser(req, res, next) {
        try {
            const user = await User.findById(req.user._id);

            if(await isUserOnLoad(user._id, user.role)) return next(ApiError.badRequest('Can\'t change nothing while on load'));

            const isActiveLoads = await Load.findOne({ created_by: user._id, status: "ASSIGNED" });

            if( isActiveLoads ) return next(ApiError.badRequest('Can\'t delete account, while active loads'));

            if( !user ) return next(ApiError.badRequest('User doesn\'t exist'));

            await fs.unlink(path.join(__dirname, '..', 'uploads', user.imgUrl), (err) => {
                if (err) return;
            })
            await User.findByIdAndDelete(user._id);
            await Truck.deleteMany({ created_by: user._id});
            await Load.deleteMany({ created_by: user._id});

            res.status(200).json({message: 'Profile deleted successfully'})

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
    async changePassword(req, res, next) {
        try {
            const user = await User.findById(req.user._id);

            if(await isUserOnLoad(user._id, user.role)) return next(ApiError.badRequest('Can\'t change nothing while on load'))

            if( !user ) return next(ApiError.badRequest('User doesn\'t exist'));

            const { oldPassword, newPassword} = req.body;

            if( !oldPassword || !newPassword ) return next(ApiError.badRequest('Not all parameters is provided'))

            const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password );

            if( !isPasswordCorrect ) return next(ApiError.badRequest('Old password is incorrect'));

            const newHashedPassword = await bcrypt.hash(newPassword, 10);

            await User.findByIdAndUpdate(user._id, { password: newHashedPassword });

            res.status(200).json({message: 'Password changed successfully'});

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
    async changePhoto(req, res, next) {
        try {
            const user = await User.findById(req.user._id);

            if( req.files ) {
                let fileName = Date.now().toString() + req.files.image.name;
                await fs.unlink(path.join(__dirname, '..', 'uploads', user.imgUrl), (err) => {
                    if (err) return;
                })
                req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName));

                await User.findByIdAndUpdate(user._id, {imgUrl: fileName});

                return res.status(200).json({message: "Profile picture was changed!"})
            }
            return next(ApiError.badRequest('No image provided'));
        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
}

module.exports = new UserController();