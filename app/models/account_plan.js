var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var accountPlanSchema = mongoose.Schema({
    code      	            :Number,
    interface     		    :String,
	out_source_dbs   	    :String,
	out_source_tools        :String,
    max_concurrent_users    :Number,
    max_users      			:Number,
    can_custom_medicaldata  :Number,
    way_of_access   		:Number,
    list_ips 				:String

});



module.exports = mongoose.model('rxp_account_plan', accountPlanSchema);
