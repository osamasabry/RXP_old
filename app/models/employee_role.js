var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_EmployeeRoleSchema = mongoose.Schema({
    
	Employee_Role_Code 						 :Number,
	Employee_Role_Employee_Code     	  	 :Number,
    Employee_Role_Role_Code     	 		 :Number,
    Employee_Role_Type_Code  				 :Number,
    Employee_Role_Country_Code 				 :Number,
    Employee_Role_AccountData_Account_Code 	 :Number,
    Employee_Role_AssignedBy_Employee_Code   :Number,
    Employee_Role_AssignedDate 				 :Date,
    Employee_Role_Status 					 :Number,
    Employee_Role_UnAssignedBy_Employee_Code :Number,
    Employee_Role_UnAssignedDate 			 :Date
});



rxp_EmployeeRoleSchema.methods.unAssignRole = function(by_user_id) {

	// console.log(row_id);
    this.Employee_Role_Status = 0;
    this.Employee_Role_UnAssignedDate = new Date();
    this.Employee_Role_UnAssignedBy_Employee_Code = by_user_id;
	this.save();
};


var Emp_role = module.exports = mongoose.model('rxp_employee_roles', rxp_EmployeeRoleSchema);


module.exports.getLastCode = function(callback){
    
    Emp_role.findOne({},callback).sort({Employee_Role_Code:-1});
}

