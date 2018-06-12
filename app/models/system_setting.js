var mongoose = require('mongoose');

var rxp_SystemSettingsSchema = mongoose.Schema({
    
	System_Setting_ID     			: Number,
    System_Setting_ConfigName     	: String,
    System_Setting_ConfigValue		:String
});


module.exports = mongoose.model('rxp_system_setting', rxp_SystemSettingsSchema);
