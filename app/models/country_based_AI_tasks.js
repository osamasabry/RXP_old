var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_CountryBasedAITaskSchema = mongoose.Schema({
    
    CountryBasedAITask_Code                                    :Number,
    CountryBasedAITask_AssignDate                              :Date,
    CountryBasedAITask_AssignTo_Employee_Code                  :Number,
    CountryBasedAITask_Task_Type_Code                          :Number,
    CountryBasedAITask_ClosedDate                              :Date,
    CountryBasedAITask_Title                                   :String,
    CountryBasedAITask_Task_Type_Name                          :String,
    CountryBasedAITask_Revision_Code                           :Number,
    CountryBasedAITask_Status                                  :Number,

});


var CountryBasedAITask = module.exports = mongoose.model('rxp_country_based_ai_task', rxp_CountryBasedAITaskSchema);


module.exports.getLastCode = function(callback){
    
    CountryBasedAITask.findOne({},callback).sort({CountryBasedAITask_Code:-1});
}