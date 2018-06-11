var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxpAccountSchema = mongoose.Schema({
    
	Account_Code      	     :Number,
    Account_Name     		 :String,
    Account_Address   		 :String,
	Account_City 		 	 :String,
	Account_State            :String,
	Account_Country          :String,
	Account_Telephone        :String,
    Account_Account_manager  :Number,
	Account_Sales_rep        :Number,
    Account_Cms_manager      :Number,
    Account_Parent_account   :Number,
	Account_Note         	 :String
});


rxpAccountSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

var Account = module.exports = mongoose.model('rxp_accounts', rxpAccountSchema);

module.exports.getLastCode = function(callback){
    
    Account.findOne({},callback).sort({Account_Code:-1});
}