var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var lutRoleTypeSchema = mongoose.Schema({
    
	RoleType_Code     	  :Number,
    RoleType_Name     	  :String,
    RoleType_Description  :String
    
});


var RoleType = module.exports = mongoose.model('rxp_lut_role_types', lutRoleTypeSchema);


module.exports.getLastCode = function(callback){
    
    RoleType.findOne({},callback).sort({code:-1});
}