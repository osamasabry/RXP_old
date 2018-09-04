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
var System_setting   = require('../app/models/system_setting');
var bcrypt			 = require('bcrypt-nodejs');


// *************************************************


var Data_types      		   = require('../app/models/field_data_types');


var AI      				   = require('../app/models/AI');

var AIRevisions    		       = require('../app/models/AI_master_clinical_data_revisions');

var AIHistory      			   = require('../app/models/AI_history');

var AITasks                    = require('../app/models/AI_master_clinical_data_tasks');


var Pharmaceutical_category    =require('../app/models/lut_pharmaceutical_categories');


var Forms                      = require('../app/models/lut_form');

var Routes                     = require('../app/models/lut_route');

var Concentration              = require('../app/models/lut_concentration');

var StrengthUnits			   = require('../app/models/lut_strength_units');

var WeightUnits				   = require('../app/models/lut_weight_units');

var VolumeUnits				   = require('../app/models/lut_volume_units');

var SizeUnits				   = require('../app/models/lut_size_units');


var TN     					   = require('../app/models/TN');

var TNRevisions                = require('../app/models/TN_master_clinical_data_revisions');

var TNTasks                    = require('../app/models/TN_master_clinical_data_tasks');

var TNHistory      			   = require('../app/models/TN_history');

var UsageDoseUnit              = require('../app/models/lut_usage_dose_unit');


var UsageDoseDuration          = require('../app/models/lut_usage_dose_duration_unit');

var UsageDoseType              = require('../app/models/lut_usage_dose_types');

var UsageFrequenInterval       = require('../app/models/lut_usage_frequency_interval_unit');

var UsageAge      			   = require('../app/models/lut_usage_age');

var Currency       			   = require('../app/models/lut_currency');

var MedicalCondition           = require('../app/models/lut_medical_condition');



var CountryBasedAI             = require('../app/models/country_based_AI');

var CountryBasedAIRevision     = require('../app/models/country_based_AI_revision');

var CountryBasedAIHistory      = require('../app/models/country_based_AI_history');

var CountryBasedAITasks        = require('../app/models/country_based_AI_tasks');





var  nextCode ='';
var data = [];

var PermissionName = [];

var NotificationDetails = {};

var clients = [];


module.exports = function(app, passport, server, generator, sgMail,io) {
	
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


	io.sockets.on('connection', function (socket) {
		socket.on('add-user', function(data){
			console.log(data);
			var ConnctedUser ={};
			// var ConnctedUser2 ={};
			// var ConnctedUser3 ={};
			ConnctedUser.UserID = data.id;
			ConnctedUser.Socket = socket.id
			// clients[data.id] = {
			// "socket": socket.id
			// };
			// ConnctedUser2.UserID = data.id;
			// ConnctedUser2.Socket = 'hqo5PjzSacMV_ZEQAAAB'

			// ConnctedUser3.UserID = 3;
			// ConnctedUser3.Socket = 'hqo5PjzSacMV_ZEQAA99933322AB'

			clients.push(ConnctedUser);
			// clients.push(ConnctedUser2);
			// clients.push(ConnctedUser3);
			
		});
	   // / /Removing the socket on disconnect
		socket.on('disconnect', function() {
		for(var name in clients) {
			if(clients[name].socket === socket.id) {
				delete clients[name];
				break;
			}
		}	
		})
	})
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
					newUser.User_DisplayName		   = request.body.display_name;
	                newUser.User_IsActive              = 1;
					newUser.User_Employee_ID           = nextCode;
					newUser.User_Permissions           = [];
	                newUser.User_Permissions_List      = request.body.ids_permissions;

	                newUser.save();
					 const msg = {
					  to: request.body.email,
					  from: 'dev@pharmedsolutions.com',
					  subject: 'Account Login',
					  text: 'Hello mr'+request.body.name+' userName:'+request.body.email+' Password:'+password,
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
		Country.find({Country_IsActive:1}, function(err, country) {
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
			newEmpRole.Employee_Role_Sub_Role_Type              = request.body.sub_role_type;
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
        		emp.unAssignRole(request.body.byuserid);
        		response.send({message: true});
        	}
                
        }) 
    });
   	

	app.post('/getRolsByEmployeeId',function (request, response){
		// console.log(request.body.employee_code);
		// console.log(parseInt(request.body.employee_code));
		var Searchquery = Number(request.body.employee_code); 
		// console.log(Searchquery);
		Employee_role.find({ $and:[ {'Employee_Role_Employee_Code':Searchquery}, {'Employee_Role_Status':1} ]},function(err, emp_role) {
			if (err){
	    		return response.send({
					message: err
				});
	    	}
	    	if (emp_role.length == 0) {
				return response.send({
					// user : request.user ,
					message: 'No Roles Found !!',
					length: emp_role.length
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
						to: request.body.email,
						from: 'dev@pharmedsolutions.com',
						subject: 'Account Login',
						text: '<h1>Hello mr'+request.body.name+'</h1><br><p>userName:'+request.body.email+'</p><br>Password:'+password,
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
	
	
	// insert Pharmaceutical Category 
	app.post('/addPharmaceuticalCategory',function (request, response){	
		async function getLastPharmaceuticalCat(){
			var pharmceuticalCatNextCode = await getNextPhamcuticalCat();
			insetIntoPharmacuticalCat(pharmceuticalCatNextCode);
		}
		function getNextPhamcuticalCat(){
			return new Promise((resolve, reject) => {
				Pharmaceutical_category.getLastCode(function(err,Pharmaceutical){
					if (Pharmaceutical) 
						resolve( Number(Pharmaceutical.Pharmaceutical_Category_Code)+1);
					else
						resolve(1);
				})
			})
		};
		function insetIntoPharmacuticalCat(PharCeuCatnextCode){
			var newPharmaCategory = new Pharmaceutical_category();
			newPharmaCategory.Pharmaceutical_Category_Code     	 = PharCeuCatnextCode;
			newPharmaCategory.Pharmaceutical_Category_Name 	     = request.body.name;
			newPharmaCategory.Pharmaceutical_Category_ATC_Code   = request.body.atc_code;
			newPharmaCategory.Pharmaceutical_Category_IsActive	 = 1;
			newPharmaCategory.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}
				else{
					return response.send({
						message: true
					});
				}
			});
		}
		getLastPharmaceuticalCat();
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
		async function getLastAIID(){
			var AINextID = await getNextAIId();
			var Employee_ID = await getEmployeeId();
			var MasterTasks_ID   = await getMasterTasksId();
			var AIRevision_ID   = await getAIRevisionId();

			insetIntoAI(AINextID,Employee_ID,MasterTasks_ID,AIRevision_ID);
		}

		function getNextAIId(){
			return new Promise((resolve, reject) => {
				AI.getLastCode(function(err, AIdata){
					if (AIdata) 
						resolve( Number(AIdata.AI_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function getEmployeeId(){
			return new Promise((resolve, reject) => {
				Employee_role.findOne({ $and: [ { Employee_Role_Role_Code:1 }, { Employee_Role_Type_Code: 1 }, { Employee_Role_Sub_Role_Type: 1 } ] }, function(err, emp_role) {
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (emp_role) {
			            resolve(emp_role.Employee_Role_Employee_Code);
			        } 
		    	});
			})
		}

		function getMasterTasksId(){
			return new Promise((resolve, reject) => {
				AITasks.getLastCode(function(err, AIMaTs){
					if (AIMaTs) 
						resolve( Number(AIMaTs.AI_Master_Clinical_Data_Task_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function getAIRevisionId(){
			return new Promise((resolve, reject) => {
				AIRevisions.getLastCode(function(err, AIMaRe){
					if (AIMaRe) 
						resolve( Number(AIMaRe.AIMasterRevision_Code)+1);
					else
						resolve(1);
				})
			})
		};


		function insetIntoAI(AINextID,Employee_ID,MasterTasks_ID,AIRevision_ID){
			var newAI = new AI();
			newAI.AI_Code     						 = AINextID;
			newAI.AI_Name 	    					 = request.body.name;
			newAI.AI_ATC_Code    					 = request.body.atc_code;
			newAI.AI_Status 	 					 = null;
			newAI.AI_Pharmaceutical_Categories_ID    = request.body.category_Ids;
			newAI.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}
				else{

					var newAiReVision = AIRevisions();

					newAiReVision.AIMasterRevision_Code  		 			   = AIRevision_ID;
					newAiReVision.AIMasterRevision_AI_ID 		 			   = AINextID;
					newAiReVision.AIMasterRevision_AssiendToEditor_Employee_ID = Employee_ID;
					newAiReVision.AIMasterRevision_EditStatus 				   = 0;
					newAiReVision.AIMasterRevision_EditDate_Start			   = new Date();	
					newAiReVision.save();

					NotificationDetails = {
						Task_id 				: MasterTasks_ID,
						Title 					: request.body.name,
						Task_date 				: new Date(),
						Type_Code 				: 1,
						Type_Name 				: "Edit",
						AssignTo_Employee_Code 	: Employee_ID,
						AIRevision_ID 			: AIRevision_ID,
						Task_Status 			:0,
					}

					var newAITasks =  AITasks() ;

					newAITasks.AI_Master_Clinical_Data_Task_Code       				= MasterTasks_ID;
					newAITasks.AI_Master_Clinical_Data_Task_Title 				    = request.body.name;
					newAITasks.AI_Master_Clinical_Data_Task_AssignDate 			    = new Date();
					newAITasks.AI_Master_Clinical_Data_Task_Task_Type_Code 	  	    = 1;
					newAITasks.AI_Master_Clinical_Data_Task_Task_Type_Name 	  	    = "Edit";
					newAITasks.AI_Master_Clinical_Data_Task_AssignTo_Employee_Code  = Employee_ID;
					newAITasks.AI_Master_Clinical_Data_Task_ClosedDate 			    = null;
					newAITasks.AI_Master_Clinical_Data_Task_AI_Master_Revision_Code	= AIRevision_ID;
					newAITasks.AI_Master_Clinical_Data_Task_AI_Code					= AINextID;
					newAITasks.AI_Master_Clinical_Data_Task_Status 					= 0;
					newAITasks.save();

					var UserInSockets = clients.find(o => o.UserID === Employee_ID);
					if(UserInSockets){
						console.log(clients);
						var ClientSocketArray = clients.filter(function(obj) {
							if(obj.UserID === 1)
								return true
							else
								return false
						});
						ClientSocketArray.forEach(function (arrayItem) {
							var SocktesToSendNotification = arrayItem.Socket;
							console.log(SocktesToSendNotification)
							io.sockets.connected[SocktesToSendNotification].emit("notification", NotificationDetails);
						});
						
					}
					return response.send({
						message: true
					});
				}
			});
		}
		getLastAIID();
	});


	app.post('/getUserAITasksbyUserID', function(request, response) {
		AITasks.find({ $and:[ {'AI_Master_Clinical_Data_Task_AssignTo_Employee_Code': Number(request.body.user_id)},
		 {'AI_Master_Clinical_Data_Task_Status':0} ]},function(err, tasks) {
			if (err){
	    		return response.send({
					message: err
				});
	    	}
	    	if (tasks.length == 0) {
				return response.send({
					// user : request.user ,
					message: 'No Roles Found !!',
					length: tasks.length
				});
        	} else {
				return response.send({
					// user : request.user ,
					tasks: tasks
				});
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
    	}).sort({AI_Code:-1}).limit(20)
	});
	
	app.get('/getAllAI', function(request, response) {
		AI.find({}, function(err, ai) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (ai) {
	        	
	            response.send(ai);
	        } 
    	}).sort({AI_Name:-1})
    });
	
	app.get('/getAIRevision', function(request, response) {
		AIRevisions.find({AIMasterRevision_AI_ID:request.query.ai_id}, function(err, airevision) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (airevision) {
	        	
	            response.send(airevision);
	        } 
    	})
    });

	//  get data  
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

	app.get('/getConcentration', function(request, response) {
		Concentration.find({}, function(err, form) {
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

    // insert data
    app.post('/addForm',function (request, response){
		
		async function getLastTNForm(){
			var FormNextCode = await getNextForm();
			insetIntoForm(FormNextCode);
        }

		function getNextForm(){
			return new Promise((resolve, reject) => {
			 	Forms.getLastCode(function(err,tnForm){
					if (tnForm) 
						resolve( Number(tnForm.Form_Code)+1);
					else
					resolve(1);
				})
			})
    	}

    	function insetIntoForm(FormNextCode){
            var newForm = new Forms();
            newForm.Form_Code                = FormNextCode;
            newForm.Form_Name                = request.body.name;
            newForm.Form_Description         = request.body.desc;
            newForm.Form_IsActive            = 1;
            newForm.Form_Cd         		 = request.body.cd;
            newForm.Form_Cddt           	 = request.body.cddt;
            newForm.Form_Cdpref         	 = request.body.cdpref;

            newForm.save(function(error, doneadd){
                if(error){
                    return response.send({
                        message: error
                    });
                }
                else{
                    return response.send({
                        message: true
                    });
                }
            });
        }
        getLastTNForm();
    });

	app.post('/addRoute',function (request, response){
	        async function getLastRoute(){
	            var RouteNextCode = await getNextRoute();
	            insetIntoRoute(RouteNextCode);
	        }
	        function getNextRoute(){
	            return new Promise((resolve, reject) => {
	                Routes.getLastCode(function(err,NextRoute){
	                    if (NextRoute) 
	                        resolve( Number(NextRoute.Route_Code)+1);
	                    else
	                        resolve(1);
	                })
	            })
	        };
	        function insetIntoRoute(routeNextCode){
	            var newRoute = new Routes();
	            newRoute.Route_Code          = routeNextCode;
	            newRoute.Route_Name          = request.body.name;
	            newRoute.Route_Description   = request.body.desc;
	            newRoute.Route_IsActive      = 1;
				newRoute.Route_Cd            = request.body.cd;
            	newRoute.Route_Cddt          = request.body.cddt;
            	newRoute.Route_Cdpref        = request.body.cdpref;
	            newRoute.save(function(error, doneadd){
	                if(error){
	                    return response.send({
	                        message: error
	                    });
	                }
	                else{
	                    return response.send({
	                        message: true
	                    });
	                }
	            });
	        }
        getLastRoute();
   });



app.post('/addStrengthUnits',function (request, response){
        async function getLastStrengthUnit(){
            var StrengthUnitNextCode = await getNextStrengthUnit();
            insetIntoStrengthUnit(StrengthUnitNextCode);
        }
        function getNextStrengthUnit(){
            return new Promise((resolve, reject) => {
                StrengthUnits.getLastCode(function(err,NextStrengthUnit){
                    if (NextStrengthUnit) 
                        resolve( Number(NextStrengthUnit.StrengthUnit_Code)+1);
                    else
                        resolve(1);
                })
            })
        };
        function insetIntoStrengthUnit(StrengthUnitNextCode){
            var newStrengthUnit = new StrengthUnits();
            newStrengthUnit.StrengthUnit_Code        = StrengthUnitNextCode;
            newStrengthUnit.StrengthUnit_Name        = request.body.name;
            newStrengthUnit.StrengthUnit_Description     = request.body.desc;
            newStrengthUnit.StrengthUnit_IsActive        = 1;
            newStrengthUnit.save(function(error, doneadd){
                if(error){
                    return response.send({
                        message: error
                    });
                }
                else{
                    return response.send({
                        message: true
                    });
                }
            });
        }
        getLastStrengthUnit();
    });

	app.post('/addConcentrationUnits',function (request, response){
		async function getLastConcentrationUnit(){
			var ConcentrationUnitsNextCode = await getNextConcentrationUnit();
			insetIntoConcentrationUnit(ConcentrationUnitsNextCode);
		}
		function getNextConcentrationUnit(){
			return new Promise((resolve, reject) => {
				Concentration.getLastCode(function(err,NextConcentrationUnit){
					if (NextConcentrationUnit) 
						resolve( Number(NextConcentrationUnit.ConcentrationUnit_Code)+1);
					else
						resolve(1);
				})
			})
		};
		function insetIntoConcentrationUnit(ConcentrationUnitsNextCode){
			var newConcentrationUnit = new Concentration();
			newConcentrationUnit.ConcentrationUnit_Code        = ConcentrationUnitsNextCode;
			newConcentrationUnit.ConcentrationUnit_Name        = request.body.name;
			newConcentrationUnit.ConcentrationUnit_Description     = request.body.desc;
			newConcentrationUnit.ConcentrationUnit_IsActive     = 1;
			newConcentrationUnit.save(function(error, doneadd){
				if(error){
					return response.send({
						 message: error
					});
				}
				else{
					return response.send({
						message: true
					});
				}
			});
		}
		getLastConcentrationUnit();
	});

    app.post('/addWeightUnits',function (request, response){
        async function getLastWeightUnit(){
            var WeightUnitNextCode = await getNextWeightUnit();
            insetIntoWeighthUnit(WeightUnitNextCode);
        }
        function getNextWeightUnit(){
            return new Promise((resolve, reject) => {
                WeightUnits.getLastCode(function(err,NextWeightUnit){
                    if (NextWeightUnit) 
                        resolve( Number(NextWeightUnit.WeightUnit_Code)+1);
                    else
                        resolve(1);
                })
            })
        };

        function insetIntoWeighthUnit(WeightUnitNextCode){
            var newWeightUnit = new WeightUnits();
            newWeightUnit.WeightUnit_Code        = WeightUnitNextCode;
            newWeightUnit.WeightUnit_Name        = request.body.name;
            newWeightUnit.WeightUnit_Description     = request.body.desc;
            newWeightUnit.WeightUnit_IsActive        = 1;
            newWeightUnit.save(function(error, doneadd){
                if(error){
                    return response.send({
                        message: error
                    });
                }
                else{
                    return response.send({
                        message: true
                    });
                }
            });
        }
        getLastWeightUnit();
    });

    app.post('/addVolumeUnits',function (request, response){
        async function getLastVolumeUnit(){
            var VolumeUnitNextCode = await getNextVolumetUnit();
            insetIntoVolumeUnit(VolumeUnitNextCode);
        }
        function getNextVolumetUnit(){
            return new Promise((resolve, reject) => {
                VolumeUnits.getLastCode(function(err,NextVolumeUnit){
                    if (NextVolumeUnit) 
                        resolve( Number(NextVolumeUnit.VolumeUnit_Code)+1);
                    else
                        resolve(1);
                })
            })
        };
        function insetIntoVolumeUnit(VolumeUnitNextCode){
            var newVolumeUnit = new VolumeUnits();
            newVolumeUnit.VolumeUnit_Code        = VolumeUnitNextCode;
            newVolumeUnit.VolumeUnit_Name        = request.body.name;
            newVolumeUnit.VolumeUnit_Description     = request.body.desc;
            newVolumeUnit.VolumeUnit_IsActive        = 1;
            newVolumeUnit.save(function(error, doneadd){
                if(error){
                    return response.send({
                        message: error
                    });
                }
                else{
                    return response.send({
                        message: true
                    });
                }
            });
        }
        getLastVolumeUnit();
    });

    app.post('/addSizeUnits',function (request, response){
        async function getLastSizeUnit(){
            var SizeUnitNextCode = await getNextSizetUnit();
            insetIntoSizeUnit(SizeUnitNextCode);
        }
        function getNextSizetUnit(){
            return new Promise((resolve, reject) => {
                SizeUnits.getLastCode(function(err,NextSizeUnit){
                    if (NextSizeUnit) 
                        resolve( Number(NextSizeUnit.SizeUnit_Code)+1);
                    else
                        resolve(1);
                })
            })
        };
        function insetIntoSizeUnit(SizeUnitNextCode){
            var newSizeUnit = new SizeUnits();
            newSizeUnit.SizeUnit_Code        = SizeUnitNextCode;
            newSizeUnit.SizeUnit_Name        = request.body.name;
            newSizeUnit.SizeUnit_Description     = request.body.desc;
            newSizeUnit.SizeUnit_IsActive        = 1;
            newSizeUnit.save(function(error, doneadd){
                if(error){
                    return response.send({
                        message: error
                    });
                }
                else{
                    return response.send({
                        message: true
                    });
                }
            });
        }
        getLastSizeUnit();
    });		


	//  edit data
	app.post('/editForm',function (request, response){

		var newvalues = { $set: {
				Form_Name 					: request.body.name,
				Form_Description 			: request.body.desc, 
				Form_IsActive 				: request.body.status,
				Form_Cd            			: request.body.cd,
            	Form_Cddt           		: request.body.cddt,
            	Form_Cdpref         		: request.body.cdpref,
			} };

		var myquery = { Form_Code: request.body.row_id }; 


		Forms.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Form not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});

	app.post('/editConcentrationUnit',function (request, response){

		var newvalues = { $set: {
				ConcentrationUnit_Name 					: request.body.name,
				ConcentrationUnit_Description 			: request.body.desc, 
				ConcentrationUnit_IsActive 				: request.body.status,
			} };

		var myquery = { ConcentrationUnit_Code: request.body.row_id }; 


		Concentration.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Concentration not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});


	app.post('/editRoute',function (request, response){

		var newvalues = { $set: {
				Route_Name 					: request.body.name,
				Route_Description 			: request.body.desc, 
				Route_IsActive 				: request.body.status,
				Route_Cd					: request.body.cd,
				Route_Cddt					: request.body.cddt,
				Route_Cdpref			    : request.body.cdpref,
			} };

		var myquery = { Route_Code: request.body.row_id }; 


		Routes.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Route not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});

	app.post('/editStrengthUnits',function (request, response){

		var newvalues = { $set: {
				StrengthUnit_Name 					: request.body.name,
				StrengthUnit_Description 			: request.body.desc, 
				StrengthUnit_IsActive 				: request.body.status,
			} };

		var myquery = { StrengthUnit_Code: request.body.row_id }; 


		StrengthUnits.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Strength Unit not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});
	

	app.post('/editWeightUnits',function (request, response){

		var newvalues = { $set: {
				WeightUnit_Name 					: request.body.name,
				WeightUnit_Description 			: request.body.desc, 
				WeightUnit_IsActive 				: request.body.status,
			} };

		var myquery = { WeightUnit_Code: request.body.row_id }; 


		WeightUnits.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Weight Unit not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});

	app.post('/editVolumeUnits',function (request, response){

		var newvalues = { $set: {
				VolumeUnit_Name 					: request.body.name,
				VolumeUnit_Description 			: request.body.desc, 
				VolumeUnit_IsActive 				: request.body.status,
			} };

		var myquery = { VolumeUnit_Code: request.body.row_id }; 


		VolumeUnits.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Volume Unit not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});


	app.post('/editSizeUnits',function (request, response){

		var newvalues = { $set: {
				SizeUnit_Name 					: request.body.name,
				SizeUnit_Description 			: request.body.desc, 
				SizeUnit_IsActive 				: request.body.status,
			} };

		var myquery = { SizeUnit_Code: request.body.row_id }; 


		SizeUnits.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Size Unit not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});




	// add  of TN revision
	app.post('/addTNRevision',function (request, response){

		async function AddNewTNRevisionData(){
			var TNID 					 	  = await getNextTNID();
			var insertTN         		 	  = await insetIntoTN(TNID);
			var TNRevisionNextCode      	  = await getNextTNRevisionCode();
			var Reviewer_ID 	        	  = await getEmployeeId();
			var insertIntoTNRevison     	  = await insertNewTNRevision(TNRevisionNextCode,TNID,Reviewer_ID);
			var MasterTasks_ID   	   		  = await getMasterTasksId();
			var InsetIntoTNTasks        	  = await insetIntoTNTasks(Reviewer_ID,MasterTasks_ID,TNRevisionNextCode);
		}

		function getNextTNID(){
			return new Promise((resolve, reject) => {
				TN.getLastCode(function(err, tn){
					if (tn) 
						resolve( Number(tn.TN_Code)+1);
					else
						resolve(1);
				})
			})
		};


		function insetIntoTN(TNID){

			var newTn  = new TN();
            newTn.TN_Code     	 					= TNID;
            newTn.TN_Name 	     					= request.body.TN_Name;
            newTn.TN_ActiveIngredients	 			= request.body.TN_ActiveIngredientsIDs;
            newTn.TN_Status	     					= 0;
            newTn.TN_Form_ID   						= request.body.TN_Form_ID
            newTn.TN_Route_ID			    		= request.body.TN_Route_ID;
            newTn.TN_Strength_Unit_ID				= request.body.TN_Strength_Unit_ID;
            newTn.TN_Strength_Value					= request.body.TN_Strength_Value;
            newTn.TN_Weight_Unit_ID					= request.body.TN_Weight_Unit_ID;
            newTn.TN_Weight_Value					= request.body.TN_Weight_Value;
            newTn.TN_Volume_Unit_ID					= request.body.TN_Volume_Unit_ID;
            newTn.TN_Volume_Value		    		= request.body.TN_Volume_Value;
            newTn.TN_Concentration_Unit_ID			= request.body.TN_Concentration_Unit_ID;
            newTn.TN_Concentration_Value	    	= request.body.TN_Concentration_Value;
            newTn.TN_Country_ID						= request.body.TN_Country_IDs;
            newTn.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}else{
		            return response.send({
						message: true
					});
       			}
       		})
		}

		function getNextTNRevisionCode(){	
        	return new Promise((resolve, reject) => {		
				TNRevisions.getLastCode(function(err,tnrev){
					if (tnrev) {
						resolve(Number(tnrev.TNRevision_Code)+1);
					}else{
						resolve(1);
					}
				})
			})   
		}

		function insertNewTNRevision(TNRevisionNextCode,TNID,Reviewer_ID){
            var newTnRevision = new TNRevisions();
            newTnRevision.TNRevision_Code     	 							= TNRevisionNextCode;
            newTnRevision.TNRevision_Name 	     							= request.body.TN_Name;
            newTnRevision.TNRevision_ActiveIngredients	 					= request.body.TN_ActiveIngredientsIDs;
            newTnRevision.TNRevision_Status	     							= 0;
            newTnRevision.TNRevision_Form_ID   								= request.body.TN_Form_ID
            newTnRevision.TNRevision_Route_ID			    				= request.body.TN_Route_ID;
            newTnRevision.TNRevision_Strength_Unit_ID						= request.body.TN_Strength_Unit_ID;
            newTnRevision.TNRevision_Strength_Value							= request.body.TN_Strength_Value;
            newTnRevision.TNRevision_Weight_Unit_ID							= request.body.TN_Weight_Unit_ID;
            newTnRevision.TNRevision_Weight_Value							= request.body.TN_Weight_Value;
            newTnRevision.TNRevision_Volume_Unit_ID							= request.body.TN_Volume_Unit_ID;
            newTnRevision.TNRevision_Volume_Value		    				= request.body.TN_Volume_Value;
            newTnRevision.TNRevision_Concentration_Unit_ID					= request.body.TN_Concentration_Unit_ID;
            newTnRevision.TNRevision_Concentration_Value	    			= request.body.TN_Concentration_Value;
            newTnRevision.TNRevision_Country_ID								= request.body.TN_Country_IDs;
           
            newTnRevision.TNMasterRevision_AssiendToEditor_Employee_ID 	    = request.body.TNRevision_EditedBy_Employee_ID;
            newTnRevision.TNMasterRevision_EditStatus						= 1;
            newTnRevision.TNMasterRevision_EditDate_Start					= new Date();
			newTnRevision.TNRevision_EditedBy_Employee_ID					= request.body.TNRevision_EditedBy_Employee_ID;
			newTnRevision.TNRevision_EditDate_Close							= new Date();
			newTnRevision.TNRevision_TN_Code								= TNID;
			newTnRevision.TNMasterRevision_AssiendToReviewer_Employee_ID  	= Reviewer_ID;
			newTnRevision.TNMasterRevision_ReviewDate_Start					= new Date();
            newTnRevision.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}else{
		            return response.send({
						message: true
					});
       			}
       		})
        }

        function getEmployeeId(){
			return new Promise((resolve, reject) => {
				Employee_role.findOne({ $and: [ { Employee_Role_Role_Code:2 }, { Employee_Role_Type_Code: 1 },{ Employee_Role_Sub_Role_Type:2 } ] }, function(err, emp_role) {
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (emp_role) {
			            resolve(emp_role.Employee_Role_Employee_Code);
			        } 
		    	});
			})
		}

		function getMasterTasksId(){
			return new Promise((resolve, reject) => {
				TNTasks.getLastCode(function(err, TNMaTs){
					if (TNMaTs) 
						resolve( Number(TNMaTs.TN_Master_Clinical_Data_Task_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function insetIntoTNTasks(Reviewer_ID,MasterTasks_ID,TNRevisionNextCode){
			var newTNTasks =  TNTasks() ;

			newTNTasks.TN_Master_Clinical_Data_Task_Code       							  = MasterTasks_ID;
			newTNTasks.TN_Master_Clinical_Data_Task_Title 								  = request.body.TN_Master_Clinical_Data_Task_Title;
			newTNTasks.TN_Master_Clinical_Data_Task_AssignDate 						      = new Date();
			newTNTasks.TN_Master_Clinical_Data_Task_Task_Type_Code 	  				      = 2;
			newTNTasks.TN_Master_Clinical_Data_Task_Task_Type_Name 	  				      = "Review";
			newTNTasks.TN_Master_Clinical_Data_Task_AssignTo_Employee_Code   			  = Reviewer_ID;
			newTNTasks.TN_Master_Clinical_Data_Task_ClosedDate 							  = null;
			newTNTasks.TN_Master_Clinical_Data_Task_Status 								  = 0;
			newTNTasks.TN_Master_Clinical_Data_Task_TN_Master_Revision_Code 			  = TNRevisionNextCode;	 
			newTNTasks.save();

			NotificationDetails ='';

			NotificationDetails = {
						Task_id 				: MasterTasks_ID,
						Title 					: request.body.TN_Master_Clinical_Data_Task_Title,
						Task_date 				: new Date(),
						Type_Code 				: 2,
						Type_Name 				: "Review",
						AssignTo_Employee_Code 	: Reviewer_ID,
						AIRevision_ID 			: TNRevisionNextCode,
						Task_Status 			:0,
					}

			var UserInSockets = clients.find(o => o.UserID === Reviewer_ID);
			if(UserInSockets){
				console.log(clients);
				var ClientSocketArray = clients.filter(function(obj) {
					if(obj.UserID === 1)
						return true
					else
						return false
				});
				ClientSocketArray.forEach(function (arrayItem) {
					var SocktesToSendNotification = arrayItem.Socket;
					console.log(SocktesToSendNotification)
					io.sockets.connected[SocktesToSendNotification].emit("notification", NotificationDetails);
				});
				
			}

			return response.send({
				message: true
			});
		}
			

		async function addTaskCountry(ai_ids,country_ids){

			var CountryBasedAIID           	= await getNextCountryBasedAIID();
			var CountryBasedAIIDRevision     = await getNextCountryBasedAIRevisionID();
			var CountryBaesdAITaskID     	= await getNextCountryBasedAITaskID();
			
			for (var i = 0; i < ai_ids.length; i++) {
				var ai_id 	= Number(ai_ids[i].AI_Code);
				var ai_name = ai_ids[i].AI_Name;

				for (var j = 0; j < country_ids.length; j++) {
					var country_id 			   		  = Number(country_ids[j].Country_Code);
					var Title 				  		  = ai_name +' for '+ country_ids[j].Country_Name; 			
					var InsertCountryBasedAI      	  = await insertIntoCountryBasedAI(CountryBasedAIID,country_id,ai_id);
					var EditorCountryBasedAIID        = await getEditorCountryBasedAI(country_id);
					var InsertCountryBasedAIRevision  = await insertIntoCountryBasedAIRevision(CountryBasedAIIDRevision,CountryBasedAIID,country_id,ai_id,EditorCountryBasedAIID);
					var InsertIntoCountryBasedAITasks = await insertIntoCountryBasedAITasks(CountryBaesdAITaskID,EditorCountryBasedAIID,CountryBasedAIIDRevision,Title);
					
					CountryBasedAIID++;
					CountryBasedAIIDRevision++;
					CountryBaesdAITaskID++;
				}
			}
		}

		function getNextCountryBasedAIID(){
			return new Promise((resolve, reject) => {
				CountryBasedAI.getLastCode(function(err, ai){
					if (ai) 
						resolve( Number(ai.CountryBasedAI_Code)+1);
					else
						resolve(1);
				})
			})
		}

		function insertIntoCountryBasedAI(CountryBasedAIID,country_id,ai_id){
			var newCountryBasedAI =  CountryBasedAI() ;

			newCountryBasedAI.CountryBasedAI_Code       	= CountryBasedAIID;
			newCountryBasedAI.CountryBasedAI_AI_Code 		= ai_id;
			newCountryBasedAI.CountryBasedAI_Country_ID 	= country_id;
			newCountryBasedAI.save(function(err,done){;
				if (err) {
					return response.send({
						message: err
					});
				}
				if (done) {
					return response.send({
						message: true
					});
				}	
				
			})
		}

		function getEditorCountryBasedAI(country_id){
			return new Promise((resolve, reject) => {
				Employee_role.findOne({ $and: [ { Employee_Role_Role_Code:1 }, { Employee_Role_Type_Code: 2 },{ Employee_Role_Sub_Role_Type:3 },{ Employee_Role_Country_Code:country_id },{ Employee_Role_Status:1 } ] }, function(err, emp_role) {
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (emp_role) {
			            resolve(emp_role.Employee_Role_Employee_Code);
			        }
		    	});
			})
		}

		function getNextCountryBasedAIRevisionID(){
			return new Promise((resolve, reject) => {
				CountryBasedAIRevision.getLastCode(function(err, revision){
					if (revision) 
						resolve( Number(revision.CountryBasedAIRevision_Code)+1);
					else
						resolve(1);
				})
			})
		}

		function insertIntoCountryBasedAIRevision(CountryBasedAIIDRevision,CountryBasedAIID,country_id,ai_id,EditorCountryBasedAIID){
			var newCountryBasedAIRevision =  CountryBasedAIRevision() ;

			newCountryBasedAIRevision.CountryBasedAIRevision_Code       					    = CountryBasedAIIDRevision;
			newCountryBasedAIRevision.CountryBasedAIRevision_AI_Code       					    = ai_id;
			newCountryBasedAIRevision.CountryBasedAIRevision_Country_ID       					= country_id;
			newCountryBasedAIRevision.CountryBasedAIRevision_CountryBasedAI_Code				= CountryBasedAIID;
			newCountryBasedAIRevision.CountryBasedAIRevision_AssiendToEditor_Employee_ID 		= EditorCountryBasedAIID;
			newCountryBasedAIRevision.CountryBasedAIRevision_EditStatus 						= 0;
			newCountryBasedAIRevision.CountryBasedAIRevision_EditDate_Start 	  				= new Date();
			newCountryBasedAIRevision.save();

			return response.send({
				message: true
			});
		}

		function getNextCountryBasedAITaskID(){
			return new Promise((resolve, reject) => {
				CountryBasedAITasks.getLastCode(function(err, task){
					if (task) 
						resolve( Number(task.CountryBasedAITask_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function insertIntoCountryBasedAITasks(CountryBasedAITaskID,EditorCountryBasedAIID,CountryBasedAIRevisionID,Title){
			var newCountryBasedAITask =  CountryBasedAITasks() ;

			newCountryBasedAITask.CountryBasedAITask_Code       					= CountryBasedAITaskID;
			newCountryBasedAITask.CountryBasedAITask_Title 							= Title;
			newCountryBasedAITask.CountryBasedAITask_AssignDate 				    = new Date();
			newCountryBasedAITask.CountryBasedAITask_Task_Type_Code 	  		    = 1;
			newCountryBasedAITask.CountryBasedAITask_Task_Type_Name 	  		    = "Edit";
			newCountryBasedAITask.CountryBasedAITask_AssignTo_Employee_Code   	    = EditorCountryBasedAIID;
			newCountryBasedAITask.CountryBasedAITask_ClosedDate 					= null;
			newCountryBasedAITask.CountryBasedAITask_Status 						= 0;
			newCountryBasedAITask.CountryBasedAITask_Revision_Code  			  	= CountryBasedAIRevisionID;	 
			newCountryBasedAITask.save();

			return response.send({
				message: true
			});
		}

		AddNewTNRevisionData();
        addTaskCountry(request.body.TN_ActiveIngredients,request.body.TN_Country_ID);
	});


	app.post('/AddTaskTNToPublisher',function (request, response){

		async function AddNewTasks(){
			var Publisher_ID = await getEmployeeId();
			var resultTNRevision = await updateTNRevision(Publisher_ID);
			var MasterTasks_ID   = await getMasterTasksId();
			insetIntoTNTasks(Publisher_ID,MasterTasks_ID);
		}

		function getEmployeeId(){
			return new Promise((resolve, reject) => {
				Employee_role.findOne({ $and: [ { Employee_Role_Role_Code:4 }, { Employee_Role_Type_Code: 1 },{ Employee_Role_Sub_Role_Type:2 } ] }, function(err, emp_role) {
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (emp_role) {
			            resolve(emp_role.Employee_Role_Employee_Code);
			        } 
		    	});
			})
		}

		function updateTNRevision(Publisher_ID){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						TNMasterRevision_ReviewStatus 					: 1,
						TNMasterRevision_ReviewedBy_Employee_ID   		:request.body.TNMasterRevision_ReviewedBy_Employee_ID,
						TNMasterRevision_ReviewDate_Close 				:new Date(),

						TNMasterRevision_AssiendToPublisher_Employee_ID :Publisher_ID,
						TNMasterRevision_PublishStatus					:0,
						TNMasterRevision_PublishDate_Start				:new Date(),
				} };

				var myquery = { TNMasterRevision_Code: request.body.TNMasterRevision_Code }; 

				TNRevisions.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};


		function getMasterTasksId(){
			return new Promise((resolve, reject) => {
				TNTasks.getLastCode(function(err, TNMaTs){
					if (TNMaTs) 
						resolve( Number(TNMaTs.TN_Master_Clinical_Data_Task_Code)+1);
					else
						resolve(1);
				})
			})
		};


		function insetIntoTNTasks(Publisher_ID,MasterTasks_ID){
			var newTNTasks =  TNTasks() ;

			newTNTasks.TN_Master_Clinical_Data_Task_Code       							  = MasterTasks_ID;
			newTNTasks.TN_Master_Clinical_Data_Task_Title 								  = request.body.TN_Master_Clinical_Data_Task_Title;
			newTNTasks.TN_Master_Clinical_Data_Task_AssignDate 						      = new Date();
			newTNTasks.TN_Master_Clinical_Data_Task_Task_Type_Code 	  				      = 2;
			newTNTasks.TN_Master_Clinical_Data_Task_Task_Type_Name 	  				      = "Publish";
			newTNTasks.TN_Master_Clinical_Data_Task_AssignTo_Employee_Code   			  = Publisher_ID;
			newTNTasks.TN_Master_Clinical_Data_Task_ClosedDate 							  = null;
			newTNTasks.TN_Master_Clinical_Data_Task_Status 								  = 0;
			newTNTasks.TN_Master_Clinical_Data_Task_TN_Master_Revision_Code 			  = request.body.TN_Master_Clinical_Data_Task_TN_Master_Revision_Code;	 
			newTNTasks.save();

			NotificationDetails ='';

			NotificationDetails = {
						Task_id 				: MasterTasks_ID,
						Title 					: request.body.TN_Master_Clinical_Data_Task_Title,
						Task_date 				: new Date(),
						Type_Code 				: 2,
						Type_Name 				: "Publish",
						AssignTo_Employee_Code 	: Publisher_ID,
						AIRevision_ID 			: request.body.TN_Master_Clinical_Data_Task_TN_Master_Revision_Code,
						Task_Status 			:0,
					}

			var UserInSockets = clients.find(o => o.UserID === Publisher_ID);
			if(UserInSockets){
				console.log(clients);
				var ClientSocketArray = clients.filter(function(obj) {
					if(obj.UserID === 1)
						return true
					else
						return false
				});
				ClientSocketArray.forEach(function (arrayItem) {
					var SocktesToSendNotification = arrayItem.Socket;
					console.log(SocktesToSendNotification)
					io.sockets.connected[SocktesToSendNotification].emit("notification", NotificationDetails);
				});
				
			}

			return response.send({
				message: true
			});
		}


		AddNewTasks();
	});



	app.post('/AddTNData',function (request, response){

		async function AddNewTNData(){
			var resultTask  		= await updateTaskDone();
			var resultTNRevision    = await updateTNRevision();
			var dataTNRevision   	= await getTNRevision(request.body.revision_id);
			var UpdateTN         	= await UpdateIntoTN(dataTNRevision);
			var TNHistoryID      	= await getNextTNHistoryID();
			var insertTNHistory  	= await insetIntoTNHistory(dataTNRevision,TNHistoryID);
			var removeTNRevision 	= await removeOldTNRevision(request.body.revision_id);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					TN_Master_Clinical_Data_Task_Status 				: 1,
					TN_Master_Clinical_Data_Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { TN_Master_Clinical_Data_Task_Code: request.body.task_id }; 

				TNTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function updateTNRevision(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						TNMasterRevision_PublishStatus 				: 1,
						TNMasterRevision_Publishedby_Employee_ID   	:request.body.user_id,
						TNMasterRevision_PublishDate_Close 			:new Date(),
						TNMasterRevision_RevisionCode				:1,
				} };

				var myquery = { TNMasterRevision_Code: request.body.tn_revision_id }; 

				TNRevisions.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function getTNRevision(revision_id){
			return new Promise((resolve, reject) => {
				TNRevisions.findOne({TNMasterRevision_Code:revision_id} ,function(err, TNrevision) {
					if (err) 
						resolve( err);
					else
						resolve(TNrevision);
				})
			})
		};

		function UpdateIntoTN(data){

			var newvalues = { $set: {
	            TN_Name 	     				: data.TNRevision_Name,
	            TN_ActiveIngredients	 		: data.TNRevision_ActiveIngredients,
	            TN_Status	     				: 1,
	            TN_Form_ID   					: data.TNRevision_Form_ID,
	            TN_Route_ID			    		: data.TNRevision_Route_ID,
	            TN_Strength_Unit_ID				: data.TNRevision_Strength_Unit_ID,
	            TN_Strength_Value				: data.TNRevision_Strength_Value,
	            TN_Weight_Unit_ID				: data.TNRevision_Weight_Unit_ID,
	            TN_Weight_Value					: data.TNRevision_Weight_Value,
	            TN_Volume_Unit_ID				: data.TNRevision_Volume_Unit_ID,
	            TN_Volume_Value		    		: data.TNRevision_Volume_Value,
	            TN_Concentration_Unit_ID		: data.TNRevision_Concentration_Unit_ID,
	            TN_Concentration_Value	    	: data.TNRevision_Concentration_Value,
	            TN_Country_ID					: data.TNRevision_Country_ID,
			} };

			var myquery = { TN_Code: data.TNRevision_TN_Code };


			TN.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'TN not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
			})
		}
		function getNextTNHistoryID(){
			return new Promise((resolve, reject) => {
				TNHistory.getLastCode(function(err, TNdata){
					if (TNdata) 
						resolve( Number(TNdata.TNHistory_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function insetIntoTNHistory(data,TNHistoryID){
			var newTNHistory = new TNHistory();
			newTNHistory.TNHistory_Code     						= TNHistoryID;
			newTNHistory.TNHistory_Name 	    					= data.TNRevision_Name;
			newTNHistory.TNHistory_ActiveIngredients    			= data.TNRevision_ActiveIngredients;
			newTNHistory.TNHistory_Status 	 					 	= data.TNRevision_Status;
			newTNHistory.TNHistory_Form_ID    					 	= data.TNRevision_Form_ID;
			newTNHistory.TNHistory_Route_ID			 				= data.TNRevision_Route_ID;
		    newTNHistory.TNHistory_Strength_Unit_ID			 		= data.TNRevision_Strength_Unit_ID;
		    newTNHistory.TNHistory_Strength_Value					= data.TNRevision_Strength_Value;
		    newTNHistory.TNHistory_Weight_Unit_ID   				= data.TNRevision_Weight_Unit_ID;
		    newTNHistory.TNHistory_Weight_Value  					= data.TNRevision_Weight_Value;
		    newTNHistory.TNHistory_Volume_Unit_ID 					= data.TNRevision_Volume_Unit_ID;
		    newTNHistory.TNHistory_Volume_Value						= data.TNRevision_Volume_Value;
		    newTNHistory.TNHistory_Concentration_Unit_ID			= data.TNRevision_Concentration_Unit_ID;
		    newTNHistory.TNHistory_Concentration_Value				= data.TNRevision_Concentration_Value;
		    newTNHistory.TNHistory_Country_ID						= data.TNRevision_Country_ID;
		    
		    newTNHistory.TNHistory_AssiendToEditor_Employee_ID		= data.TNRevision_AssiendToEditor_Employee_ID;
		    newTNHistory.TNHistory_EditStatus						= data.TNRevision_EditStatus;
		    newTNHistory.TNHistory_EditDate_Start					= data.TNRevision_EditDate_Start;
		    newTNHistory.TNHistory_EditedBy_Employee_ID				= data.TNRevision_EditedBy_Employee_ID;
		    newTNHistory.TNHistory_EditDate_Close					= data.TNRevision_EditDate_Close;
		    
		    newTNHistory.TNHistory_AssiendToReviewer_Employee_ID	= data.TNRevision_AssiendToReviewer_Employee_ID;
		    newTNHistory.TNHistory_ReviewStatus						= data.TNRevision_ReviewStatus;
		    newTNHistory.TNHistory_ReviewDate_Start					= data.TNRevision_ReviewDate_Start;
		    newTNHistory.TNHistory_ReviewedBy_Employee_ID			= data.TNRevision_ReviewedBy_Employee_ID;
		    newTNHistory.TNHistory_ReviewDate_Close					= data.TNRevision_ReviewDate_Close;
		   
		    newTNHistory.TNHistory_AssiendToGrammer_Employee_ID		= data.TNRevision_AssiendToGrammer_Employee_ID;
		    newTNHistory.TNHistory_GrammerStatus					= data.TNRevision_GrammerStatus;
		    newTNHistory.TNHistory_GrammerReview_Date_Start			= data.TNRevision_GrammerReview_Date_Start;
		    newTNHistory.TNHistory_GrammerReviewBy_Employee_ID		= data.TNRevision_GrammerReviewBy_Employee_ID;
		    newTNHistory.TNHistory_GrammerReview_Date_Close			= data.TNRevision_GrammerReview_Date_Close;
		    
		    newTNHistory.TNHistory_AssiendToPublisher_Employee_ID	= data.TNRevision_AssiendToPublisher_Employee_ID;
		    newTNHistory.TNHistory_PublishStatus					= data.TNRevision_PublishStatus;
		    newTNHistory.TNHistory_PublishDate_Start				= data.TNRevision_PublishDate_Start;
		    newTNHistory.TNHistory_Publishedby_Employee_ID			= data.TNRevision_Publishedby_Employee_ID;
		    newTNHistory.TNHistory_PublishDate_Close				= data.TNRevision_PublishDate_Close;

    		newTNHistory.TNHistory_RevisionCode                     = data.TNRevision_RevisionCode;

		   	newTNHistory.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}else {
	                return response.send({
						message: true
					});
				}

			})	
		}

		function removeOldTNRevision(revision_id){
			return new Promise((resolve, reject) => {
				TNRevisions.remove({TNRevision_Code:revision_id} ,function(err, tnrevision) {
					if (err) 
						resolve( err);
					else
						resolve(true);
				})
			})
		};

		AddNewTNData();
	})
	// get  basic data of TN
	app.get('/getTNRevisionByID', function(request, response) {
		TNRevisions.find({TNRevision_Code:request.body.tn_revision_id}, function(err, tn) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (tn) {
	        	
	            response.send(tn);
	        } 
    	});
    });


	app.post('/searchTNName', function(request, response) {
		var Searchquery = request.body.searchField;
			TN.find ({TN_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }},function(err, tn) {
				if (err){
    	    		return response.send({
						user : request.user ,
						message: err
					});
    	    	}

    	    	if (tn.length == 0) {
					return response.send({
						user : request.user ,
						message: 'No TN Name Found !!'
					});
            	} else {
					return response.send({
						user : request.user ,
						tn: tn
					});
				}
			}).sort({TN_Name:-1})
	});

	app.post('/searchAIForTN', function(request, response) {
		var Searchquery = request.body.searchField;
			TN.find ({TN_ActiveIngredients:{$in:[Searchquery]}},function(err, tn) {
				if (err){
    	    		return response.send({
						// user : request.user ,
						message: err
					});
    	    	}

    	    	if (tn.length == 0) {
					return response.send({
						// user : request.user ,
						message: 'No TN Found !!'
					});
            	} else {
					return response.send({
						// user : request.user ,
						tn: tn
					});
				}
			})
	});


	app.get('/getTN', function(request, response) {
		TN.find({}, function(err, tn) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (tn) {
	        	
	            response.send(tn);
	        } 
    	}).sort({TN_Code:-1}).limit(20)
    });

	// new route ::26/8/2018

	app.post('/editCountryBasedAIRevision',function (request, response){

		var newvalues = { $set: {
				CountryBasedAIRevision_Dosing			 			: request.body.CountryBasedAIRevision_Dosing,
			    CountryBasedAIRevision_UsaageLabeledIndications		: request.body.CountryBasedAIRevision_UsaageLabeledIndications,
			    CountryBasedAIRevision_UsaageOffLabeledIndications	: request.body.CountryBasedAIRevision_UsaageOffLabeledIndications,
			    CountryBasedAIRevision_Administration   			: request.body.CountryBasedAIRevision_Administration,
			    CountryBasedAIRevision_DietaryConsiderations  		: request.body.CountryBasedAIRevision_DietaryConsiderations,
			    CountryBasedAIRevision_PreparationForAdministration : request.body.CountryBasedAIRevision_PreparationForAdministration,
			    CountryBasedAIRevision_PregnancyConsideration		: request.body.CountryBasedAIRevision_PregnancyConsideration,
			    CountryBasedAIRevision_Storage						: request.body.CountryBasedAIRevision_Storage,
			    CountryBasedAIRevision_Stability					: request.body.CountryBasedAIRevision_Stability,
			} };

		var myquery = { CountryBasedAIRevision_Code: request.body.row_id }; 


		CountryBasedAIRevision.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'Country AI not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});

	app.get('/getCountryBasedAIRevision', function(request, response) {

		CountryBasedAIRevision.find({CountryBasedAIRevision_Code:request.body.CountryBasedAIRevision_Code}, function(err, basedai) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (basedai) {
	        	
	            response.send(basedai);
	        } 
    	})
    });


	app.post('/AddTaskCountryBasedAIRevisionToReviewer',function (request, response){

		async function AddNewTasks(){
			var resultTask  			= await updateTaskDone();
			var Reviewer_ID 			= await getEmployeeId();
			var resultBasedAIRevision 	= await updateBasedAIRevision(Reviewer_ID);
			var CountryBasedAI_ID   		= await getCountryBasedAITaskID();
			insetIntoCountryBasedAITasks(Reviewer_ID,CountryBasedAI_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					CountryBasedAITask_Status 				: 1,
					CountryBasedAITask_ClosedDate 			: new Date(), 
				} };

				var myquery = { CountryBasedAITask_Code: request.body.task_id }; 

				CountryBasedAITasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};


		function getEmployeeId(){
			return new Promise((resolve, reject) => {
				Employee_role.findOne({ $and: [ { Employee_Role_Role_Code:2 }, { Employee_Role_Type_Code: 2 }, { Employee_Role_Sub_Role_Type: 3 },{ Employee_Role_Country_Code:request.body.country_id },{ Employee_Role_Status:1 } ] }, function(err, emp_role) {
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (emp_role) {
			            resolve(emp_role.Employee_Role_Employee_Code);
			        } 
		    	});
			})
		}

		function updateBasedAIRevision(Reviewer_ID){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						CountryBasedAIRevision_EditStatus 						: 1,
						CountryBasedAIRevision_EditedBy_Employee_ID   			:request.body.user_id,
						CountryBasedAIRevision_EditDate_Close 					:new Date(),

						CountryBasedAIRevision_AssiendToReviewer_Employee_ID  	:Reviewer_ID,
						CountryBasedAIRevision_ReviewStatus						:0,
						CountryBasedAIRevision_ReviewDate_Start					:new Date(),
				} };

				var myquery = { CountryBasedAIRevision_Code: request.body.based_ai_revision_id }; 

				CountryBasedAIRevision.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function getCountryBasedAITaskID(){
			return new Promise((resolve, reject) => {
				CountryBasedAITasks.getLastCode(function(err, AIbasedTask){
					if (AIbasedTask) 
						resolve( Number(AIbasedTask.CountryBasedAITask_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function insetIntoCountryBasedAITasks(Reviewer_ID,CountryBasedAI_ID){
			var newBasedAITasks =  CountryBasedAITasks() ;
			newBasedAITasks.CountryBasedAITask_Code       			    = CountryBasedAI_ID;
			newBasedAITasks.CountryBasedAITask_Title 					= request.body.name;
			newBasedAITasks.CountryBasedAITask_AssignDate 				= new Date();
			newBasedAITasks.CountryBasedAITask_Task_Type_Code 	  		= 2;
			newBasedAITasks.CountryBasedAITask_Task_Type_Name 	  		= "Review";
			newBasedAITasks.CountryBasedAITask_AssignTo_Employee_Code   = Reviewer_ID;
			newBasedAITasks.CountryBasedAITask_ClosedDate 				= null;
			newBasedAITasks.CountryBasedAITask_Status 				    = 0;
			newBasedAITasks.CountryBasedAITask_Revision_Code 			= request.body.based_ai_revision_id;	 
			
			newBasedAITasks.save();

			return response.send({
				message: true
			});
		}


		AddNewTasks();
	});


	app.post('/AddTaskCountryBasedAIRevisionToGrammer',function (request, response){

		async function AddNewTasks(){
			var resultTask  			= await updateTaskDone();
			var Grammer_ID 			= await getEmployeeId();
			var resultBasedAIRevision 	= await updateBasedAIRevision(Grammer_ID);
			var CountryBasedAI_ID   		= await getCountryBasedAITaskID();
			insetIntoCountryBasedAITasks(Grammer_ID,CountryBasedAI_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					CountryBasedAITask_Status 				: 1,
					CountryBasedAITask_ClosedDate 			: new Date(), 
				} };

				var myquery = { CountryBasedAITask_Code: request.body.task_id }; 

				CountryBasedAITasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};


		function getEmployeeId(){
			return new Promise((resolve, reject) => {
				Employee_role.findOne({ $and: [ { Employee_Role_Role_Code:3 }, { Employee_Role_Type_Code: 2 }, { Employee_Role_Sub_Role_Type: 3 },{ Employee_Role_Country_Code:request.body.country_id },{ Employee_Role_Status:1 } ] }, function(err, emp_role) {
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (emp_role) {
			            resolve(emp_role.Employee_Role_Employee_Code);
			        } 
		    	});
			})
		}

		function updateBasedAIRevision(Grammer_ID){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						CountryBasedAIRevision_ReviewStatus 					: 1,
						CountryBasedAIRevision_ReviewedBy_Employee_ID   		:request.body.user_id,
						CountryBasedAIRevision_ReviewDate_Close 				:new Date(),

						CountryBasedAIRevision_AssiendToGrammer_Employee_ID  	:Grammer_ID,
						CountryBasedAIRevision_GrammerStatus					:0,
						CountryBasedAIRevision_GrammerReview_Date_Start			:new Date(),
				} };

				var myquery = { CountryBasedAIRevision_Code: request.body.based_ai_revision_id }; 

				CountryBasedAIRevision.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function getCountryBasedAITaskID(){
			return new Promise((resolve, reject) => {
				CountryBasedAITasks.getLastCode(function(err, AIbasedTask){
					if (AIbasedTask) 
						resolve( Number(AIbasedTask.CountryBasedAITask_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function insetIntoCountryBasedAITasks(Grammer_ID,CountryBasedAI_ID){
			var newBasedAITasks =  CountryBasedAITasks() ;
			newBasedAITasks.CountryBasedAITask_Code       			    = CountryBasedAI_ID;
			newBasedAITasks.CountryBasedAITask_Title 					= request.body.name;
			newBasedAITasks.CountryBasedAITask_AssignDate 				= new Date();
			newBasedAITasks.CountryBasedAITask_Task_Type_Code 	  		= 3;
			newBasedAITasks.CountryBasedAITask_Task_Type_Name 	  		= "Grammer";
			newBasedAITasks.CountryBasedAITask_AssignTo_Employee_Code   = Grammer_ID;
			newBasedAITasks.CountryBasedAITask_ClosedDate 				= null;
			newBasedAITasks.CountryBasedAITask_Status 				    = 0;
			newBasedAITasks.CountryBasedAITask_Revision_Code 			= request.body.based_ai_revision_id;	 
			
			newBasedAITasks.save();

			return response.send({
				message: true
			});
		}


		AddNewTasks();
	});

	app.post('/AddTaskCountryBasedAIRevisionToPublisher',function (request, response){

		async function AddNewTasks(){
			var resultTask  			= await updateTaskDone();
			var Publisher_ID 			= await getEmployeeId();
			var resultBasedAIRevision 	= await updateBasedAIRevision(Publisher_ID);
			var CountryBasedAI_ID   	= await getCountryBasedAITaskID();
			insetIntoCountryBasedAITasks(Publisher_ID,CountryBasedAI_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					CountryBasedAITask_Status 				: 1,
					CountryBasedAITask_ClosedDate 			: new Date(), 
				} };

				var myquery = { CountryBasedAITask_Code: request.body.task_id }; 

				CountryBasedAITasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};


		function getEmployeeId(){
			return new Promise((resolve, reject) => {
				Employee_role.findOne({ $and: [ { Employee_Role_Role_Code:4 }, { Employee_Role_Type_Code: 2 }, { Employee_Role_Sub_Role_Type: 3 },{ Employee_Role_Country_Code:request.body.country_id },{ Employee_Role_Status:1 } ] }, function(err, emp_role) {
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (emp_role) {
			            resolve(emp_role.Employee_Role_Employee_Code);
			        } 
		    	});
			})
		}

		function updateBasedAIRevision(Publisher_ID){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						CountryBasedAIRevision_GrammerStatus 					: 1,
						CountryBasedAIRevision_GrammerReviewBy_Employee_ID   	:request.body.user_id,
						CountryBasedAIRevision_GrammerReview_Date_Close 		:new Date(),

						CountryBasedAIRevision_AssiendToPublisher_Employee_ID  	:Publisher_ID,
						CountryBasedAIRevision_PublishStatus					:0,
						CountryBasedAIRevision_PublishDate_Start				:new Date(),
				} };

				var myquery = { CountryBasedAIRevision_Code: request.body.based_ai_revision_id }; 

				CountryBasedAIRevision.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function getCountryBasedAITaskID(){
			return new Promise((resolve, reject) => {
				CountryBasedAITasks.getLastCode(function(err, AIbasedTask){
					if (AIbasedTask) 
						resolve( Number(AIbasedTask.CountryBasedAITask_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function insetIntoCountryBasedAITasks(Publisher_ID,CountryBasedAI_ID){
			var newBasedAITasks =  CountryBasedAITasks() ;
			newBasedAITasks.CountryBasedAITask_Code       			    = CountryBasedAI_ID;
			newBasedAITasks.CountryBasedAITask_Title 					= request.body.name;
			newBasedAITasks.CountryBasedAITask_AssignDate 				= new Date();
			newBasedAITasks.CountryBasedAITask_Task_Type_Code 	  		= 4;
			newBasedAITasks.CountryBasedAITask_Task_Type_Name 	  		= "Publish";
			newBasedAITasks.CountryBasedAITask_AssignTo_Employee_Code   = Publisher_ID;
			newBasedAITasks.CountryBasedAITask_ClosedDate 				= null;
			newBasedAITasks.CountryBasedAITask_Status 				    = 0;
			newBasedAITasks.CountryBasedAITask_Revision_Code 			= request.body.based_ai_revision_id;	 
			
			newBasedAITasks.save();

			return response.send({
				message: true
			});
		}


		AddNewTasks();
	});

	app.post('/AddCountryBasedAIData',function (request, response){

		async function AddNewCountryBasedAIData(){
			var resultTask  					= await updateTaskDone();
			var resultCountryBasedAIRevision    = await updateCountryBasedAIRevision();
			var dataCountryBasedRevision   		= await getCountryBasedRevision(request.body.based_ai_revision_id);
			var UpdateCountryBasedAI         	= await UpdateCountryBasedAI(dataCountryBasedRevision);
			var CountryBasedAIHistoryID      	= await getCountryBasedAIHistoryID();
			var insertCountryBasedHistory  		= await insetCountryBasedHistory(dataCountryBasedRevision,CountryBasedAIHistoryID);
			var removeCountryBasedRevision 		= await removeOldCountryBasedRevision(request.body.based_ai_revision_id);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					CountryBasedAITask_Status 				: 1,
					CountryBasedAITask_ClosedDate 			: new Date(), 
				} };

				var myquery = { CountryBasedAITask_Code: request.body.task_id }; 

				CountryBasedAITasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function updateCountryBasedAIRevision(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						CountryBasedAIRevision_PublishStatus 			: 1,
						CountryBasedAIRevision_Publishedby_Employee_ID  :request.body.user_id,
						CountryBasedAIRevision_PublishDate_Close 		:new Date(),
						CountryBasedAIRevision_RevisionCode				:1,
				} };

				var myquery = { CountryBasedAIRevision_Code: request.body.based_ai_revision_id }; 

				CountryBasedAIRevision.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function getTNRevision(revision_id){
			return new Promise((resolve, reject) => {
				CountryBasedAIRevision.findOne({CountryBasedAIRevision_Code:revision_id} ,function(err, Basedrevision) {
					if (err) 
						resolve( err);
					else
						resolve(Basedrevision);
				})
			})
		};

		function UpdateCountryBasedAI(data){

			var newvalues = { $set: {
	            CountryBasedAI_Dosing 	     				: data.CountryBasedAIRevision_Dosing,
	            CountryBasedAI_UsaageLabeledIndications	 	: data.CountryBasedAIRevision_UsaageLabeledIndications,
	            CountryBasedAI_UsaageOffLabeledIndications	: CountryBasedAIRevision_UsaageOffLabeledIndications,
	            CountryBasedAI_Administration   			: data.CountryBasedAIRevision_Administration,
	            CountryBasedAI_DietaryConsiderations		: data.CountryBasedAIRevision_DietaryConsiderations,
	            CountryBasedAI_PreparationForAdministration	: data.CountryBasedAIRevision_PreparationForAdministration,
	            CountryBasedAI_PregnancyConsideration		: data.CountryBasedAIRevision_PregnancyConsideration,
	            CountryBasedAI_Storage						: data.CountryBasedAIRevision_Storage,
	            CountryBasedAI_Stability					: data.CountryBasedAI_Stability,
			} };

			var myquery = { CountryBasedAI_Code: data.CountryBasedAIRevision_CountryBasedAI_Code };


			CountryBasedAI.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'Country AI not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
			})
		}

		function getCountryBasedAIHistoryID(){
			return new Promise((resolve, reject) => {
				CountryBasedAIHistory.getLastCode(function(err, BasedAI){
					if (BasedAI) 
						resolve( Number(BasedAI.CountryBasedAIHistory_Code)+1);
					else
						resolve(1);
				})
			})
		};


		function insetCountryBasedHistory(data,CountryBasedAIHistoryID){
			var newCountryBasedAIHistory = new CountryBasedAIHistory();
			newCountryBasedAIHistory.CountryBasedAIHistory_Code     						= CountryBasedAIHistoryID;
			newCountryBasedAIHistory.CountryBasedAIHistory_Dosing 	    					= data.CountryBasedAIRevision_Dosing;
			newCountryBasedAIHistory.CountryBasedAIHistory_UsaageLabeledIndications    		= data.CountryBasedAIRevision_UsaageLabeledIndications;
			newCountryBasedAIHistory.CountryBasedAIHistory_UsaageOffLabeledIndications 	 	= data.CountryBasedAIRevision_UsaageOffLabeledIndications;
			newCountryBasedAIHistory.CountryBasedAIHistory_Administration    				= data.CountryBasedAIRevision_Administration;
			newCountryBasedAIHistory.CountryBasedAIHistory_DietaryConsiderations			= data.CountryBasedAIRevision_DietaryConsiderations;
		    newCountryBasedAIHistory.CountryBasedAIHistory_PreparationForAdministration		= data.CountryBasedAIRevision_PreparationForAdministration;
		    newCountryBasedAIHistory.CountryBasedAIHistory_PregnancyConsideration			= data.CountryBasedAIRevision_PregnancyConsideration;
		    newCountryBasedAIHistory.CountryBasedAIHistory_Storage   						= data.CountryBasedAIRevision_Storage;
		    newCountryBasedAIHistory.CountryBasedAIHistory_Stability  						= data.CountryBasedAIRevision_Stability;
		    newCountryBasedAIHistory.CountryBasedAIHistory_AI_Code 							= data.CountryBasedAIRevision_AI_Code;
		    newCountryBasedAIHistory.CountryBasedAIHistory_Country_ID						= data.CountryBasedAIRevision_Country_ID;
		    newCountryBasedAIHistory.CountryBasedAIHistory_CountryBasedAI_Code				= data.CountryBasedAIRevision_CountryBasedAI_Code;
		    
		    newCountryBasedAIHistory.CountryBasedAIHistory_AssiendToEditor_Employee_ID		= data.CountryBasedAIRevision_AssiendToEditor_Employee_ID;
		    newCountryBasedAIHistory.CountryBasedAIHistory_EditStatus						= data.CountryBasedAIRevision_EditStatus;
		    newCountryBasedAIHistory.CountryBasedAIHistory_EditDate_Start					= data.CountryBasedAIRevision_EditDate_Start;
		    newCountryBasedAIHistory.CountryBasedAIHistory_EditedBy_Employee_ID				= data.CountryBasedAIRevision_EditedBy_Employee_ID;
		    newCountryBasedAIHistory.CountryBasedAIHistory_EditDate_Close					= data.CountryBasedAIRevision_EditDate_Close;
		    
		    newCountryBasedAIHistory.CountryBasedAIHistory_AssiendToReviewer_Employee_ID	= data.CountryBasedAIRevision_AssiendToReviewer_Employee_ID;
		    newCountryBasedAIHistory.CountryBasedAIHistory_ReviewStatus						= data.CountryBasedAIRevision_ReviewStatus;
		    newCountryBasedAIHistory.CountryBasedAIHistory_ReviewDate_Start					= data.CountryBasedAIRevision_ReviewDate_Start;
		    newCountryBasedAIHistory.CountryBasedAIHistory_ReviewedBy_Employee_ID			= data.CountryBasedAIRevision_ReviewedBy_Employee_ID;
		    newCountryBasedAIHistory.CountryBasedAIHistory_ReviewDate_Close					= data.CountryBasedAIRevision_ReviewDate_Close;
		   
		    newCountryBasedAIHistory.CountryBasedAIHistory_AssiendToGrammer_Employee_ID		= data.CountryBasedAIRevision_AssiendToGrammer_Employee_ID;
		    newCountryBasedAIHistory.CountryBasedAIHistory_GrammerStatus					= data.CountryBasedAIRevision_GrammerStatus;
		    newCountryBasedAIHistory.CountryBasedAIHistory_GrammerReview_Date_Start			= data.CountryBasedAIRevision_GrammerReview_Date_Start;
		    newCountryBasedAIHistory.CountryBasedAIHistory_GrammerReviewBy_Employee_ID		= data.CountryBasedAIRevision_GrammerReviewBy_Employee_ID;
		    newCountryBasedAIHistory.CountryBasedAIHistory_GrammerReview_Date_Close			= data.CountryBasedAIRevision_GrammerReview_Date_Close;
		    
		    newCountryBasedAIHistory.CountryBasedAIHistory_AssiendToPublisher_Employee_ID	= data.CountryBasedAIRevision_AssiendToPublisher_Employee_ID;
		    newCountryBasedAIHistory.CountryBasedAIHistory_PublishStatus					= data.CountryBasedAIRevision_PublishStatus;
		    newCountryBasedAIHistory.CountryBasedAIHistory_PublishDate_Start				= data.CountryBasedAIRevision_PublishDate_Start;
		    newCountryBasedAIHistory.CountryBasedAIHistory_Publishedby_Employee_ID			= data.CountryBasedAIRevision_Publishedby_Employee_ID;
		    newCountryBasedAIHistory.CountryBasedAIHistory_PublishDate_Close				= data.CountryBasedAIRevision_PublishDate_Close;

    		newCountryBasedAIHistory.CountryBasedAIHistory_RevisionCode                     = data.CountryBasedAIRevision_RevisionCode;

		   	newCountryBasedAIHistory.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}else {
	                return response.send({
						message: true
					});
				}

			})	
		}

		function removeOldCountryBasedRevision(revision_id){
			return new Promise((resolve, reject) => {
				CountryBasedAIRevision.remove({CountryBasedAIRevision_Code:revision_id} ,function(err, basedrevision) {
					if (err) 
						resolve( err);
					else
						resolve(true);
				})
			})
		};

		AddNewCountryBasedAIData();
	})
	
	app.get('/getTasksBasedAIByEmployeeID', function(request, response) {

		CountryBasedAITasks.find({CountryBasedAITask_AssignTo_Employee_Code:request.body.employee_id}, function(err, tasks) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (tasks) {
	        	
	            response.send(tasks);
	        } 
    	})
    });


	app.post('/addCountry',function (request, response){

		async function getLastCountry(){
			var NextCode = await getNextCode();
			insertCountry(NextCode);
		}
		function getNextCode(){
			return new Promise((resolve, reject) => {
				Country.getLastCode(function(err,contry){
					if (contry) 
						resolve( Number(contry.Country_Code)+1);
					else
						resolve(1);
				})
			})
		};
		function insertCountry(NextCode){
			var newcontry= new Country();
			newcontry.Country_Code     	 		 = NextCode;
			newcontry.Country_Name 	     		 = request.body.name;
			newcontry.Country_IsActive	         = 1;
			newcontry.Country_Tcode 	         = request.body.Tcode;
			newcontry.Country_IsDB 		         = 0;

			newcontry.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}
				else{
					return response.send({
						message: true
					});
				}
			});
		}
		getLastCountry();
	});


	app.post('/editCountry',function (request, response){

		var newvalues = { $set: {
				Country_Name 					: request.body.name,
				Country_IsActive 				: request.body.status,
				Country_Tcode 					: request.body.Tcode,
				Country_IsDB 					: request.body.IsDB,
			} };

		var myquery = { Country_Code: request.body.row_id }; 


		Country.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Country not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});


	app.get('/getAllCountries', function(request, response) {
		Country.find({}, function(err, country) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (country) {
	        	
	            response.send(country);
	        } 
    	});
    });

	//get a hasshed password tobe saved at client Cookie
	app.get('/getHashedStrings', function(request, response) {
		response.send(bcrypt.hashSync(request.body.sttohash, bcrypt.genSaltSync(8), null));
    });

	// new Route .. 
	app.get('/getPermisionRolesType', function(request, response) {
			System_setting.findOne({System_Setting_ConfigName:"CMS_User_RoleTypes"}, function(err, roleTypes) {
			    if (err){
			    	response.send({message: 'Error'});
			    }
		        if (roleTypes) {
					
						response.send(roleTypes.System_Setting_ConfigValue);
				} 


    		});
    });

    // new route
 	
    app.post('/editAI',function (request, response){

		var newvalues = { $set: {
				AI_Name 					    				: request.body.name,
				AI_ATC_Code 									: request.body.atc_code, 
				AI_Status 										: request.body.status,
				AI_Pharmaceutical_Categories_ID 				: request.body.category_Ids,
			} };

		var myquery = { AI_Code: request.body.row_id }; 

		AI.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'AI not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});

    app.post('/editAIRevision',function (request, response){

		var newvalues = { $set: {
				AIMasterRevision_FDAFeed			 			: request.body.AIMasterRevision_FDAFeed,
			    AIMasterRevision_EUFeed			 				: request.body.AIMasterRevision_EUFeed,
			    AIMasterRevision_ClinicalPracticeGuidelines	 	: request.body.AIMasterRevision_ClinicalPracticeGuidelines,
			    AIMasterRevision_Contraindications   			: request.body.AIMasterRevision_Contraindications,
			    AIMasterRevision_Warnings_Precautions  			: request.body.AIMasterRevision_Warnings_Precautions,
			    AIMasterRevision_AdverseReactionsConcerns 		: request.body.AIMasterRevision_AdverseReactionsConcerns,
			    AIMasterRevision_DiseaseRelatedConcerns			: request.body.AIMasterRevision_DiseaseRelatedConcerns,
			    AIMasterRevision_DoseFormSpecificIssues			: request.body.AIMasterRevision_DoseFormSpecificIssues,
			    AIMasterRevision_Others							: request.body.AIMasterRevision_Others,
			    AIMasterRevision_GeriatricConsideration			: request.body.AIMasterRevision_GeriatricConsideration,
			    AIMasterRevision_PregnancyConsideration			: request.body.AIMasterRevision_PregnancyConsideration,
			} };

		var myquery = { AIMasterRevision_Code: request.body.row_id }; 


		AIRevisions.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'AI not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});


    app.post('/searchAIName', function(request, response) {
		var Searchquery = request.body.searchField;
			AI.find ({AI_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }},function(err, ai) {
				if (err){
    	    		return response.send({
						user : request.user ,
						message: err
					});
    	    	}

    	    	if (ai.length == 0) {
					return response.send({
						user : request.user ,
						message: 'No AI Name Found !!'
					});
            	} else {
					return response.send({
						user : request.user ,
						ai: ai
					});
				}
			}).sort({AI_Name:-1})
	});


    app.post('/searchAIATCCode', function(request, response) {
		var Searchquery = request.body.searchField;
			AI.find ({AI_ATC_Code:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }},function(err, ai) {
				if (err){
    	    		return response.send({
						user : request.user ,
						message: err
					});
    	    	}

    	    	if (ai.length == 0) {
					return response.send({
						user : request.user ,
						message: 'No AI ATC Code Found !!'
					});
            	} else {
					return response.send({
						user : request.user ,
						ai: ai
					});
				}
			})
	});

    app.post('/searchPharmaceuticalAtcCode', function(request, response) {
		var Searchquery = request.body.searchField;
			Pharmaceutical_category.find({Pharmaceutical_Category_ATC_Code:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }},function(err, atc_code) {
				if (err){
    	    		return response.send({
						user : request.user ,
						message: err
					});
    	    	}

    	    	if (atc_code.length == 0) {
					return response.send({
						user : request.user ,
						message: 'No ATC Code Found !!'
					});
            	} else {
					return response.send({
						user : request.user ,
						atc_code: atc_code
					});
				}
			}).sort({Pharmaceutical_Category_ATC_Code:-1})
	});

	   
    // new route 

    app.post('/addUsageDoseUnit',function (request, response){
		
		async function getLastUsage(){
			var UsageNextCode = await getNextUsage();
			insetIntoUsageDoseUnit(UsageNextCode);
        }

		function getNextUsage(){
			return new Promise((resolve, reject) => {
			 	UsageDoseUnit.getLastCode(function(err,usage){
					if (usage) 
						resolve( Number(UsageDoseUnit.UsageDoseUnit_Code)+1);
					else
					resolve(1);
				})
			})
    	}

    	function insetIntoUsageDoseUnit(UsageNextCode){
            var newUsage = new UsageDoseUnit();
            newUsage.UsageDoseUnit_Code                = UsageNextCode;
            newUsage.UsageDoseUnit_Name                = request.body.name;
            newUsage.UsageDoseUnit_Description         = request.body.desc;
            newUsage.UsageDoseUnit_IsActive            = 1;
            newUsage.save(function(error, doneadd){
                if(error){
                    return response.send({
                        message: error
                    });
                }
                else{
                    return response.send({
                        message: true
                    });
                }
            });
        }
		getLastUsage();
    });


    app.post('/addUsageDuration',function (request, response){
		
		async function getLastUsageDuration(){
			var UsageDurationNextCode = await getNextUsageDuration();
			insetIntoUsageDuration(UsageDurationNextCode);
        }

		function getNextUsageDuration(){
			return new Promise((resolve, reject) => {
			 	UsageDoseDuration.getLastCode(function(err,usage_duration){
					if (usage_duration) 
						resolve( Number(usage_duration.UsageDoseDurationUnit_Code)+1);
					else
					resolve(1);
				})
			})
    	}

    	function insetIntoUsageDuration(UsageDurationNextCode){
            var newUsageDuration = new UsageDoseDuration();
            newUsageDuration.UsageDoseDurationUnit_Code                = UsageDurationNextCode;
            newUsageDuration.UsageDoseDurationUnit_Name                = request.body.name;
            newUsageDuration.UsageDoseDurationUnit_Description         = request.body.desc;
            newUsageDuration.UsageDoseDurationUnit_IsActive            = 1;
            newUsageDuration.save(function(error, doneadd){
                if(error){
                    return response.send({
                        message: error
                    });
                }
                else{
                    return response.send({
                        message: true
                    });
                }
            });
        }
		getLastUsageDuration();
    });
    


    app.post('/addUsageDoseType',function (request, response){
		
		async function getLastUsageDoseType(){
			var UsageDoseTypeNextCode = await getNextUsageDoseType();
			insetIntoUsageDoseType(UsageDoseTypeNextCode);
        }

		function getNextUsageDoseType(){
			return new Promise((resolve, reject) => {
			 	UsageDoseType.getLastCode(function(err,usage_type){
					if (usage_type) 
						resolve( Number(usage_type.UsageDoseType_Code)+1);
					else
					resolve(1);
				})
			})
    	}

    	function insetIntoUsageDoseType(UsageDoseTypeNextCode){
            var newUsageType = new UsageDoseType();
            newUsageType.UsageDoseType_Code                = UsageDoseTypeNextCode;
            newUsageType.UsageDoseType_Name                = request.body.name;
            newUsageType.UsageDoseType_Description         = request.body.desc;
            newUsageType.UsageDoseType_IsActive            = 1;
            newUsageType.save(function(error, doneadd){
                if(error){
                    return response.send({
                        message: error
                    });
                }
                else{
                    return response.send({
                        message: true
                    });
                }
            });
        }
		getLastUsageDoseType();
    });
   

   	app.post('/addUsageFrequenInterval',function (request, response){
		
		async function getLastUsageFrequenInterval(){
			var UsageFrequenIntervalNextCode = await getNextUsageFrequenInterval();
			insetIntoUsageFrequenInterval(UsageFrequenIntervalNextCode);
        }

		function getNextUsageFrequenInterval(){
			return new Promise((resolve, reject) => {
			 	UsageFrequenInterval.getLastCode(function(err,frequen_interval){
					if (frequen_interval) 
						resolve( Number(frequen_interval.UsageFrequenIntervalUnit_Code)+1);
					else
					resolve(1);
				})
			})
    	}

    	function insetIntoUsageFrequenInterval(UsageFrequenIntervalNextCode){
            var newFrequenInterval = new UsageFrequenInterval();
            newFrequenInterval.UsageFrequenIntervalUnit_Code                = UsageFrequenIntervalNextCode;
            newFrequenInterval.UsageFrequenIntervalUnit_Name                = request.body.name;
            newFrequenInterval.UsageFrequenIntervalUnit_Description         = request.body.desc;
            newFrequenInterval.UsageFrequenIntervalUnit_IsActive            = 1;
            newFrequenInterval.save(function(error, doneadd){
                if(error){
                    return response.send({
                        message: error
                    });
                }
                else{
                    return response.send({
                        message: true
                    });
                }
            });
        }
		getLastUsageFrequenInterval();
    });

   	app.post('/addUsageAge',function (request, response){
		
		async function getLastUsageAge(){
			var UsageAgeNextCode = await getNextUsageAge();
			insetIntoUsageAge(UsageAgeNextCode);
        }

		function getNextUsageAge(){
			return new Promise((resolve, reject) => {
			 	UsageAge.getLastCode(function(err,usage_age){
					if (usage_age) 
						resolve( Number(usage_age.UsageAge_Code)+1);
					else
					resolve(1);
				})
			})
    	}

    	function insetIntoUsageAge(UsageAgeNextCode){
            var newUsageAge = new UsageAge();
            newUsageAge.UsageAge_Code                = UsageAgeNextCode;
            newUsageAge.UsageAge_Name                = request.body.name;
            newUsageAge.UsageAge_Description         = request.body.desc;
            newUsageAge.UsageAge_IsActive            = 1;
            newUsageAge.save(function(error, doneadd){
                if(error){
                    return response.send({
                        message: error
                    });
                }
                else{
                    return response.send({
                        message: true
                    });
                }
            });
        }
		getLastUsageAge();
    });


   	app.post('/addCurrency',function (request, response){
		
		async function getLastCurrency(){
			var CurrencyNextCode = await getNextCurrency();
			insetIntoCurrency(CurrencyNextCode);
        }

		function getNextCurrency(){
			return new Promise((resolve, reject) => {
			 	Currency.getLastCode(function(err,currency){
					if (currency) 
						resolve( Number(currency.Currency_Code)+1);
					else
					resolve(1);
				})
			})
    	}

    	function insetIntoCurrency(CurrencyNextCode){
            var newCurrency = new Currency();
            newCurrency.Currency_Code                = CurrencyNextCode;
            newCurrency.Currency_Name                = request.body.name;
            newCurrency.Currency_Description         = request.body.desc;
            newCurrency.Currency_IsActive            = 1;
            newCurrency.save(function(error, doneadd){
                if(error){
                    return response.send({
                        message: error
                    });
                }
                else{
                    return response.send({
                        message: true
                    });
                }
            });
        }
		getLastCurrency();
    });



   	app.post('/addMedicalCondition',function (request, response){
		
		async function getLastMedicalCondition(){
			var MedicalConditionNextCode = await getNextMedicalCondition();
			insetIntoMedicalCondition(MedicalConditionNextCode);
        }

		function getNextMedicalCondition(){
			return new Promise((resolve, reject) => {
			 	MedicalCondition.getLastCode(function(err,medical_condition){
					if (medical_condition) 
						resolve( Number(medical_condition.MedicalCondition_Code)+1);
					else
					resolve(1);
				})
			})
    	}

    	function insetIntoMedicalCondition(MedicalConditionNextCode){
            var newMedicalCondition = new MedicalCondition();
            newMedicalCondition.MedicalCondition_Code               	         = MedicalConditionNextCode;
            newMedicalCondition.MedicalCondition_Name                			 = request.body.name;
            newMedicalCondition.MedicalCondition_Description         			 = request.body.desc;
            newMedicalCondition.MedicalCondition_IsActive            			 = 1;
            newMedicalCondition.MedicalCondition_ICD9            			     = request.body.icd9;
            newMedicalCondition.MedicalCondition_ICD10            			     = request.body.icd10;
            newMedicalCondition.MedicalCondition_ICD10am            			 = request.body.icd10am;
			newMedicalCondition.MedicalCondition_ICD11            			     = request.body.icd11;

            newMedicalCondition.save(function(error, doneadd){
                if(error){
                    return response.send({
                        message: error
                    });
                }
                else{
                    return response.send({
                        message: true
                    });
                }
            });
        }
		getLastMedicalCondition();
    });


   	app.post('/editUsageDoseUnit',function (request, response){

		var newvalues = { $set: {
				UsageDoseUnit_Name 					: request.body.name,
				UsageDoseUnit_Description 			: request.body.desc, 
				UsageDoseUnit_IsActive 				: request.body.status,
			} };

		var myquery = { UsageDoseUnit_Code: request.body.row_id }; 


		UsageDoseUnit.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Usage Dose not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});

	app.post('/editUsageDuration',function (request, response){

		var newvalues = { $set: {
				UsageDoseDurationUnit_Name 					: request.body.name,
				UsageDoseDurationUnit_Description 			: request.body.desc, 
				UsageDoseDurationUnit_IsActive 				: request.body.status,
			} };

		var myquery = { UsageDoseDurationUnit_Code: request.body.row_id }; 


		UsageDoseDuration.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Usage Dose not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});

	app.post('/editUsageDoseType',function (request, response){

		var newvalues = { $set: {
				UsageDoseType_Name 					: request.body.name,
				UsageDoseType_Description 			: request.body.desc, 
				UsageDoseType_IsActive 				: request.body.status,
			} };

		var myquery = { UsageDoseType_Code: request.body.row_id }; 


		UsageDoseType.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Usage Dose Type not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});

	app.post('/editUsageFrequenInterval',function (request, response){

		var newvalues = { $set: {
				UsageFrequenIntervalUnit_Name 					: request.body.name,
				UsageFrequenIntervalUnit_Description 			: request.body.desc, 
				UsageFrequenIntervalUnit_IsActive 				: request.body.status,
			} };

		var myquery = { UsageFrequenIntervalUnit_Code: request.body.row_id }; 


		UsageFrequenInterval.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Usage Frequen Interval not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});

	app.post('/editUsageAge',function (request, response){

		var newvalues = { $set: {
				UsageAge_Name 					: request.body.name,
				UsageAge_Description 			: request.body.desc, 
				UsageAge_IsActive 				: request.body.status,
			} };

		var myquery = { UsageAge_Code: request.body.row_id }; 


		UsageAge.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Usage Age not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});

	app.post('/editCurrency',function (request, response){

		var newvalues = { $set: {
				Currency_Name 					: request.body.name,
				Currency_Description 			: request.body.desc, 
				Currency_IsActive 				: request.body.status,
			} };

		var myquery = { Currency_Code: request.body.row_id }; 


		Currency.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Usage Age not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});

	app.post('/editMedicalCondition',function (request, response){
		
		var newvalues = { $set: {
				MedicalCondition_Name 					: request.body.name,
				MedicalCondition_Description 			: request.body.desc, 
				MedicalCondition_IsActive 				: request.body.status,
			    MedicalCondition_ICD9            	    : request.body.icd9,
	            MedicalCondition_ICD10            	    : request.body.icd10,
	            MedicalCondition_ICD10am            	: request.body.icd10am,
			    MedicalCondition_ICD11            	    : request.body.icd11,
			} };

		var myquery = { MedicalCondition_Code: request.body.row_id }; 


		MedicalCondition.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Usage Age not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});


	app.get('/getAllUsageDoseUnit', function(request, response) {
		UsageDoseUnit.find({}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});


	app.get('/getAllUsageDuration', function(request, response) {
		UsageDoseDuration.find({}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});


	app.get('/getAllUsageDoseType', function(request, response) {
		UsageDoseType.find({}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});

	app.get('/getAllUsageFrequenInterval', function(request, response) {
		UsageFrequenInterval.find({}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});

	app.get('/getAllUsageAge', function(request, response) {
		UsageAge.find({}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});

	app.get('/getAllCurrency', function(request, response) {
		Currency.find({}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});

	app.get('/getAllMedicalCondition', function(request, response) {
		MedicalCondition.find({}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});


	app.get('/getUsageDoseUnit', function(request, response) {
		UsageDoseUnit.find({UsageDoseUnit_IsActive:1}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});

	app.get('/getUsageDuration', function(request, response) {
		UsageDoseDuration.find({UsageDoseDurationUnit_Code:1}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});


	app.get('/getUsageDoseType', function(request, response) {
		UsageDoseType.find({UsageDoseType_IsActive:1}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});

	app.get('/getUsageFrequenInterval', function(request, response) {
		UsageFrequenInterval.find({UsageFrequenIntervalUnit_IsActive:1}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});

	app.get('/getUsageAge', function(request, response) {
		UsageAge.find({UsageAge_IsActive:1}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});

	app.get('/getCurrency', function(request, response) {
		Currency.find({Currency_IsActive:1}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});

	app.get('/getMedicalCondition', function(request, response) {
		MedicalCondition.find({MedicalCondition_IsActive:1}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	});
	
	app.get('/getActiveForm', function(request, response) {
		Forms.find({Form_IsActive:1}, function(err, form) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (form) {
	        	
	            response.send(form);
	        } 
    	});
	});

	app.get('/getActiveRoute', function(request, response) {
		Routes.find({Route_IsActive:1}, function(err, route) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (route) {
	        	
	            response.send(route);
	        } 
    	});
    });

	app.post('/AddTaskAIToReviewer',function (request, response){

		async function AddNewTasks(){
			var resultTask  		= await updateTaskDone();
			var resultAI  			= await updateAI();
			var Reviewer_ID 		= await getEmployeeId();
			var resultAIRevision  	= await updateAIRevision(Reviewer_ID);
			var MasterTasks_ID   	= await getMasterTasksId();
			insetIntoAITasks(Reviewer_ID,MasterTasks_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					AI_Master_Clinical_Data_Task_Status 				: 1,
					AI_Master_Clinical_Data_Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { AI_Master_Clinical_Data_Task_Code: request.body.task_id }; 

				AITasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function updateAI(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						AI_Status 	: 0,
				} };

				var myquery = { AI_Code: request.body.ai_id }; 

				AI.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function getEmployeeId(){
			return new Promise((resolve, reject) => {
				Employee_role.findOne({ $and: [ { Employee_Role_Role_Code:2 }, { Employee_Role_Type_Code: 1 }, { Employee_Role_Sub_Role_Type: 1 } ] }, function(err, emp_role) {
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (emp_role) {
			            resolve(emp_role.Employee_Role_Employee_Code);
			        } 
		    	});
			})
		}

		function updateAIRevision(Reviewer_ID){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						AIMasterRevision_EditStatus 					: 1,
						AIMasterRevision_EditedBy_Employee_ID   		:request.body.user_id,
						AIMasterRevision_EditDate_Close 				:new Date(),

						AIMasterRevision_AssiendToReviewer_Employee_ID  :Reviewer_ID,
						AIMasterRevision_ReviewStatus					:0,
						AIMasterRevision_ReviewDate_Start				:new Date(),
				} };

				var myquery = { AIMasterRevision_Code: request.body.ai_revision_id }; 

				AIRevisions.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function getMasterTasksId(){
			return new Promise((resolve, reject) => {
				AITasks.getLastCode(function(err, AIMaTs){
					if (AIMaTs) 
						resolve( Number(AIMaTs.AI_Master_Clinical_Data_Task_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function insetIntoAITasks(Reviewer_ID,MasterTasks_ID){

			var newAITasks =  AITasks() ;
			newAITasks.AI_Master_Clinical_Data_Task_Code       					= MasterTasks_ID;
			newAITasks.AI_Master_Clinical_Data_Task_Title 					    = request.body.name;
			newAITasks.AI_Master_Clinical_Data_Task_AssignDate 				    = new Date();
			newAITasks.AI_Master_Clinical_Data_Task_Task_Type_Code 	  		    = 2;
			newAITasks.AI_Master_Clinical_Data_Task_Task_Type_Name 	  		    = "Review";
			newAITasks.AI_Master_Clinical_Data_Task_AssignTo_Employee_Code      = Reviewer_ID;
			newAITasks.AI_Master_Clinical_Data_Task_ClosedDate 				    = null;
			newAITasks.AI_Master_Clinical_Data_Task_Status 					    = 0;
			newAITasks.AI_Master_Clinical_Data_Task_AI_Master_Revision_Code 	= request.body.ai_revision_id;	 
			newAITasks.AI_Master_Clinical_Data_Task_AI_Code						= request.body.ai_id;
			newAITasks.save();

			NotificationDetails='';

			NotificationDetails = {
						Task_id 				: MasterTasks_ID,
						Title 					: request.body.name,
						Task_date 				: new Date(),
						Type_Code 				: 2,
						Type_Name 				: "Review",
						AssignTo_Employee_Code 	: Reviewer_ID,
						AIRevision_ID 			: AIRevision_ID,
						Task_Status 			: 0,
					}

			var UserInSockets = clients.find(o => o.UserID === Reviewer_ID);
			if(UserInSockets){
				console.log(clients);
				var ClientSocketArray = clients.filter(function(obj) {
					if(obj.UserID === 1)
						return true
					else
						return false
				});
				ClientSocketArray.forEach(function (arrayItem) {
					var SocktesToSendNotification = arrayItem.Socket;
					console.log(SocktesToSendNotification)
					io.sockets.connected[SocktesToSendNotification].emit("notification", NotificationDetails);
				});
				
			}

			return response.send({
				message: true
			});
		}


		AddNewTasks();
	});

	app.get('/searchAIByID', function(request, response) {
		var Searchquery = request.query.row_id;
		console.log(request.query.row_id);

			AI.findOne({AI_Code: Number(Searchquery)},function(err, ai) {
				if (err){
    	    		return response.send({
						user : request.user ,
						message: err
					});
    	    	}

    	    	if (ai.length == 0) {
					return response.send({
						user : request.user ,
						message: 'No AI Code Found !!'
					});
            	} else {
					return response.send({
						user : request.user ,
						ai: ai
					});
				}
			})
	}); 

	app.post('/AddTaskAIToGrammer',function (request, response){

		async function AddNewTasks(){
			var resultTask  	  = await updateTaskDone();
			var Grammer_ID  	  = await getEmployeeId();
			var resultAIRevision  = await updateAIRevision(Grammer_ID);
			var MasterTasks_ID    = await getMasterTasksId();
			insetIntoAITasks(Grammer_ID,MasterTasks_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					AI_Master_Clinical_Data_Task_Status 				: 1,
					AI_Master_Clinical_Data_Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { AI_Master_Clinical_Data_Task_Code: request.body.task_id }; 

				AITasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function getMasterTasksId(){
			return new Promise((resolve, reject) => {
				AITasks.getLastCode(function(err, AIMaTs){
					if (AIMaTs) 
						resolve( Number(AIMaTs.AI_Master_Clinical_Data_Task_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function getEmployeeId(){
			return new Promise((resolve, reject) => {
				Employee_role.findOne({ $and: [ { Employee_Role_Role_Code:3 }, { Employee_Role_Type_Code: 1 }, { Employee_Role_Sub_Role_Type: 1 } ] }, function(err, emp_role) {
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (emp_role) {
			            resolve(emp_role.Employee_Role_Employee_Code);
			        } 
		    	});
			})
		};


		function updateAIRevision(Grammer_ID){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						AIMasterRevision_ReviewStatus 					: 1,
						AIMasterRevision_ReviewedBy_Employee_ID   		:request.body.user_id,
						AIMasterRevision_ReviewDate_Close 				:new Date(),

						AIMasterRevision_AssiendToGrammer_Employee_ID   :Grammer_ID,
						AIMasterRevision_GrammerStatus				    :0,
						AIMasterRevision_GrammerReview_Date_Start	    :new Date(),
				} };

				var myquery = { AIMasterRevision_Code: request.body.ai_revision_id }; 

				AIRevisions.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};


		function insetIntoAITasks(Grammer_ID,MasterTasks_ID){
		
			var newAITasks =  AITasks() ;

			newAITasks.AI_Master_Clinical_Data_Task_Code       					= MasterTasks_ID;
			newAITasks.AI_Master_Clinical_Data_Task_Title 					    = request.body.name;
			newAITasks.AI_Master_Clinical_Data_Task_AssignDate 				    = new Date();
			newAITasks.AI_Master_Clinical_Data_Task_Task_Type_Code 	  		    = 2;
			newAITasks.AI_Master_Clinical_Data_Task_Task_Type_Name 	  		    = "Grammer Review";
			newAITasks.AI_Master_Clinical_Data_Task_AssignTo_Employee_Code   	= Grammer_ID;
			newAITasks.AI_Master_Clinical_Data_Task_ClosedDate 				    = null;
			newAITasks.AI_Master_Clinical_Data_Task_Status 					    = 0;
			newAITasks.AI_Master_Clinical_Data_Task_AI_Master_Revision_Code 	= request.body.ai_revision_id; 
			newAITasks.AI_Master_Clinical_Data_Task_AI_Code						= request.body.ai_id;
			
			newAITasks.save();

			NotificationDetails='';

			NotificationDetails = {
						Task_id 				: MasterTasks_ID,
						Title 					: request.body.name,
						Task_date 				: new Date(),
						Type_Code 				: 2,
						Type_Name 				: "Grammer",
						AssignTo_Employee_Code 	: Grammer_ID,
						AIRevision_ID 			: AIRevision_ID,
						Task_Status 			: 0,
					}

			var UserInSockets = clients.find(o => o.UserID === Grammer_ID);
			if(UserInSockets){
				console.log(clients);
				var ClientSocketArray = clients.filter(function(obj) {
					if(obj.UserID === 1)
						return true
					else
						return false
				});
				ClientSocketArray.forEach(function (arrayItem) {
					var SocktesToSendNotification = arrayItem.Socket;
					console.log(SocktesToSendNotification)
					io.sockets.connected[SocktesToSendNotification].emit("notification", NotificationDetails);
				});
				
			}

			return response.send({
				message: true
			});
		}


		AddNewTasks();
	});

	app.post('/AddTaskAIToPublisher',function (request, response){

		async function AddNewTasks(){
			var resultTask        = await updateTaskDone();
			var Publisher_ID 	  = await getEmployeeId();
			var resultAIRevision  = await updateAIRevision(Publisher_ID);

			var MasterTasks_ID    = await getMasterTasksId();
			insetIntoAITasks(Publisher_ID,MasterTasks_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					AI_Master_Clinical_Data_Task_Status 				: 1,
					AI_Master_Clinical_Data_Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { AI_Master_Clinical_Data_Task_Code: request.body.task_id }; 

				AITasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function getEmployeeId(){
			return new Promise((resolve, reject) => {
				Employee_role.findOne({ $and: [ { Employee_Role_Role_Code:4 }, { Employee_Role_Type_Code: 1 }, { Employee_Role_Sub_Role_Type: 1 } ] }, function(err, emp_role) {
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (emp_role) {
			            resolve(emp_role.Employee_Role_Employee_Code);
			        } 
		    	});
			})
		}

		function updateAIRevision(Publisher_ID){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						AIMasterRevision_GrammerStatus 					: 1,
						AIMasterRevision_GrammerReviewBy_Employee_ID   	:request.body.user_id,
						AIMasterRevision_GrammerReview_Date_Close 		:new Date(),

						AIMasterRevision_AssiendToPublisher_Employee_ID :Publisher_ID,
						AIMasterRevision_PublishStatus				    :0,
						AIMasterRevision_PublishDate_Start	    		:new Date()
				} };

				var myquery = { AIMasterRevision_Code: request.body.ai_revision_id }; 

				AIRevisions.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function getMasterTasksId(){
			return new Promise((resolve, reject) => {
				AITasks.getLastCode(function(err, AIMaTs){
					if (AIMaTs) 
						resolve( Number(AIMaTs.AI_Master_Clinical_Data_Task_Code)+1);
					else
						resolve(1);
				})
			})
		};


		function insetIntoAITasks(Publisher_ID,MasterTasks_ID){
		
			var newAITasks =  AITasks() ;

			newAITasks.AI_Master_Clinical_Data_Task_Code       					= MasterTasks_ID;
			newAITasks.AI_Master_Clinical_Data_Task_Title 					    = request.body.name;
			newAITasks.AI_Master_Clinical_Data_Task_AssignDate 					= new Date();
			newAITasks.AI_Master_Clinical_Data_Task_Task_Type_Code 	  		    = 2;
			newAITasks.AI_Master_Clinical_Data_Task_Task_Type_Name 	  		    = "Publish";
			newAITasks.AI_Master_Clinical_Data_Task_AssignTo_Employee_Code      = Publisher_ID;
			newAITasks.AI_Master_Clinical_Data_Task_ClosedDate 					= null;
			newAITasks.AI_Master_Clinical_Data_Task_Status 						= 0;
			newAITasks.AI_Master_Clinical_Data_Task_AI_Master_Revision_Code 	= request.body.ai_revision_id;	 
			newAITasks.AI_Master_Clinical_Data_Task_AI_Code						= request.body.ai_id;
			
			newAITasks.save();

			NotificationDetails='';

			NotificationDetails = {
						Task_id 				: MasterTasks_ID,
						Title 					: request.body.name,
						Task_date 				: new Date(),
						Type_Code 				: 2,
						Type_Name 				: "Publish",
						AssignTo_Employee_Code 	: Publisher_ID,
						AIRevision_ID 			: AIRevision_ID,
						Task_Status 			: 0,
					}

			var UserInSockets = clients.find(o => o.UserID === Publisher_ID);
			if(UserInSockets){
				console.log(clients);
				var ClientSocketArray = clients.filter(function(obj) {
					if(obj.UserID === 1)
						return true
					else
						return false
				});
				ClientSocketArray.forEach(function (arrayItem) {
					var SocktesToSendNotification = arrayItem.Socket;
					console.log(SocktesToSendNotification)
					io.sockets.connected[SocktesToSendNotification].emit("notification", NotificationDetails);
				});
				
			}

			return response.send({
				message: true
			});
		}


		AddNewTasks();
	});



	// add data to AI for user can use it when employe publish it 

	app.post('/AddAIData',function (request, response){

		async function AddNewAiData(){
			var resultTask  		= await updateTaskDone();
			var resultAIRevision    = await updateAIRevision();

			var dataAIRevision   	= await getAIRevision(request.body.ai_revision_id);
			var insertAi         	= await insetIntoAI(dataAIRevision);
			var AIHistoryID      	= await getNextAIHistoryID();
			var insertAiHistory  	= await insetIntoAIHistory(dataAIRevision,AIHistoryID);
			var removeAIRevision 	= await removeOldAiRevision(request.body.ai_revision_id);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					AI_Master_Clinical_Data_Task_Status 				: 1,
					AI_Master_Clinical_Data_Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { AI_Master_Clinical_Data_Task_Code: request.body.task_id }; 

				AITasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function updateAIRevision(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						AIMasterRevision_PublishStatus 				: 1,
						AIMasterRevision_Publishedby_Employee_ID   	:request.body.user_id,
						AIMasterRevision_PublishDate_Close 			:new Date(),
						AIMasterRevision_RevisionCode				:1,
				} };

				var myquery = { AIMasterRevision_Code: request.body.ai_revision_id }; 

				AIRevisions.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Field Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function getAIRevision(revision_id){
			return new Promise((resolve, reject) => {
				AIRevisions.findOne({AIMasterRevision_Code:revision_id} ,function(err, airevision) {
					if (err) 
						resolve( err);
					else
						resolve(airevision);
				})
			})
		};

		function insetIntoAI(data){

			var newvalues = { $set: {
				AI_FDAFeed			 			: data.AIMasterRevision_FDAFeed,
			    AI_EUFeed			 			: data.AIMasterRevision_EUFeed,
			    AI_ClinicalPracticeGuidelines	: data.AIMasterRevision_ClinicalPracticeGuidelines,
			    AI_Contraindications   			: data.AIMasterRevision_Contraindications,
			    AI_Warnings_Precautions  		: data.AIMasterRevision_Warnings_Precautions,
			    AI_AdverseReactionsConcerns 	: data.AIMasterRevision_AdverseReactionsConcerns,
			    AI_DiseaseRelatedConcerns		: data.AIMasterRevision_DiseaseRelatedConcerns,
			    AI_DoseFormSpecificIssues		: data.AIMasterRevision_DoseFormSpecificIssues,
			    AI_Others						: data.AIMasterRevision_Others,
			    AI_GeriatricConsideration		: data.AIMasterRevision_GeriatricConsideration,
			    AI_PregnancyConsideration		: data.AIMasterRevision_PregnancyConsideration,
			} };

			var myquery = { AI_Code: request.body.ai_id }; 

			AI.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return response.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return response.send({
						message: 'AI not exists'
					});
	            } else {
	                return response.send({
						message: true
					});
				}
			})
		}

		function getNextAIHistoryID(){
			return new Promise((resolve, reject) => {
				AIHistory.getLastCode(function(err, AIdata){
					if (AIdata) 
						resolve( Number(AIdata.AIHistory_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function insetIntoAIHistory(data,AIHistoryID){
			var newAIHistory = new AIHistory();
			newAIHistory.AIHistory_Code     						= AIHistoryID;
			newAIHistory.AIHistory_Name 	    					= data.AIMasterRevision_Name;
			newAIHistory.AIHistory_ATC_Code    						= data.AIMasterRevision_ATC_Code;
			newAIHistory.AIHistory_Status 	 					 	= data.AIMasterRevision_Status;
			newAIHistory.AIHistory_Pharmaceutical_Categories_ID     = data.AIMasterRevision_Pharmaceutical_Categories_ID;
			newAIHistory.AIHistory_FDAFeed			 				= data.AIMasterRevision_FDAFeed;
		    newAIHistory.AIHistory_EUFeed			 				= data.AIMasterRevision_EUFeed;
		    newAIHistory.AIHistory_ClinicalPracticeGuidelines		= data.AIMasterRevision_ClinicalPracticeGuidelines;
		    newAIHistory.AIHistory_Contraindications   				= data.AIMasterRevision_Contraindications;
		    newAIHistory.AIHistory_Warnings_Precautions  			= data.AIMasterRevision_Warnings_Precautions;
		    newAIHistory.AIHistory_AdverseReactionsConcerns 		= data.AIMasterRevision_AdverseReactionsConcerns;
		    newAIHistory.AIHistory_DiseaseRelatedConcerns			= data.AIMasterRevision_DiseaseRelatedConcerns;
		    newAIHistory.AIHistory_DoseFormSpecificIssues			= data.AIMasterRevision_DoseFormSpecificIssues;
		    newAIHistory.AIHistory_Others							= data.AIMasterRevision_Others;
		    newAIHistory.AIHistory_GeriatricConsideration			= data.AIMasterRevision_GeriatricConsideration;
		    newAIHistory.AIHistory_PregnancyConsideration			= data.AIMasterRevision_PregnancyConsideration;
		    
		    newAIHistory.AIHistory_AssiendToEditor_Employee_ID		= data.AIMasterRevision_AssiendToEditor_Employee_ID;
		    newAIHistory.AIHistory_EditStatus						= data.AIMasterRevision_EditStatus;
		    newAIHistory.AIHistory_EditDate_Start					= data.AIMasterRevision_EditDate_Start;
		    newAIHistory.AIHistory_EditedBy_Employee_ID				= data.AIMasterRevision_EditedBy_Employee_ID;
		    newAIHistory.AIHistory_EditDate_Close					= data.AIMasterRevision_EditDate_Close;
		    
		    newAIHistory.AIHistory_AssiendToReviewer_Employee_ID	= data.AIMasterRevision_AssiendToReviewer_Employee_ID;
		    newAIHistory.AIHistory_ReviewStatus						= data.AIMasterRevision_ReviewStatus;
		    newAIHistory.AIHistory_ReviewDate_Start					= data.AIMasterRevision_ReviewDate_Start;
		    newAIHistory.AIHistory_ReviewedBy_Employee_ID			= data.AIMasterRevision_ReviewedBy_Employee_ID;
		    newAIHistory.AIHistory_ReviewDate_Close					= data.AIMasterRevision_ReviewDate_Close;
		   
		    newAIHistory.AIHistory_AssiendToGrammer_Employee_ID		= data.AIMasterRevision_AssiendToGrammer_Employee_ID;
		    newAIHistory.AIHistory_GrammerStatus					= data.AIMasterRevision_GrammerStatus;
		    newAIHistory.AIHistory_GrammerReview_Date_Start			= data.AIMasterRevision_GrammerReview_Date_Start;
		    newAIHistory.AIHistory_GrammerReviewBy_Employee_ID		= data.AIMasterRevision_GrammerReviewBy_Employee_ID;
		    newAIHistory.AIHistory_GrammerReview_Date_Close			= data.AIMasterRevision_GrammerReview_Date_Close;
		    
		    newAIHistory.AIHistory_AssiendToPublisher_Employee_ID	= data.AIMasterRevision_AssiendToPublisher_Employee_ID;
		    newAIHistory.AIHistory_PublishStatus					= data.AIMasterRevision_PublishStatus;
		    newAIHistory.AIHistory_PublishDate_Start				= data.AIMasterRevision_PublishDate_Start;
		    newAIHistory.AIHistory_Publishedby_Employee_ID			= data.AIMasterRevision_Publishedby_Employee_ID;
		    newAIHistory.AIHistory_PublishDate_Close				= data.AIMasterRevision_PublishDate_Close;

    		newAIHistory.AIHistory_revision                      	= data.AIMasterRevision_RevisionCode;




		   	newAIHistory.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}else {
	                return response.send({
						message: true
					});
				}

			})	
		}

		function removeOldAiRevision(revision_id){
			return new Promise((resolve, reject) => {
				AIRevisions.remove({AIMasterRevision_Code:revision_id} ,function(err, airevision) {
					if (err) 
						resolve( err);
					else
						resolve(true);
				})
			})
		};

		AddNewAiData();
	});
	// new routes

	app.get('/getMedicalCondation', function(request, response) {
		MedicalCondition.find({}, function(err, medical_condation) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (medical_condation) {
	        	
	            response.send(medical_condation);
	        } 
    	}).sort({MedicalCondition_Code:-1}).limit(20)
	});
	
	app.post('/getMedicalCondationByname', function(request, response) {
		var Searchquery = request.body.searchField;
		MedicalCondition.find ({MedicalCondition_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }},function(err, medical_condation) {
			if (err){
	    		return response.send({
					message: err
				});
	    	}

	    	if (medical_condation.length == 0) {
				return response.send({
					message: 'No Medical Condition Found !!'
				});
        	} else {
				return response.send({
					medical_condation: medical_condation
				});
			}
		})
	});

	app.post('/searchMedicalCondationByICD9', function(request, response) {
		var Searchquery = request.body.searchField;

		MedicalCondition.find({MedicalCondition_ICD9:Searchquery},function(err, medical_condation) {
			if (err){
	    		return response.send({
					message: err
				});
	    	}

	    	if (medical_condation.length == 0) {
				return response.send({
					message: 'No Medical Condition Found !!'
				});
        	} else {
				return response.send({
					medical_condation: medical_condation
				});
			}
		})
	});


	app.post('/searchMedicalCondationByICD10', function(request, response) {
		var Searchquery = request.body.searchField;
		
		MedicalCondition.find({MedicalCondition_ICD10:Searchquery},function(err, medical_condation) {
			if (err){
	    		return response.send({
					message: err
				});
	    	}

	    	if (medical_condation.length == 0) {
				return response.send({
					message: 'No Medical Condition Found !!'
				});
        	} else {
				return response.send({
					medical_condation: medical_condation
				});
			}
		})
	});


	app.post('/searchMedicalCondationByICD10am', function(request, response) {
		var Searchquery = request.body.searchField;
		
		MedicalCondition.find({MedicalCondition_ICD10am:Searchquery},function(err, medical_condation) {
			if (err){
	    		return response.send({
					message: err
				});
	    	}

	    	if (medical_condation.length == 0) {
				return response.send({
					message: 'No Medical Condition Found !!'
				});
        	} else {
				return response.send({
					medical_condation: medical_condation
				});
			}
		})
	});
	

	app.post('/searchMedicalCondationByICD11', function(request, response) {
		var Searchquery = request.body.searchField;
		
		MedicalCondition.find({MedicalCondition_ICD11:Searchquery},function(err, medical_condation) {
			if (err){
	    		return response.send({
					message: err
				});
	    	}

	    	if (medical_condation.length == 0) {
				return response.send({
					message: 'No Medical Condition Found !!'
				});
        	} else {
				return response.send({
					medical_condation: medical_condation
				});
			}
		})
	});


	app.get('/getMedicalCondationById', function(request, response) {
		MedicalCondition.findOne({MedicalCondition_Code}, function(err, medical_condation) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (medical_condation) {
	        	
	            response.send(medical_condation);
	        } 
    	});
	});

	
	//  edit data
	app.post('/editPharmaceuticalCategory',function (request, response){

		var newvalues = { $set: {
				Pharmaceutical_Category_Name 		: request.body.name,
				Pharmaceutical_Category_IsActive 	: request.body.status, 
				Pharmaceutical_Category_ATC_Code 	: request.body.atc_code,
			} };

		var myquery = { Pharmaceutical_Category_Code: request.body.row_id }; 


		Pharmaceutical_category.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					// user : request.user ,
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					// user : request.user ,
					message: 'Pharmaceutical Category not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});


	// new route 



};
function auth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

