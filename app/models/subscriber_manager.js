var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var subscribeManageSchema = mongoose.Schema({
    code     	 		:Number,
	subscribe_name     	:String,
    email        		: String,
    phone     			: String,
	mobile	     	    : String,
	role      		    : String,
	period_of_month     : Number,
	start_date 			:Date,
	end_date 			:Date,
	subscribe_note 		:String,
});


module.exports = mongoose.model('rxp_subscriber_manager', subscribeManageSchema);
