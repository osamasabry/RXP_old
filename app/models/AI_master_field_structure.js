var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var RxP_AIMasterFieldStructureSchema = mongoose.Schema({
    
	AI_Master_Clinical_Data_Field_Structure_Code     	  				 :Number,
    AI_Master_Clinical_Data_Field_Structure_FieldName     	 			 :String,
    AI_Master_Clinical_Data_Field_Structure_Field_Structure_DataType_ID  :Number,
    AI_Master_Clinical_Data_Field_Structure_IsMandatory 				 :Number,
    AI_Master_Clinical_Data_Field_Structure_IsActive					 :Number,
    AI_Master_Clinical_Data_Field_Structure_Country_ID                   :Number,
    AI_Master_Clinical_Data_Field_Structure_Priority					 :Number,
    

});


var Master_Fields = module.exports = mongoose.model('RxP_AI_Master_Clinical_Data_Field_Structure', RxP_AIMasterFieldStructureSchema);


module.exports.getLastCode = function(callback){
    
    Master_Fields.findOne({},callback).sort({AI_Master_Clinical_Data_Field_Structure_Code:-1});
}