var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_AccountUserSchema = mongoose.Schema({
   
		AccountUser_Code        :Number,
        AccountUser_UserName    :String,
        AccountUser_Password    :String,
		AccountUser_Account_ID  :Number,
});

rxp_AccountUserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

rxp_AccountUserSchema.methods.verifyPassword = function(password) {
    if(password.localeCompare(this.AccountUser_Password) == 0)
        return 1;
    else
        return 0;
};


rxp_AccountUserSchema.methods.updatePassword = function(password) {
    this.AccountUser_Password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	this.save();
};


module.exports = mongoose.model('rxp_account_user', rxp_AccountUserSchema);
