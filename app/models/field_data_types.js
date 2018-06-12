var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var RxP_LUT_Field_Structure_DataTypes_Schema = mongoose.Schema({
    
	Field_Structure_DataType_Code     	  :Number,
    Field_Structure_DataType_Name     	  :String,
    Field_Structure_DataType_Describtion  :String
    
});


module.exports = mongoose.model('rxp_field_data_type', RxP_LUT_Field_Structure_DataTypes_Schema);
