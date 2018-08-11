var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');

var rxp_TNRevisionTableSchema = mongoose.Schema({
    
	TNRevisio_Code     	  				 :Number,
    TNRevisio_Name     	 				 :{type:String, unique: true,uniqueCaseInsensitive: true },
    TNRevisio_ActiveIngredients 		 :{type:[Number], unique: true},
    TNRevisio_Status 					 :{type:Number},
    TNRevisio_Form_ID  					 :{type:Number, unique: true},
    TNRevisio_Route_ID					 :{type:Number, unique: true},
    TNRevisio_Strength_Unit_ID 			 :{type:Number, unique: true},
    TNRevisio_Strength_Value			 :{type:String, unique: true,uniqueCaseInsensitive: true },
    TNRevisio_Weight_Unit_ID			 :{type:Number, unique: true},
    TNRevisio_Weight_Value				 :{type:String, unique: true,uniqueCaseInsensitive: true },
    TNRevisio_Volume_Unit_ID			 :{type:Number, unique: true},
    TNRevisio_Volume_Value 				 :{type:String, unique: true,uniqueCaseInsensitive: true },
    TNRevisio_Concentration_Unit_ID		 :{type:Number, unique: true},
    TNRevisio_Concentration_Value		 :{type:String, unique: true,uniqueCaseInsensitive: true },
    TNRevisio_Country_ID				 :{type:[Number], unique:true},
});


rxp_TNRevisionTableSchema.plugin(uniqueValidator);


var TNRevison_table = module.exports = mongoose.model('rxp_tn_revision', rxp_TNRevisionTableSchema);


module.exports.getLastCode = function(callback){
    
    TNRevison_table.findOne({},callback).sort({TNRevisio_Code:-1});
}