var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_AI_MasterClinicalDataTaskSchema = mongoose.Schema({
    
	AI_Master_Clinical_Data_Task_Code     	  				             :Number,
    AI_Master_Clinical_Data_Task_AssignDate     	 				     :Date,
    AI_Master_Clinical_Data_Task_AssignTo_Employee_Code  			     :Number,
    AI_Master_Clinical_Data_Task_Task_Type_Code 						 :Number,
    AI_Master_Clinical_Data_Task_ClosedDate  							 :Date,
    AI_Master_Clinical_Data_Task_AI_Master_Clinical_Data_Revision_ID     :Number,
    AI_Master_Clinical_Data_Task_Title                                   :String,
    AI_Master_Clinical_Data_Task_Task_Type_Name							 :String,
    AI_Master_Clinical_Data_Task_AI_Master_Clinical_Data_Revision_Code   :Number,
    AI_Master_Clinical_Data_Task_AI_Code                                 :Number,
    AI_Master_Clinical_Data_Task_Status							         :Number,

});


var AI_Tasks = module.exports = mongoose.model('RxP_AI_Master_Clinical_Data_Task', rxp_AI_MasterClinicalDataTaskSchema);


module.exports.getLastCode = function(callback){
    
    AI_Tasks.findOne({},callback).sort({AI_Master_Clinical_Data_Task_Code:-1});
}