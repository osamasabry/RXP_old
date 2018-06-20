var User        	 = require('../app/models/user');
var Account    		 = require('../app/models/account');
var AccountPlan    	 = require('../app/models/account_plan');
var SubScrib_manger  = require('../app/models/subscriber_manager');

var Country    		 = require('../app/models/countries');
var Employee       	 = require('../app/models/employee');
var OutsourceDB      = require('../app/models/outsource');
var Tools            = require('../app/models/tool');

var Employee_role    = require('../app/models/employee_role');
var Lut_role_types   = require('../app/models/lut_role_types');
var Roles      		 = require('../app/models/roles');
var Departments      = require('../app/models/departments');
var Account_user     = require('../app/models/account_user');
var System_setting     = require('../app/models/system_setting');
var bcrypt			 = require('bcrypt-nodejs');

// *************************************************


var Data_types      			= require('../app/models/field_data_types');

var AI_master_field_structur 	= require('../app/models/AI_master_field_structure');

var AI_master_field_structur_log 	= require('../app/models/AI_master_field_structure_log')


var AI      					= require('../app/models/AI');

var Pharmaceutical_category 	=require('../app/models/lut_pharmaceutical_categories');

var  AIMasterRevisions          = require('../app/models/AI_master_clinical_data_revisions'); 

var Forms                        = require('../app/models/lut_form');

var Routes                       = require('../app/models/lut_route');

var StrengthUnits				= require('../app/models/lut_strength_units');

var WeightUnits				    = require('../app/models/lut_weight_units');

var VolumeUnits				    = require('../app/models/lut_volume_units');

var SizeUnits				    = require('../app/models/lut_size_units');





var  nextCode ='';
var data = [];

var PermissionName = [];

module.exports = function(app, passport, server, generator, sgMail) {
	
	app.get('/logout', function(request, response) {
		request.logout();
		response.redirect('/');
	});

	// first route call login  
	app.get('/', function(request, response) {
		response.render('login.html', { message: request.flash('error') });
	});

	// check login 
	app.post('/', function(req, res, next) {
	  	passport.authenticate('login', function(err, user, info) {
		    if (err) { return next(err); }
		    if (!user) { return res.send(info); }
		    req.logIn(user, function(err) {
		      if (err) { return next(info); }
		      return res.send(user);
		    });
		  })(req, res, next);
	});


	// when login 
	app.get('/about',  function(request, response) {
		response.render('about.html', {
			user : request.user
		});
	});

	app.get('/addDepart',function(request, response) {
		
		response.render('add-department.html', {
			user : request.user 
		});
	});

	app.post('/addDepart',function (request, response){
		Departments.findOne({ 'Department_Name' :  request.body.name }, function(err, depart) {
    	    if (err){
    	    	return response.send({
					user : request.user ,
					message: 'Error'
				});
    	    }
            if (depart) {
            	return response.send({
					user : request.user ,
					message: 'Department already exists'
				});
            } else {
        			
    			Departments.getLastCode(function(err,depart){
    				if (depart) {
    					nextCode = Number(depart.Department_Code)+1;
    				}else{
    					nextCode = 1;
    				}
    				
    				insertNewDepartment(nextCode);
    			})   

    			function insertNewDepartment(nextCode){
	                var newDepart = new Departments();
	                newDepart.Department_Code     			 = nextCode;
		            newDepart.Department_Name 	  			 = request.body.name;
		            newDepart.Department_Manager_Employee_ID = request.body.employee_id
	                newDepart.save();


		        }
			}
		})
	});

	app.get('/getDepartments', function(request, response) {
		Departments.find({}, function(err, department) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (department) {
	        	
	            response.send(department);
	        } 
    	});
    });

    app.get('/getRoles', function(request, response) {
		Roles.find({}, function(err, role) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (role) {
	        	
	            response.send(role);
	        } 
    	});
    });

    app.get('/addEmployee',function(request, response) {
		
		response.render('add-employee.html', {
			user : request.user 
		});
	});
	
	app.post('/addEmployee',function (request, response){
		// console.log(request.body.email);
		Employee.findOne({ 'Employee_Email' :  request.body.email }, function(err, employee) {
    	    if (err){
    	    	return response.send({
					flag : false ,
					message: "Error"
				});
    	    }
            else if (employee) {
            	return response.send({
					flag : false,
					message: 'Employee Email already exists'
				});
            } else {
     
    			Employee.getLastCode(function(err,employee){
    				if (employee) {
    					nextCode = Number(employee.Employee_Code)+1;
    				}else{
    					nextCode = 1;
    				}
    				
    				insertNewEmployee(nextCode);
    			})  

    			var password = generator.generate({
				    length: 8,
				    numbers: true
				});
				
				
				function insertNewEmployee(nextCode){
					
	              	var newEmployee = new Employee();

	                newEmployee.Employee_Code               = nextCode;
		            newEmployee.Employee_Name 			    = request.body.name;
	                newEmployee.Employee_Email    		    = request.body.email;
	                newEmployee.Employee_Address 		    = request.body.address;
	    			newEmployee.Employee_City	 			= request.body.city ; 
	    			newEmployee.Employee_State	 		    = request.body.state;
	                newEmployee.Employee_Country 			= request.body.country;
	                newEmployee.Employee_Telephone      	= request.body.telephone;
	                newEmployee.Employee_DateOfBirth 	 	= request.body.date_birth;
	                newEmployee.Employee_Graduation_Year 	= request.body.grad_year;
	                newEmployee.Employee_Department_ID      = request.body.department;
	                newEmployee.Employee_Senior_Employee_ID = request.body.senior_employee;
	                newEmployee.Employee_Note              	= request.body.extra_details;
	                newEmployee.save();

	                var newUser = new User();

	                newUser.User_Code             	   = nextCode;
		            newUser.User_Name 	     	  	   = request.body.email;
	                newUser.User_Password    	  	   = newUser.generateHash(password);
	                newUser.User_IsActive              = 1;
	                newUser.User_Employee_ID           = nextCode;
	                newUser.User_Permissions_List      = request.body.ids_permissions;

	                newUser.save();
					 const msg = {
					  to: request.body.email,
					  from: 'osamasabry14@gmail.com',
					  subject: 'Account Login',
					  text: 'and easy to do anywhere, even with Node.js',
					  html: '<h1>Hello mr'+request.body.name+'</h1><br><p>userName:'+request.body.email+'</p><br>Password:'+password,
					};
					console.log(msg);
					sgMail.send(msg); 

                	response.send({flag: true});
				}	
					
            }
        });
	});

	app.get('/addAccount',function(request, response) {
		
		response.render('add-account.html', {
			user : request.user 
		});
	});

	app.get('/getCountries', function(request, response) {
		Country.find({}, function(err, country) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (country) {
	        	
	            response.send(country);
	        } 
    	});
    });

	app.get('/getRolesType', function(request, response) {
		Lut_role_types.find({}, function(err, roletype) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (roletype) {
	        	
	            response.send(roletype);
	        } 
    	});
    });

	app.get('/getEmployees', function(request, response) {
		Employee.find({}, function(err, employee) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (employee) {
	        	
	            response.send(employee);
	        } 
    	});
    });

	app.get('/getAccounts', function(request, response) {
		Account.find({}, function(err, account) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (account) {
	        	
	            response.send(account);
	        } 
    	});
    });
	
	app.get('/assignRole', function(request, response) {
    	
    	response.render('assign-role.html', {
			user : request.user 
		});
    });

	app.post('/assignRole',function (request, response){
		
		Employee_role.getLastCode(function(err,emp_role){
			if (emp_role) {
				nextCode = Number(emp_role.Employee_Role_Code)+1;
			}else{
				nextCode = 1;
			}
			insertEmpRole(nextCode);
		})   
		
		function insertEmpRole(nextCode){

			var newEmpRole = new Employee_role();
			newEmpRole.Employee_Role_Code  					    = nextCode;
			newEmpRole.Employee_Role_Employee_Code     	 	    =request.body.employee_id;
			newEmpRole.Employee_Role_Role_Code                  =request.body.role;
		    newEmpRole.Employee_Role_Type_Code                  =request.body.roletype;
		    newEmpRole.Employee_Role_Country_Code     		    =(request.body.country_role)? request.body.country_role : 0 ;
			newEmpRole.Employee_Role_AccountData_Account_Code   =(request.body.account) ? request.body.account : 0;
			newEmpRole.Employee_Role_AssignedBy_Employee_Code   = request.body.User_Code;
			newEmpRole.Employee_Role_AssignedDate 			    = new Date();
			newEmpRole.Employee_Role_Status 				    = 1;

            newEmpRole.save();

        	response.send({message: true});
		}	
	});

	app.post('/unAssignRole',function (request, response){

		Employee_role.findOne({ 'Employee_Role_Code' :  request.body.row_id }, function(err, emp) {
    	    if (err){
    	    	response.send({message: 'Error'});
    	    }
            if (emp) {
				/* note 
					if y want save UnAssignedBy_Employee_Id
						1- add auth to rout 
						2- call function emp.unAssignRole(request.user.User_Code);
						3- go to model employee_role.js and add param in function unAssignRole(user_id) 
						4- go to model employee_role.js and active line this.Employee_Role_UnAssignedBy_Employee_Code = user_id;
				*/             	
        		emp.unAssignRole();
        		response.send({message: true});
        	}
                
        }) 
    });
   	

	app.post('/getRolsByEmployeeId',function (request, response){
		// console.log(request.body.employee_code);
		// console.log(parseInt(request.body.employee_code));
		var Searchquery = Number(request.body.employee_code); 
		// console.log(Searchquery);
		Employee_role.find({ $and:[ {'Employee_Role_Employee_Code':Searchquery}, {'Employee_Role_Status':0} ]},function(err, emp_role) {
			if (err){
	    		return response.send({
					message: err
				});
	    	}
	    	if (emp_role.length == 0) {
				return response.send({
					// user : request.user ,
					message: 'No Roles Found !!'
				});
        	} else {
				return response.send({
					user : request.user ,
					emp_role: emp_role
				});
			}
		})
    });


   	app.get('/allEmployees', function(request, response) {
    	response.render('all-employees.html', {
			user : request.user ,
		});
	});


	app.get('/allDeparts', function(request, response) {
    	response.render('all-departs.html', {
			user : request.user ,
		});
	});

    app.get('/getOutSourceDBs', function(request, response) {
		OutsourceDB.find({}, function(err, db) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (db) {
	        	
	            response.send(db);
	        } 
    	});
    });

    app.get('/getTools',function(request, response) {
		Tools.find({}, function(err, tool) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (tool) {
	        	
	            response.send(tool);
	        } 
    	});
    });

	app.post('/addAccount',function (request, response){
		// /console.log(request.body.name);
		Account.findOne({ 'Account_Name' :  request.body.name }, function(err, account) {
    	    if (err){
    	    	return response.send({
					user : request.user ,
					message: 'Error'
				});
    	    }
            if (account) {
            	return response.send({
					user : request.user ,
					message: 'User Account already exists'
				});
            } else {
        			
    			Account.getLastCode(function(err,account){
    			 	nextCode = Number(account.Account_Code)+1;
    				 insertNewAcount(nextCode);

    			})   
				
    			var password = generator.generate({
				    length: 8,
				    numbers: true
				});

				function insertNewAcount(nextCode){
					
					 // general data save in table account       
	              var newAccount = new Account();

	                newAccount.Account_Code              = nextCode;
		            newAccount.Account_Name 			 = request.body.name;
	                newAccount.Account_Address    		 = request.body.address;
	               // newAccount.password 		 		 = newAccount.generateHash(password);
	    			newAccount.Account_City	 			 = request.body.city ; 
	    			newAccount.Account_State	 		 = request.body.state;
	                newAccount.Account_Country 			 = request.body.country;
	                newAccount.Account_Telephone  		 = request.body.telephone;
	                newAccount.Account_Account_manager 	 = request.body.account_manage;
	                newAccount.Account_Sales_rep 		 = request.body.sales_rep;
	                newAccount.Account_Cms_manager       = request.body.cms_manager;
	                newAccount.Account_Parent_account    = request.body.parent_account;
	                newAccount.Account_Note              = request.body.extra_details;
	                newAccount.save();


	    			// plan of account save in table account plan

	                var accountPlan = new AccountPlan();

	                accountPlan.code              	    = nextCode;
		            accountPlan.interface 	     	    = request.body.interface;
	                accountPlan.out_source_dbs    	    = request.body.out_source_dbs;
	                accountPlan.out_source_tools         = request.body.out_source_tools;
	                accountPlan.max_concurrent_users     = request.body.max_concurrent;
	                accountPlan.max_users  			 	= request.body.max_users;
	                accountPlan.can_custom_medicaldata   = request.body.can_custom;
	                accountPlan.way_of_access  			= request.body.way_access;
	                accountPlan.list_ips  				= request.body.list_ips;

	                accountPlan.save();


	     			// plan of account save in table subscribe account manager

	    			var subcscribe_manager = new SubScrib_manger();

	    			subcscribe_manager.code     	 	=nextCode;
					subcscribe_manager.subscribe_name   =request.body.subscriber_name;
				    subcscribe_manager.email            =request.body.subscriber_email;
				    subcscribe_manager.phone     		=request.body.subscriber_phone;
					subcscribe_manager.mobile	     	=request.body.subscriber_mobile;
					subcscribe_manager.role      		=request.body.subscriber_role;
					subcscribe_manager.period_of_month  =request.body.period_of_month;
					subcscribe_manager.start_date 		=request.body.start_date;
					subcscribe_manager.end_date 		=request.body.end_date;
					subcscribe_manager.subscribe_note 	=request.body.subscriber_details;

	                subcscribe_manager.save();


	                var newAccountUser = new Account_user();

	                newAccountUser.User_Code              = nextCode;
		            newAccountUser.User_Name 	     	  = request.body.email;
	                newAccountUser.User_Password    	  = newAccount.generateHash(password);
	                AccountUser_Account_ID   				= nextCode;
	                newAccountUser.save();

	           		const msg = {
					  to: 'osamasabry14@gmail.com',
					  from: 'osamasabry14@gmail.com',
					  subject: 'Account Login',
					  text: 'and easy to do anywhere, even with Node.js',
					  html: '<h1>Hello mr'+request.body.name+'</h1><br><p>userName:'+request.body.email+'</p><br>Password:'+password,
					};
					sgMail.send(msg);
				}	
					
  				return response.send({
					user : request.user ,
					message: 'Account Added Succussfully'
				});
            }
        });
	});



	app.get('/searchAccount', function(request, response) {
    	response.render('search-account.html', {
			user : request.user ,
		});
	});

	app.post('/searchAccount', function(request, response) {
		var Searchquery = request.body.searchField;
		if(isNaN(Searchquery)){

			Account.find({Account_Name:{$regex:Searchquery}},function(err, account) {
				if (err){
    	    		return response.send({
						user : request.user ,
						message: err
					});
    	    	}

    	    	if (account.length == 0) {
					return response.send({
						user : request.user ,
						message: 'No Account Found !!'
					});
            	} else {
					return response.send({
						user : request.user ,
						accounts: account
					});
				}
			})

		}else{
			Account.find({Account_Code:Searchquery},function(err, account) {
				if (err){
    	    		return response.send({
						user : request.user ,
						message: err
					});
    	    	}

    	    	if (account.length == 0) {
					return response.send({
						user : request.user ,
						message: 'No Account Found !!'
					});
            	} else {
					return response.send({
						user : request.user ,
						accounts: account
					});
				}
			})
		} 	
	});


	app.get('/changePassword',  function(request, response) {
		response.render('change-password.html', {
			user : request.user
		});
	});

	app.post('/changePassword',function (request, response){

		User.findOne({ 'email' :  request.user.email }, function(err, user) {
    	    if (err){
    	    	response.send({message: 'Error'});
    	    }
            if (user) {
            	if (!user.verifyPassword(request.body.old_password)){
    				// console.log("Enter correct password");
                    response.send({message: false});
            	}else{
            		user.updatePassword(request.body.new_password);
                	response.send({message: true});
            	}
                
            } 
        });
	});

	
	app.get('/viewAccount', function(request, response) {	
		Account.findOne({ Account_Code : request.query.id }, function(err, account) {
    	    if (err){
    	    	return response.send({
					user : request.user ,
					message: 'Error'
				});
    	    }else {
             	data['account'] = account;
			}
    	});
    	AccountPlan.findOne({ code : request.query.id }, function(err, accountPlan) {
    	    if (err){
    	    	return response.send({
					user : request.user ,
					message: 'Error'
				});
    	    }else {
             	data['accountPlan'] = accountPlan;
			}
    	});
    	SubScrib_manger.findOne({ code : request.query.id }, function(err, subscribeManager) {
    	    if (err){
    	    	return response.send({
					user : request.user ,
					message: 'Error'
				});
    	    }else {
             	data['subscribeManager'] = subscribeManager;
             	getData();
			}
    	});

    	function getData(){
    		console.log(data);
    		response.render('view-account.html', {
				user : request.user,
				account : data['account'],
				accountPlan : data['accountPlan'],
				subscribeManager : data['subscribeManager']
			});
    	};
	});

	app.get('/getCountry', function(request, response) {
		Country.findOne({Country_Code : request.query.code}, function(err, country) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (country) {
	            response.send(country);
	        } 
    	});
    });
	app.get('/getEmployee', function(request, response) {
		Employee.findOne({Employee_Code:request.query.code}, function(err, accountManager) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (accountManager) {
	            response.send(accountManager);
	        } 
    	});
    });

    app.get('/getAccount', function(request, response) {
		Account.findOne({Account_Code:request.query.code}, function(err, account) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (account) {
	        	
	            response.send(account);
	        } 
    	});
    });

    app.get('/getOutSourceDB', function(request, response) {
		OutsourceDB.findOne({code:request.query.code}, function(err, outsourceDB) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (outsourceDB) {
	            response.send(outsourceDB);
	        } 
    	});
    });

    app.get('/getTool', function(request, response) {
			Tools.findOne({code:request.query.code}, function(err, tool) {
			    if (err){
			    	response.send({message: 'Error'});
			    }
		        if (tool) {
		        	console.log(tool);
		            response.send(tool);
		        } 
    		});
    });

    app.post('/getpermission', function(request, response) {
			User.findOne({User_Code:request.body.code}, function(err, user) {
			    if (err){
			    	response.send({message: 'Error'});
			    }
		        if (user) {
					var ids = user.User_Permissions_List.split(',');
					var permissionList = [];
					async function getUserPermissions(){
						for (var i = 0; i < ids.length; i++) {
						 	permissionList[i] = await getPermisionName(ids[i]);
						}
						response.send(permissionList);
					}
					function getPermisionName(oneId) {
						return new Promise((resolve, reject) => {
							System_setting.find({ System_Setting_ConfigName: "CP_Users_Permissions" },
								{'System_Setting_ConfigValue': { $elemMatch: { Permission_ID: oneId} } }, function(err, permission) { 
									resolve(permission[0].System_Setting_ConfigValue[0]['PermissionName']);
							})
						})
					}
					getUserPermissions();
				} 


    		});
    });


    // **************************************************

    // new route

    	// get all data types of fields 
	app.get('/getDataTypes', function(request, response) {
		Data_types.find({}, function(err, Datatypes) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (Datatypes) {
	        	
	            response.send(Datatypes);
	        } 
    	});
    });
	

	// insert AI Master Fields Structure 

	app.post('/addFieldsAI',function (request, response){
		AI_master_field_structur.findOne({ 'AI_Master_Clinical_Data_Field_Structure_FieldName' :  request.body.name }, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (field) {
            	return response.send({
					// user : request.user ,
					message: 'Field already exists'
				});
            } else {
        			
    			AI_master_field_structur.getLastCode(function(err,field){
    				if (field) {
    					nextCode = Number(field.AI_Master_Clinical_Data_Field_Structure_Code)+1;
    				}else{
    					nextCode = 1;
    				}
    				
    				insertNewFieldAI(nextCode);
    			})   

    			function insertNewFieldAI(nextCode){
	                var newFieldAi = new AI_master_field_structur();
	                newFieldAi.AI_Master_Clinical_Data_Field_Structure_Code     			        = nextCode;
		            newFieldAi.AI_Master_Clinical_Data_Field_Structure_FieldName 	  			    = request.body.name;
		            newFieldAi.AI_Master_Clinical_Data_Field_Structure_Field_Structure_DataType_ID  = request.body.datatype;
	                newFieldAi.AI_Master_Clinical_Data_Field_Structure_IsMandatory					= request.body.require;
	                newFieldAi.AI_Master_Clinical_Data_Field_Structure_IsActive                     = 0;        
	                newFieldAi.save();


	                var  AILog = new AI_master_field_structur_log();

	                AILog.AI_Master_Clinical_Data_Field_Structure_Log_Code     			            = nextCode;
		            AILog.AI_Master_Clinical_Data_Field_Structure_Log_FieldName 	  			    = request.body.name;
		            AILog.AI_Master_Clinical_Data_Field_Structure_Log_Field_Structure_DataType_ID   = request.body.datatype;
	                AILog.AI_Master_Clinical_Data_Field_Structure_Log_IsMandatory					= request.body.require;
	              //  AILog.AI_Master_Clinical_Data_Field_Structure_Log_CreatedBy_Employee_ID		    = request.user.User_Code;
	                AILog.AI_Master_Clinical_Data_Field_Structure_Log_CreatedDate					= new Date();
	                AILog.AI_Master_Clinical_Data_Field_Structure_Log_IsActive                      = 0; 
	                AILog.save();


	                return response.send({
						message: true
					});
		        }
			}
		})
	});


	// edit AI Master Fields Struture 

	app.post('/editFieldsAI',function (request, response){

		var newvalues = { $set: {
				AI_Master_Clinical_Data_Field_Structure_FieldName 					: request.body.name,
				AI_Master_Clinical_Data_Field_Structure_Field_Structure_DataType_ID : request.body.datatype, 
				AI_Master_Clinical_Data_Field_Structure_IsMandatory 				: request.body.require,
				AI_Master_Clinical_Data_Field_Structure_IsActive 					: request.body.status,
			} };

		var myquery = { AI_Master_Clinical_Data_Field_Structure_Code: request.body.row_id }; 


		AI_master_field_structur.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Field not exists'
				});
            } else {

            	// console.log(field);
        			
    			AI_master_field_structur_log.getLastCode(function(err,field){
    				if (field) {
    					nextCode = Number(field.AI_Master_Clinical_Data_Field_Structure_Log_Code)+1;
    				}else{
    					nextCode = 1;
    				}
    				
    				insertNewFieldAILog(nextCode);
    			})   

    			function insertNewFieldAILog(nextCode){

    				var  AILog = new AI_master_field_structur_log();

	                AILog.AI_Master_Clinical_Data_Field_Structure_Log_Code     			            = nextCode;
		            AILog.AI_Master_Clinical_Data_Field_Structure_Log_FieldName 	  			    = request.body.name;
		            AILog.AI_Master_Clinical_Data_Field_Structure_Log_Field_Structure_DataType_ID   = request.body.datatype;
	                AILog.AI_Master_Clinical_Data_Field_Structure_Log_IsMandatory					= request.body.require;
	              //  AILog.AI_Master_Clinical_Data_Field_Structure_Log_CreatedBy_Employee_ID		    = request.user.User_Code;
	                AILog.AI_Master_Clinical_Data_Field_Structure_Log_CreatedDate					= new Date();
		            AILog.AI_Master_Clinical_Data_Field_Structure_Log_IsActive                      = request.body.status; 
	                
	                AILog.save();


	                return response.send({
						message: true
					});

	    			}
                
			}
		})
	});

	// get all Fields of AI
	app.get('/getFieldsAI', function(request, response) {
		AI_master_field_structur.find({}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
    });


	// insert Pharmaceutical Category 
	app.post('/addPharmaceuticalCategory',function (request, response){
		Pharmaceutical_category.findOne({ 'Pharmaceutical_Category_Name' :  request.body.name }, function(err, Pharmaceutical) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (Pharmaceutical) {
            	return response.send({
					// user : request.user ,
					message: 'Pharmaceutical Category already exists'
				});
            } else {
        			
    			Pharmaceutical_category.getLastCode(function(err,Pharmaceutical){
    				if (Pharmaceutical) {
    					nextCode = Number(Pharmaceutical.Pharmaceutical_Category_Code)+1;
    				}else{
    					nextCode = 1;
    				}
    				
    				insertNewPharmaceuticalCategory(nextCode);
    			})   

    			function insertNewPharmaceuticalCategory(nextCode){
	                var newPharmaCategory = new Pharmaceutical_category();
	                newPharmaCategory.Pharmaceutical_Category_Code     	 = nextCode;
		            newPharmaCategory.Pharmaceutical_Category_Name 	     = request.body.name;
	                newPharmaCategory.Pharmaceutical_Category_IsActive	 = request.body.status;
	                newPharmaCategory.save();

	                return response.send({
						message: true
					});
		        }
			}
		})
	});

	// get all  Pharmaceutical Category 

	app.get('/getPharmaceuticalCategory', function(request, response) {
		Pharmaceutical_category.find({}, function(err, Pharmaceutical) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (Pharmaceutical) {
	        	
	            response.send(Pharmaceutical);
	        } 
    	});
    });


	// insert basic data of AI 

	app.post('/addAI',function (request, response){
		AI.findOne({ 'AI_Name' :  request.body.name }, function(err, ai) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (ai) {
            	return response.send({
					// user : request.user ,
					message: 'AI already exists'
				});
            } else {
        			
    			AI.getLastCode(function(err,ai){
    				if (ai) {
    					nextCode = Number(ai.AI_Code)+1;
    				}else{
    					nextCode = 1;
    				}
    				
    				insertNewAI(nextCode);
    			})   

    			function insertNewAI(nextCode){
	                var newAi = new AI();
	                newAi.AI_Code     	 					 = nextCode;
		            newAi.AI_Name 	     					 = request.body.name;
	                newAi.AI_ATC_Code	 					 = request.body.atc_code;
	                newAi.AI_Status	     					 = null;
	                newAi.AI_Pharmaceutical_Categories_ID    = request.body.category_Ids
	                newAi.save();

	                return response.send({
						message: true
					});
		        }
			}
		})
	});

	// get  basic data of AI 
	app.get('/getAI', function(request, response) {
		AI.find({}, function(err, ai) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (ai) {
	        	
	            response.send(ai);
	        } 
    	});
    });

	
	// insert data of AI master Clinical Revision 
	
	app.post('/addAIMasterClinicalRevisions',function (request, response){

		AIMasterRevisions.getLastCode(function(err,field){
			
			if (field) {
				nextCode = Number(field.AI_Master_Clinical_Data_Revision_Code)+1;
			}else{
				nextCode = 1;
			}
			
			insertNewAIRevision(nextCode);
		})  

		function insertNewAIRevision(nextCode){

			request.body['AI_Master_Clinical_Data_Revision_Code'] = nextCode;

			newAIMasterRevision = new AIMasterRevisions(request.body);

			newAIMasterRevision.save(function(err,doc){
		        if(err){
		            console.log('error occured..'+err);
		        }
		        else{
		            console.log(doc);
		        }
		    });
		}

	});

<<<<<<< HEAD
	app.get('/getForm', function(request, response) {
		Forms.find({}, function(err, form) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (form) {
	        	
	            response.send(form);
	        } 
    	});
    });

	app.get('/getRoute', function(request, response) {
		Routes.find({}, function(err, route) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (route) {
	        	
	            response.send(route);
	        } 
    	});
    });

    app.get('/getStrengthUnits', function(request, response) {
		StrengthUnits.find({}, function(err, strengthUnits) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (strengthUnits) {
	        	
	            response.send(strengthUnits);
	        } 
    	});
    });

    app.get('/getWeightUnits', function(request, response) {
		WeightUnits.find({}, function(err, WeightUnits) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (WeightUnits) {
	        	
	            response.send(WeightUnits);
	        } 
    	});
    });

    app.get('/getVolumeUnits', function(request, response) {
		VolumeUnits.find({}, function(err, VolumeUnits) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (VolumeUnits) {
	        	
	            response.send(VolumeUnits);
	        } 
    	});
    });

    app.get('/getSizeUnits', function(request, response) {
		SizeUnits.find({}, function(err, SizeUnits) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (SizeUnits) {
	        	
	            response.send(SizeUnits);
	        } 
    	});
    });



    app.post('/addForm',function (request, response){
		Forms.findOne({ 'Form_Name' :  request.body.name }, function(err, Form) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (Form) {
            	return response.send({
					// user : request.user ,
					message: 'Form Name already exists'
				});
            } else {
        			
    			Forms.getLastCode(function(err,Form){
    				if (Form) {
    					nextCode = Number(Form.Form_Code)+1;
    				}else{
    					nextCode = 1;
    				}
    				
    				insertNewForm(nextCode);
    			})   

    			function insertNewForm(nextCode){
	                var newForm = new Forms();
	                newForm.Form_Code     	 		 = nextCode;
		            newForm.Form_Name 	     		 = request.body.name;
		            newForm.Form_Description 	     = request.body.desc;
	                newForm.Form_IsActive	         = 0;
	                newForm.save();

	                return response.send({
						message: true
					});
		        }
			}
		})
	});

    app.post('/addRoute',function (request, response){
		Routes.findOne({ 'Route_Name' :  request.body.name }, function(err, Route) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (Route) {
            	return response.send({
					// user : request.user ,
					message: 'Route Name already exists'
				});
            } else {
        			
    			Routes.getLastCode(function(err,Route){
    				if (Route) {
    					nextCode = Number(Route.Route_Code)+1;
    				}else{
    					nextCode = 1;
    				}
    				
    				insertNewRoute(nextCode);
    			})   

    			function insertNewRoute(nextCode){
	                var newRoute = new Routes();
	                newRoute.Route_Code     	 		 = nextCode;
		            newRoute.Route_Name 	     		 = request.body.name;
		            newRoute.Route_Description 	         = request.body.desc;
	                newRoute.Route_IsActive	             = 0;
	                newRoute.save();

	                return response.send({
						message: true
					});
		        }
			}
		})
	});

    app.post('/addStrengthUnits',function (request, response){
		StrengthUnits.findOne({ 'StrengthUnit_Name' :  request.body.name }, function(err, StrengthUnit) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (StrengthUnit) {
            	return response.send({
					// user : request.user ,
					message: 'StrengthUnit Name already exists'
				});
            } else {
        			
    			StrengthUnits.getLastCode(function(err,StrengthUnit){
    				if (StrengthUnit) {
    					nextCode = Number(StrengthUnit.StrengthUnit_Code)+1;
    				}else{
    					nextCode = 1;
    				}
    				
    				insertNewStrengthUnit(nextCode);
    			})   

    			function insertNewStrengthUnit(nextCode){
	                var newStrengthUnit = new StrengthUnits();
	                newStrengthUnit.StrengthUnit_Code     	 		 = nextCode;
		            newStrengthUnit.StrengthUnit_Name 	     		 = request.body.name;
		            newStrengthUnit.StrengthUnit_Description 	     = request.body.desc;
	                newStrengthUnit.StrengthUnit_IsActive	         = 0;
	                newStrengthUnit.save();

	                return response.send({
						message: true
					});
		        }
			}
		})
	});

	app.post('/addWeightUnits',function (request, response){
		WeightUnits.findOne({ 'WeightUnit_Name' :  request.body.name }, function(err, WeightUnit) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (WeightUnit) {
            	return response.send({
					// user : request.user ,
					message: 'Weight Unit Name already exists'
				});
            } else {
        			
    			WeightUnits.getLastCode(function(err,WeightUnit){
    				if (WeightUnit) {
    					nextCode = Number(WeightUnit.WeightUnit_Code)+1;
    				}else{
    					nextCode = 1;
    				}
    				
    				insertNewWeightUnit(nextCode);
    			})   

    			function insertNewWeightUnit(nextCode){
	                var newWeightUnit = new WeightUnits();
	                newWeightUnit.WeightUnit_Code     	 		 = nextCode;
		            newWeightUnit.WeightUnit_Name 	     		 = request.body.name;
		            newWeightUnit.WeightUnit_Description 	     = request.body.desc;
	                newWeightUnit.WeightUnit_IsActive	         = 0;
	                newWeightUnit.save();

	                return response.send({
						message: true
					});
		        }
			}
		})
	});

	app.post('/addVolumeUnits',function (request, response){
		VolumeUnits.findOne({ 'VolumeUnit_Name' :  request.body.name }, function(err, VolumeUnit) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (VolumeUnit) {
            	return response.send({
					// user : request.user ,
					message: 'Volume Unit Name already exists'
				});
            } else {
        			
    			VolumeUnits.getLastCode(function(err,VolumeUnit){
    				if (VolumeUnit) {
    					nextCode = Number(VolumeUnit.VolumeUnit_Code)+1;
    				}else{
    					nextCode = 1;
    				}
    				
    				insertNewVolumeUnit(nextCode);
    			})   

    			function insertNewVolumeUnit(nextCode){
	                var newVolumeUnit = new VolumeUnits();
	                newVolumeUnit.VolumeUnit_Code     	 		 = nextCode;
		            newVolumeUnit.VolumeUnit_Name 	     		 = request.body.name;
		            newVolumeUnit.VolumeUnit_Description 	     = request.body.desc;
	                newVolumeUnit.VolumeUnit_IsActive	         = 0;
	                newVolumeUnit.save();

	                return response.send({
						message: true
					});
		        }
			}
		})
	});

	app.post('/addSizeUnits',function (request, response){
		SizeUnits.findOne({ 'SizeUnit_Name' :  request.body.name }, function(err, SizeUnit) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (SizeUnit) {
            	return response.send({
					// user : request.user ,
					message: 'Volume Unit Name already exists'
				});
            } else {
        			
    			SizeUnits.getLastCode(function(err,SizeUnit){
    				if (SizeUnit) {
    					nextCode = Number(SizeUnit.SizeUnit_Code)+1;
    				}else{
    					nextCode = 1;
    				}
    				
    				insertNewSizeUnit(nextCode);
    			})   

    			function insertNewSizeUnit(nextCode){
	                var newSizeUnit = new SizeUnits();
	                newSizeUnit.SizeUnit_Code     	 		 = nextCode;
		            newSizeUnit.SizeUnit_Name 	     		 = request.body.name;
		            newSizeUnit.SizeUnit_Description 	     = request.body.desc;
	                newSizeUnit.SizeUnit_IsActive	         = 0;
	                newSizeUnit.save();

	                return response.send({
						message: true
					});
		        }
			}
		})
	});
	//get a hasshed password tobe saved at client Cookie
	app.get('/getHashedStrings', function(request, response) {
		response.send(bcrypt.hashSync(request.body.sttohash, bcrypt.genSaltSync(8), null));
    });


   
};
function auth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

