var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutCurrencySchema = mongoose.Schema({

	Currency_Code     	  :Number,
    Currency_Name    	  :String,
    Currency_Description :String,
    Currency_IsActive    :Number,
    
});


var Currency = module.exports = mongoose.model('rxp_lut_currency', rxp_LutCurrencySchema);


module.exports.getLastCode = function(callback){
    
    Currency.findOne({},callback).sort({Currency_Code:-1});
}