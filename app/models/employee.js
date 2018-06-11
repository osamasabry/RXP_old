var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxpEmployeeSchema = mongoose.Schema({
    
	Employee_Code         		:Number,
    Employee_Name     			:String,
    Employee_Email     			:String,
    Employee_Address   			:String,
	Employee_City 		 		:String,
	Employee_State         		:String,
	Employee_Country       		:Number,
	Employee_Telephone       	:String,
	Employee_DateOfBirth   		:Date,
	Employee_Graduation_Year   	:String,
	Employee_Department_ID   	:Number , 
	Employee_Senior_Employee_ID :Number , 
	Employee_Note 				: String
});


var Employee = module.exports = mongoose.model('rxp_employees', rxpEmployeeSchema);

module.exports.getLastCode = function(callback){
    
    Employee.findOne({},callback).sort({Employee_Code:-1});
}

