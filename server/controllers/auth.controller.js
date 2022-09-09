const ApiError = require('../error/ApiError');
const { User, UserJoi } = require('../models/User');
const generateJWT = require('../utils/generateToken');
const generatePassword = require('../utils/generatePassword');
const bcrypt = require('bcryptjs');

class AuthController {
    async registerUser(req, res, next) {
        try {
            let { email, password, role } = req.body;

            await UserJoi.validateAsync({email, password });

            const isEmail = await User.findOne({email});

            if( isEmail ) return next(ApiError.badRequest('Email is already taken'));

            role = role === 'DRIVER' ? 'DRIVER' : 'SHIPPER';
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                email,
                password: hashedPassword,
                role
            });

            await newUser.save();
            const token = generateJWT(email, newUser._id, role);

            return res.status(200).json({
                message: "Profile created successfully",
                user: {
                    email: newUser.email,
                    _id: newUser._id,
                    role: newUser.role
                },
                jwt_token: token,
            });

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
    async loginUser(req, res, next) {
        try {
            const { email, password } = req.body;

            await UserJoi.validateAsync({email, password});

            const user = await User.findOne({email});

            if( !user ) return next(ApiError.badRequest('Incorrect email or password'));

            const isPasswordCorrect = await bcrypt.compare(password, user.password );

            if( !isPasswordCorrect ) return next(ApiError.badRequest('Incorrect email or password'));

            const token = generateJWT(user.email, user._id, user.role );

            res.status(200).json({
                user: {
                    email: user.email,
                    _id: user._id,
                    role: user.role
                },
                jwt_token: token
            });

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;

            if( !email ) return next(ApiError.badRequest('Email is not provided'));

            const user = await User.findOne({email});

            if( !user ) return next(ApiError.badRequest('There is no user with such email'));

            const newPassword = generatePassword();
            const newHashedPassword = await bcrypt.hash(newPassword, 10);

            await User.updateOne({email}, {password: newHashedPassword});

            req.user = {
                email: user.email,
                password: newPassword
            }

            next();

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
    async authUser(req, res, next) {
        const user = req.user;

        const isUser = await User.findById(user._id);

        if( !isUser ) return next(ApiError.badRequest('User doesn\'t exist'));

        res.status(200).json({
            message: 'Success',
            user: {
                email: isUser.email,
                _id: isUser._id,
                role: isUser.role
            }});
    }
}

module.exports = new AuthController();