var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rolesSchema = mongoose.Schema({
    
	Role_Code     	  :Number,
    Role_Name     	  : String,
    Role_Description  :String
    
});


module.exports = mongoose.model('rxp_roles', rolesSchema);
