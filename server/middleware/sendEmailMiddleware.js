const nodemailer = require('nodemailer');
const ApiError = require('../error/ApiError');

module.exports = async function (req, res, next) {

    const GMAIL = process.env.GMAIL;
    const GMAIL_PASSWORD = process.env.GMAIL_PASS;

    const { email, password } =  req.user;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL,
            pass: GMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: GMAIL,
        to: email,
        subject: 'Forgot password',
        text: `Your new password is:\n ${password}`
    };

    try {
        return transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return next(ApiError.badRequest(error.message));
            } else {
                res.status(200).json({message: 'New password sent to your email address'});
            }
        });

    } catch (err) {
        return next(ApiError.internalError(err.message));
    }
}