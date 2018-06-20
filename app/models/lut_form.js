var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_LutFormsSchema = mongoose.Schema({
    
	Form_Code     	  :Number,
    Form_Name     	  :String,
    Form_Description  :String,
    Form_IsActive     :Number,
    
});


var Form = module.exports = mongoose.model('rxp_lut_form', rxp_LutFormsSchema);


module.exports.getLastCode = function(callback){
    
    Form.findOne({},callback).sort({Form_Code:-1});
}