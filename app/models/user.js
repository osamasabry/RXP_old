var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxpUserSchema = mongoose.Schema({
   
		User_Code        :Number,
        User_Name        :String,
        User_Password    :String,
        User_DisplayName :String,
        User_Permissions :[String],
		User_IsActive    :Number,
        User_Employee_ID :Number,
        User_Permissions_List :String
        // User_Access_Token:String
});

rxpUserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

rxpUserSchema.methods.verifyPassword = function(password) {
    if(bcrypt.compareSync(password, this.User_Password))
        return 1;
    else
        return 0;
};


rxpUserSchema.methods.updatePassword = function(password) {
    this.User_Password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	this.save();
};


// userSchema.methods.updateUser = function(request, response){

// 	this.name = request.body.name;
// 	this.address = request.body.address;
// 	 this.save();
// 	response.redirect('/user');
// };



module.exports = mongoose.model('rxp_users', rxpUserSchema);
