var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_EmployeeRoleSchema = mongoose.Schema({
    
	Employee_Role_Employee_Code     	  	:Number,
    Employee_Role_Role_Code     	 		:Number,
    Employee_Role_Type_Code  				:Number,
    Employee_Role_Country_Code 				:Number,
    Employee_Role_AccountData_Account_Code 	:Number
});


var Emp_role = module.exports = mongoose.model('rxp_employee_role', rxp_EmployeeRoleSchema);


module.exports.getLastCode = function(callback){
    
    Emp_role.findOne({},callback).sort({Employee_Code:-1});
}