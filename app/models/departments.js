var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var departmentsSchema = mongoose.Schema({
    
	Department_Code     			:Number,
    Department_Name     			:String,
    Department_Manager_Employee_ID  :Number
    
});


var Department =module.exports = mongoose.model('rxp_department', departmentsSchema);


module.exports.getLastCode = function(callback){
    
    Department.findOne({},callback).sort({Department_Code:-1});
}