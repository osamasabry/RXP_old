var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutMedicalConditionSchema = mongoose.Schema({

	MedicalCondition_Code     	  :Number,
    MedicalCondition_Name    	  :String,
    MedicalCondition_Description :String,
    MedicalCondition_ICD9 		 :String,
    MedicalCondition_ICD10 		 :String,
    MedicalCondition_ICD10am 	 :String,
    MedicalCondition_ICD11 		 :String,
    MedicalCondition_IsActive    :Number,
    
});


var MedicalCondition = module.exports = mongoose.model('rxp_lut_medical_condition', rxp_LutMedicalConditionSchema);


module.exports.getLastCode = function(callback){
    
    MedicalCondition.findOne({},callback).sort({MedicalCondition_Code:-1});
}