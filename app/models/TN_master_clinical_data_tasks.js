var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_TN_MasterClinicalDataTaskSchema = mongoose.Schema({
    
    TN_Master_Clinical_Data_Task_Code                                    :Number,
    TN_Master_Clinical_Data_Task_AssignDate                              :Date,
    TN_Master_Clinical_Data_Task_AssignTo_Employee_Code                  :Number,
    TN_Master_Clinical_Data_Task_Task_Type_Code                          :Number,
    TN_Master_Clinical_Data_Task_ClosedDate                              :Date,
    TN_Master_Clinical_Data_Task_Title                                   :String,
    TN_Master_Clinical_Data_Task_Task_Type_Name                          :String,
    TN_Master_Clinical_Data_Task_TN_Master_Revision_Code                 :Number,
    TN_Master_Clinical_Data_Task_Status                                  :Number,

});


var TN_Tasks = module.exports = mongoose.model('RxP_TN_Master_Clinical_Data_Task', rxp_TN_MasterClinicalDataTaskSchema);


module.exports.getLastCode = function(callback){
    
    TN_Tasks.findOne({},callback).sort({TN_Master_Clinical_Data_Task_Code:-1});
}