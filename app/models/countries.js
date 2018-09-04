var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxpCountriesSchema = mongoose.Schema({
    
	Country_Code     	:Number,
    Country_Name     	:{
	       type: String,
	       required: true
	  },
    Country_IsActive	:Number,
    Country_Tcode		:String,
    Country_IsDB		:Number,
    
});


var Countries = module.exports = mongoose.model('rxp_countries', rxpCountriesSchema);


module.exports.getLastCode = function(callback){
    
    Countries.findOne({},callback).sort({Country_Code:-1});
}