var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var RXP_PharmaceuticalCategorySchema = mongoose.Schema({
    
	Pharmaceutical_Category_Code     	  :Number,
    Pharmaceutical_Category_Name      	  :String,
    Pharmaceutical_Category_ATC_Code  	  :String,
    Pharmaceutical_Category_IsActive      :Number,

    
});


var PharmaceuticalCategory = module.exports = mongoose.model('rxp_pharmaceutical_category', RXP_PharmaceuticalCategorySchema);



module.exports.getLastCode = function(callback){
    
    PharmaceuticalCategory.findOne({},callback).sort({Pharmaceutical_Category_Code:-1});
}