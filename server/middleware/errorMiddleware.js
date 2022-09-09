const ApiError = require('../error/ApiError');

module.exports = function (err, req, res, next) {
   try {
       if( err instanceof ApiError ) {
           return res.status(err.status).json({message: err.message});
       }
       return res.status(500).json({message: 'Server error'});
   } catch (err) {
       return res.status(500).json({message: 'Server error'});
   }
}