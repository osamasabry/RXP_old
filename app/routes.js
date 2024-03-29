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

var Pharmaceutical_category    =require('../app/models/lut_pharmaceutical_categories');


var Forms                      = require('../app/models/lut_form');

var Routes                     = require('../app/models/lut_route');

var Concentration              = require('../app/models/lut_concentration');

var StrengthUnits			   = require('../app/models/lut_strength_units');

var WeightUnits				   = require('../app/models/lut_weight_units');

var VolumeUnits				   = require('../app/models/lut_volume_units');

var SizeUnits				   = require('../app/models/lut_size_units');

var TN     					   = require('../app/models/TN');

var TNRevisions                = require('./models/TN_revisions');

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

var UniversalTasks 			   = require('../app/models/Universal_tasks');


var CountryBasedTN             = require('../app/models/country_based_TN');

var CountryBasedTNRevision     = require('../app/models/country_based_TN_revision');

var CountryBasedTNHistory      = require('../app/models/country_based_TN_history');





var  nextCode ='';
var data = [];

var PermissionName = [];

var NotificationDetails = {};

var clients = [];


var path = require('path'),
	 fs = require('fs');
var shell = require('shelljs');


module.exports = function(app, passport, server, generator, sgMail,io,tinify) {
	
	app.get('/logout', function(request, response) {
		request.logout();
		response.redirect('/');
	});

	// first route call login  
	app.get('/', function(request, response) {
		response.redirect('http://cp.rxpedia.info');
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
		console.log('connected: ' + socket.id)
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
			// console.log('disconnected: ' + socket.id);
			// console.log('clients Befor delete:');
			// console.log(clients);
			clients.forEach(function (arrayItem) {
				if(arrayItem.Socket === socket.id){
					var index = clients.indexOf(arrayItem);
    				clients.splice(index, 1);
					//clients.remove(function(el) { return el.Socket === socket.id; });
					//console.log('disconnected: ' + socket.id);

				}
			});
			// for(var name in clients) {
			// 	if(clients[name].socket === socket.id) {
			// 		delete clients[name];
			// 		//break;
			// 	}
			// }	
			// console.log('clients After delete:');
			// console.log(clients);
		})
	})
	

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
				console.log(password);
				
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
					newUser.User_Permissions           = ["LOGEDUSER"];

	                newUser.save();
					 const msg = {
					  to: request.body.email,
					  from: 'dev@pharmedsolutions.com',
					  subject: 'Account Login',
					  text: 'Hello mr'+request.body.name+' userName:'+request.body.email+' Password:'+password,
					  html: '<h1>Hello mr'+request.body.name+'</h1><br><p>userName:'+request.body.email+'</p><br>Password:'+password,
					};
					sgMail.send(msg); 

                	response.send({flag: true});
				}	
					
            }
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

    app.get('/getCountriesIsDB', function(request, response) {
		Country.find({$and:[ {'Country_IsActive':1}, {'Country_IsDB':1} ]}, function(err, country) {
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
	                AccountUser_Account_ID   			  = nextCode;
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

	app.post('/changePassword',function (request, response){

		User.findOne({ 'User_Code' :  request.body.User_Code }, function(err, user) {
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
		Pharmaceutical_category.find({})
		.sort({Pharmaceutical_Category_Name:1})
		.exec(function(err, Pharmaceutical) {
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
			var Tasks_ID   = await getTasksId();
			var AIRevision_ID   = await getAIRevisionId();

			insetIntoAI(AINextID,Employee_ID,Tasks_ID,AIRevision_ID);
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

		function getTasksId(){
			return new Promise((resolve, reject) => {
				UniversalTasks.getLastCode(function(err, AIMaTs){
					if (AIMaTs) 
						resolve( Number(AIMaTs.Task_Code)+1);
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


		function insetIntoAI(AINextID,Employee_ID,Tasks_ID,AIRevision_ID){
			var newAI = new AI();
			newAI.AI_Code     						 = AINextID;
			newAI.AI_Name 	    					 = request.body.name;
			newAI.AI_ATC_Code    					 = request.body.atc_code;
			newAI.AI_NDC_Code    					 = request.body.AI_NDC_Code;
			newAI.AI_Status 	 					 = null;
			newAI.AI_Pharmaceutical_Categories_ID    = request.body.category_Ids;
			newAI.AI_VersionCode    				 = 0;

			newAI.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}
				else{

					var newAiReVision = AIRevisions();
					newAiReVision.AIMasterRevision_NDC_Code					   = request.body.AI_NDC_Code;
					newAiReVision.AIMasterRevision_ATC_Code 				   = request.body.atc_code;
					newAiReVision.AIMasterRevision_Code  		 			   = AIRevision_ID;
					newAiReVision.AIMasterRevision_AI_ID 		 			   = AINextID;
					newAiReVision.AIMasterRevision_AssiendToEditor_Employee_ID = Employee_ID;
					newAiReVision.AIMasterRevision_EditStatus 				   = 0;
					newAiReVision.AIMasterRevision_EditDate_Start			   = new Date();	
					newAiReVision.save();

					var newTask =  UniversalTasks() ;
					newTask.Task_Code						= Tasks_ID;
					newTask.Task_Title 				    	= request.body.name;
					newTask.Task_AssignTo_Employee_Code		= Employee_ID;
					newTask.Task_AssignDate 			    = new Date();
					newTask.Task_ActionTypeName 	  	    = "Edit";
					newTask.Task_ActionDetails_Code			= AIRevision_ID;
					newTask.Task_RelatedTo 	  	    		= "Master AI";
					newTask.Task_RelatedTo_Code				= AINextID;
					newTask.Task_Status 					= 0;
					newTask.Task_ClosedDate 			    = null;
					newTask.save();

					NotificationDetails = {
						Task_Code                       : Tasks_ID,
						Task_Title                      : request.body.name,
						Task_AssignTo_Employee_Code     : Employee_ID,
						Task_AssignDate                 : new Date(),
						Task_ActionTypeName             : "Edit",
						Task_ActionDetails_Code         : AIRevision_ID,
						Task_RelatedTo                  : "Master AI",
						Task_RelatedTo_Code             : AINextID,
						Task_Status                     :0,
						icon: 'fa fa-edit',
						iconColor: '#ef9a29',
					}

					var UserInSockets = clients.find(o => o.UserID === Employee_ID);
					if(UserInSockets){
						var ClientSocketArray = clients.filter(function(obj) {
							if(obj.UserID === Employee_ID)
								return true
							else
								return false
						});
						ClientSocketArray.forEach(function (arrayItem) {
							var SocktesToSendNotification = arrayItem.Socket;
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


	app.post('/getUserTasksbyUserID', function(request, response) {
		async function GetUserTasks(){
			var TasksCount = await getTasksCount();
			UniversalTasks.find({ $and:[ {'Task_AssignTo_Employee_Code': Number(request.body.user_id)},
			{'Task_Status':0} ]}).populate({ path: 'Employee', select: 'Employee_Name Employee_Email' }).sort({Task_AssignDate:1}).limit(10).exec(function(err, tasks) {
				if (err){
					return response.send({
						message: err
					});
				}
				if (tasks.length == 0) {
					return response.send({
						message: 'No Task Found !!'
					});
				} else {
					return response.send({
						tasks: tasks,
						taskCount : TasksCount
					});
				}
			})
		}
		function getTasksCount(){
			return new Promise((resolve, reject) => {
				UniversalTasks.count({ $and:[ {'Task_AssignTo_Employee_Code': Number(request.body.user_id)},{'Task_Status':0} ]},function(err, tasksCount) {
					if (tasksCount) 
						resolve(tasksCount);
					else
						resolve(0);
				});
			});
		}
		GetUserTasks()
	});
	app.post('/getUserAllTasksbyUserID', function(request, response) {
		async function GetUserTasks(){
			UniversalTasks.find({ $and:[ {'Task_AssignTo_Employee_Code': Number(request.body.user_id)},{'Task_Status':0} ]})
			.populate({ path: 'Employee', select: 'Employee_Name Employee_Email' })
			.sort({Task_AssignDate:1})
			.exec(function(err, tasks) {
				if (err){
					return response.send({
						message: err
					});
				}
				if (tasks.length == 0) {
					return response.send({
						message: 'No Task Found !!'
					});
				} else {
					return response.send({
						tasks: tasks
					});
				}
			})
		}
		GetUserTasks()
	});
	
	// get  basic data of AI 
	app.get('/getAI', function(request, response) {
		AI.find({})
		.select('AI_Code AI_Name AI_ATC_Code AI_Status AI_Pharmaceutical_Categories_ID')
		.populate({ path: 'pharamaceutical', select: 'Pharmaceutical_Category_Name Pharmaceutical_Category_ATC_Code' })
    	.sort({AI_Code:-1}).limit(20)
		.exec(function(err, ai) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (ai) {
	            response.send(ai);
	        } 
    	})
	});

	app.get('/getAIletterfilter', function(request, response) {
		//var regexp = new RegExp('^'+request.query.letter+'$', "i")//new RegExp("^"+ request.query.letter);
		//console.log(regexp)
		
		AI.find({ AI_Name: { $regex: new RegExp("^" + request.query.letter, "i") }})
		.select('AI_Code AI_Name AI_ATC_Code AI_Status AI_Pharmaceutical_Categories_ID')
		.populate({ path: 'pharamaceutical', select: 'Pharmaceutical_Category_Name Pharmaceutical_Category_ATC_Code' })
    	.sort({AI_Name:1})
		.exec(function(err, ai) {
		    if (err){
		    	response.send({message: err});
		    }
	        if (ai) {
	            response.send(ai);
	        } 
    	})
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

	app.get('/getAllAIminiData', function(request, response) {
		AI.find({})
		.select('AI_Code AI_Name AI_ATC_Code AI_Status AI_Pharmaceutical_Categories_ID')
		.sort({AI_Name:-1})
		.exec(function(err, ai) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (ai) {
	        	
	            response.send(ai);
	        } 
    	})
    });
	
	app.get('/getAIRevision', function(request, response) {
		AIRevisions.find({AIMasterRevision_AI_ID:request.query.ai_id}, function(err, airevision) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (airevision) {
	        	
	            response.send(airevision);
	        }else{

	        	 response.send(false);
	        } 
    	})
    });

	//  get data  
	app.get('/getForm', function(request, response) {
		Forms.find({})
		.sort({Form_Name:1})
        .exec(function(err, form) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (form) {
	        	
	            response.send(form);
	        } 
    	});
	});

	app.get('/getConcentration', function(request, response) {
		Concentration.find({})
		.sort({ConcentrationUnit_Name:1})
		.exec(function(err, ConcentrationUnits) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (ConcentrationUnits) {
	        	
	            response.send(ConcentrationUnits);
	        } 
    	});
    });

	app.get('/getRoute', function(request, response) {
		Routes.find({})
		.sort({Route_Name:1})
		 .exec(function(err, route) {
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
		WeightUnits.find({})
		.sort({WeightUnit_Name:1})
        .exec(function(err, WeightUnits) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (WeightUnits) {
	        	
	            response.send(WeightUnits);
	        } 
    	});
    });

    app.get('/getVolumeUnits', function(request, response) {
		VolumeUnits.find({})
		.sort({VolumeUnit_Name:1})
        .exec(function(err, VolumeUnits) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (VolumeUnits) {
	        	
	            response.send(VolumeUnits);
	        } 
    	});
    });

    app.get('/getSizeUnits', function(request, response) {
		SizeUnits.find({})
		.sort({SizeUnit_Name:1})
        .exec( function(err, SizeUnits) {
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
            newForm.Form_CdPrev         	 = request.body.cdprev;

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
            	newRoute.Route_CdPrev        = request.body.cdprev;
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
            	Form_CdPrev         		: request.body.cdprev,
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
				Route_CdPrev			    : request.body.cdprev,
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
		var TNID =0;
		var CountryIsDB = {};
		async function AddNewTNRevisionData(){
			TNID 					 	  	  = await getNextTNID();
			var insertTN         		 	  = await insetIntoTN(TNID);
			var TNRevisionNextCode      	  = await getNextTNRevisionCode();
			var Reviewer_ID 	        	  = await getEmployeeId();
			var insertIntoTNRevison     	  = await insertNewTNRevision(TNRevisionNextCode,TNID,Reviewer_ID);
			var Tasks_ID   	   		  		  = await getTasksId();
			insetIntoTasks(Reviewer_ID,Tasks_ID,TNRevisionNextCode,TNID);
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
		function getTasksId(){
			return new Promise((resolve, reject) => {
				UniversalTasks.getLastCode(function(err, AIMaTs){
				if (AIMaTs) 
					resolve( Number(AIMaTs.Task_Code)+1);
				else
					resolve(1);
				})
			})
		};
		function insetIntoTasks(Reviewer_ID,Tasks_ID,TNRevisionNextCode,TNID){

			var newTask =  UniversalTasks() ;
			newTask.Task_Code                       = Tasks_ID;
			newTask.Task_Title                      = request.body.TN_Name;
			newTask.Task_AssignTo_Employee_Code     = Reviewer_ID;
			newTask.Task_AssignDate                 = new Date();
			newTask.Task_ActionTypeName             = "Review";
			newTask.Task_ActionDetails_Code         = TNRevisionNextCode;
			newTask.Task_RelatedTo                  = "Master TN";
			newTask.Task_RelatedTo_Code             = TNID;
			newTask.Task_Status                     = 0;
			newTask.Task_ClosedDate                 = null;
			newTask.save();

			NotificationDetails = {
				Task_Code                      	: Tasks_ID,
				Task_Title                      : request.body.TN_Name,
				Task_AssignTo_Employee_Code     : Reviewer_ID,
				Task_AssignDate   			    : new Date(),
				Task_ActionTypeName             : "Review",
				Task_ActionDetails_Code         : TNRevisionNextCode,
				Task_RelatedTo                  : "Master TN",
				Task_RelatedTo_Code             : TNID,
				Task_Status 					:0,
				icon: 'fa fa-eye',
				iconColor: '#04ec65',
			}
			var UserInSockets = clients.find(o => o.UserID === Reviewer_ID);
			console.log(UserInSockets);
			if(UserInSockets){
				var ClientSocketArray = clients.filter(function(obj) {
					if(obj.UserID === Reviewer_ID)
						return true
					else
						return false
				});
				console.log(ClientSocketArray);
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

		async function addTaskCountryClincal(){
			var ai_ids = request.body.TN_ActiveIngredients;
			//var cont_ids = request.body.TN_Countries;
			CountryIsDB 					= await checkCountryIsDB(request.body.TN_Country_IDs);
			var CountryBasedAIID           	= await getNextCountryBasedAIID();
			var CountryBasedAIIDRevision    = await getNextCountryBasedAIRevisionID();
			var TaskID  				   	= await getTasksId();
			for (var i = 0; i < ai_ids.length; i++) {
				var ai_id 	= Number(ai_ids[i].AI_Code);
				var ai_name = ai_ids[i].AI_Name;
				for (var j = 0; j < CountryIsDB.length; j++) {
					var country_id 			   		  = Number(CountryIsDB[j].Country_Code);
					var Title 				  		  = ai_name +' for '+ CountryIsDB[j].Country_Name; 			
					var InsertCountryBasedAI      	  = await insertIntoCountryBasedAI(CountryBasedAIID,country_id,ai_id);
					var EditorCountryBasedAIID        = await getEditorCountryBasedAI(country_id);
					var InsertCountryBasedAIRevision  = await insertIntoCountryBasedAIRevision(CountryBasedAIIDRevision,CountryBasedAIID,country_id,ai_id,EditorCountryBasedAIID);
					var InsertIntoTasks 			  = await insertIntoTasksCountryClincal(TaskID,EditorCountryBasedAIID,CountryBasedAIIDRevision,Title,ai_id);
					
					CountryBasedAIID++;
					CountryBasedAIIDRevision++;
					TaskID++;
				}
			}
		}
		function checkCountryIsDB(cont_ids){
			
			return new Promise((resolve, reject) => {
				Country.find({$and:[ {'Country_Code':{$in:cont_ids}}, {'Country_IsDB':1} ]}, function(err, country) {
				
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (country) {
			            resolve(country);

			        }else{
			        	resolve({message: false});
			        }
		    	});
			})
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
		function insertIntoTasksCountryClincal(Tasks_ID,EditorCountryBasedAIID,CountryBasedAIRevisionID,Title,ai_id){
			var newTask =  UniversalTasks() ;
			newTask.Task_Code                       = Tasks_ID;
			newTask.Task_Title                      = Title;
			newTask.Task_AssignTo_Employee_Code     = EditorCountryBasedAIID;
			newTask.Task_AssignDate                 = new Date();
			newTask.Task_ActionTypeName             = "Edit";
			newTask.Task_ActionDetails_Code         = CountryBasedAIRevisionID;
			newTask.Task_RelatedTo                  = "Country Clinical Data";
			newTask.Task_RelatedTo_Code             = ai_id;
			newTask.Task_Status                     = 0;
			newTask.Task_ClosedDate                 = null;
			newTask.save();

			NotificationDetails = {
				Task_Code                       : Tasks_ID,
				Task_Title                      : Title,
				Task_AssignTo_Employee_Code     : EditorCountryBasedAIID,
				Task_AssignDate                 : new Date(),
				Task_ActionTypeName             : "Edit",
				Task_ActionDetails_Code         : CountryBasedAIRevisionID,
				Task_RelatedTo                  : "Country Clinical Data",
				Task_RelatedTo_Code             : ai_id,
				Task_Status                     : 0,
				icon							: 'fa fa-edit',
				iconColor						: '#04ec65',
			}
			
			var UserInSockets = clients.find(o => o.UserID === EditorCountryBasedAIID);
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

		async function addTaskCountryNonClincal(){
			var CountryBasedTNID           	= await getNextCountryBasedTNID();
			var CountryBasedTNIDRevision    = await getNextCountryBasedTNRevisionID();
			var TaskID  				   	= await getTasksId();
			for (var j = 0; j < CountryIsDB.length; j++) {
				var country_id 			   		  = Number(CountryIsDB[j].Country_Code);
				var Title 				  		  = request.body.TN_Name +' for '+ CountryIsDB[j].Country_Name; 			
				var InsertCountryBasedTN      	  = await insertIntoCountryBasedTN(CountryBasedTNID,country_id,TNID);
				var EditorCountryBasedTNID        = await getEditorCountryBasedTN(country_id);
				var InsertCountryBasedTNRevision  = await insertIntoCountryBasedTNRevision(CountryBasedTNIDRevision,CountryBasedTNID,country_id,TNID,EditorCountryBasedTNID);
				var InsertIntoTasks 			  = await insertIntoTasksCountryNonClinical(TaskID,EditorCountryBasedTNID,CountryBasedTNIDRevision,Title,TNID);
				
				CountryBasedTNID++;
				CountryBasedTNIDRevision++;
				TaskID++;
			}
		}
		function getNextCountryBasedTNID(){
			return new Promise((resolve, reject) => {
				CountryBasedTN.getLastCode(function(err, tn){
					if (tn) 
						resolve( Number(tn.CountryBasedTN_Code)+1);
					else
						resolve(1);
				})
			})
		}	
		function getNextCountryBasedTNRevisionID(){
			return new Promise((resolve, reject) => {
				CountryBasedTNRevision.getLastCode(function(err, revision){
					if (revision) 
						resolve( Number(revision.CountryBasedTNRevision_Code)+1);
					else
						resolve(1);
				})
			})
		}
		function insertIntoCountryBasedTN(CountryBasedTNID,country_id,TNID){
			var newCountryBasedTN =  CountryBasedTN() ;

			newCountryBasedTN.CountryBasedTN_Code       	= CountryBasedTNID;
			newCountryBasedTN.CountryBasedTN_TN_Code 		= TNID;
			newCountryBasedTN.CountryBasedTN_Country_ID 	= country_id;
			newCountryBasedTN.save(function(err,done){;
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
		function getEditorCountryBasedTN(country_id){
			return new Promise((resolve, reject) => {
				Employee_role.findOne({ $and: [ { Employee_Role_Role_Code:1 }, { Employee_Role_Type_Code: 2 },{ Employee_Role_Sub_Role_Type:4 },{ Employee_Role_Country_Code:country_id },{ Employee_Role_Status:1 } ] }, function(err, emp_role) {
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (emp_role) {
			            resolve(emp_role.Employee_Role_Employee_Code);
			        }
		    	});
			})
		}
		function insertIntoCountryBasedTNRevision(CountryBasedTNIDRevision,CountryBasedTNID,country_id,TNID,EditorCountryBasedTNID){
			var newCountryBasedTNRevision =  CountryBasedTNRevision() ;

			newCountryBasedTNRevision.CountryBasedTNRevision_Code       					    = CountryBasedTNIDRevision;
			newCountryBasedTNRevision.CountryBasedTNRevision_TN_Code       					    = TNID;
			newCountryBasedTNRevision.CountryBasedTNRevision_Country_ID       					= country_id;
			newCountryBasedTNRevision.CountryBasedTNRevision_CountryBasedTN_Code				= CountryBasedTNID;
			newCountryBasedTNRevision.CountryBasedTNRevision_AssiendToEditor_Employee_ID 		= EditorCountryBasedTNID;
			newCountryBasedTNRevision.CountryBasedTNRevision_EditStatus 						= 0;
			newCountryBasedTNRevision.CountryBasedTNRevision_EditDate_Start 	  				= new Date();
			newCountryBasedTNRevision.save();

			return response.send({
				message: true
			});
		}
		function insertIntoTasksCountryNonClinical(Tasks_ID,EditorCountryBasedTNID,CountryBasedTNIDRevision,Title,TNID){
			var newTask =  UniversalTasks() ;
			newTask.Task_Code                       = Tasks_ID;
			newTask.Task_Title                      = Title;
			newTask.Task_AssignTo_Employee_Code     = EditorCountryBasedTNID;
			newTask.Task_AssignDate                 = new Date();
			newTask.Task_ActionTypeName             = "Edit";
			newTask.Task_ActionDetails_Code         = CountryBasedTNIDRevision;
			newTask.Task_RelatedTo                  = "Country Non Clinical Data";
			newTask.Task_RelatedTo_Code             = TNID;
			newTask.Task_Status                     = 0;
			newTask.Task_ClosedDate                 = null;
			newTask.save();

			NotificationDetails = {
				Task_Code                       : Tasks_ID,
				Task_Title                      : Title,
				Task_AssignTo_Employee_Code     : EditorCountryBasedTNID,
				Task_AssignDate                 : new Date(),
				Task_ActionTypeName             : "Edit",
				Task_ActionDetails_Code         : CountryBasedTNIDRevision,
				Task_RelatedTo                  : "Country Non Clinical Data",
				Task_RelatedTo_Code             : TNID,
				Task_Status                     : 0,
				icon							: 'fa fa-edit',
				iconColor						: '#04ec65',
			}
			
			var UserInSockets = clients.find(o => o.UserID === EditorCountryBasedTNID);
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
					io.sockets.connected[SocktesToSendNotification].emit("notification", NotificationDetails);
				});
				
			}

			return response.send({
				message: true
			});
		}

		async function MainProcessFunction(){
			await AddNewTNRevisionData();
			await addTaskCountryClincal();
			await addTaskCountryNonClincal();
		}
		MainProcessFunction();
		
	});


	app.post('/AddTNToPublisher',function (request, response){

		async function AddNewTasks(){
			var Publisher_ID = await getEmployeeId();
			var resultTNRevision = await updateTNRevision(Publisher_ID);
			var Tasks_ID   = await getTasksId();
			updateTaskDone();
			insetIntoTasks(Publisher_ID,Tasks_ID);
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
					TNRevision_ReviewStatus 					: 1,
					TNRevision_ReviewedBy_Employee_ID   		:request.body.TNRevision_ReviewedBy_Employee_ID,
					TNRevision_ReviewDate_Close 				:new Date(),

					TNRevision_AssiendToPublisher_Employee_ID :Publisher_ID,
					TNRevision_PublishStatus					:0,
					TNRevision_PublishDate_Start				:new Date(),
				} };

				var myquery = { TNRevision_Code: request.body.TNRevision_Code }; 

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
		function getTasksId(){
			return new Promise((resolve, reject) => {
				UniversalTasks.getLastCode(function(err, AIMaTs){
					if (AIMaTs) 
						resolve( Number(AIMaTs.Task_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					Task_Status 				: 1,
					Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { Task_Code: request.body.task_id }; 

				UniversalTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Task Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function insetIntoTasks(Publisher_ID,Tasks_ID){
			var newTask =  UniversalTasks() ;
			newTask.Task_Code                       = Tasks_ID;
			newTask.Task_Title                      = request.body.TN_Name;
			newTask.Task_AssignTo_Employee_Code     = Publisher_ID;
			newTask.Task_AssignDate                 = new Date();
			newTask.Task_ActionTypeName             = "Publish";
			newTask.Task_ActionDetails_Code         = request.body.TNRevision_Code;
			newTask.Task_RelatedTo                  = "Master TN";
			newTask.Task_RelatedTo_Code             = request.body.TN_Code;
			newTask.Task_Status                     = 0;
			newTask.Task_ClosedDate                 = null;
			newTask.save();

			NotificationDetails = {
				Task_Code                       : Tasks_ID,
				Task_Title                      : request.body.TN_Name,
				Task_AssignTo_Employee_Code     : Publisher_ID,
				Task_AssignDate                 : new Date(),
				Task_ActionTypeName             : "Publish",
				Task_ActionDetails_Code         : request.body.TaskRevisionID,
				Task_RelatedTo                  : "Master TN",
				Task_RelatedTo_Code             : request.body.TN_Code,
				Task_Status                     :0,
				icon: 'fa fa-cloud-upload',
				iconColor: '#4ebcd4',
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
					Task_Status 				: 1,
					Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { Task_Code: request.body.task_id }; 

				UniversalTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Task Not Exist");

		            } else {
						var UserInSockets = clients.find(o => o.UserID === request.body.user_id);
						if(UserInSockets){
							var ClientSocketArray = clients.filter(function(obj) {
								if(obj.UserID === request.body.user_id)
									return true
								else
									return false
							});
							ClientSocketArray.forEach(function (arrayItem) {
								var SocktesToSendNotification = arrayItem.Socket;
								io.sockets.connected[SocktesToSendNotification].emit("taskfinished", {taskisdone: true});
							});
						}
						resolve(true);
					}
				})
			})
		};

		function updateTNRevision(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					TNRevision_PublishStatus 				: 1,
					TNRevision_Publishedby_Employee_ID   	:request.body.user_id,
					TNRevision_PublishDate_Close 			:new Date(),
					TNRevision_RevisionCode					:1,
				} };

				var myquery = { TNRevision_Code: request.body.revision_id }; 

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
				TNRevisions.findOne({TNRevision_Code:revision_id} ,function(err, TNrevision) {
					if (err) 
						resolve( err);
					else
						resolve(TNrevision);
				})
			})
		};

		function UpdateIntoTN(data){
			console.log(data);
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
		if(Searchquery) Searchquery = Searchquery.toLowerCase();
		else Searchquery = '';

		var object={TN_Name:{ $regex: new RegExp("^" + Searchquery, "i") }};
		if (request.body.TN_Country_ID)
			object = {TN_Name:{ $regex: new RegExp("^" + Searchquery, "i") },TN_Country_ID:request.body.TN_Country_ID};
		TN.find(object)
		.populate({ path: 'form', select: 'Form_Name' })
		.populate({ path: 'route', select: 'Route_Name' })
		.populate({ path: 'strength', select: 'StrengthUnit_Name' })
		.populate({ path: 'weight', select: 'WeightUnit_Name' })
		.populate({ path: 'volume', select: 'VolumeUnit_Name' })
		.populate({ path: 'concentration', select: 'ConcentrationUnit_Name' })
		.populate({ path: 'country', select: 'Country_Name Country_Tcode' })
		.populate({ path: 'ai', select: 'AI_Name' })
		.sort({TN_Name:1})
		.exec(function(err, tn) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (tn) {
	        	
	            response.send(tn);
	        } 
    	})

	});

	app.post('/searchAIForTN', function(request, response) {
		var Searchquery = request.body.searchField;
		var object={TN_ActiveIngredients:{$in:[Searchquery]}};
		if (request.body.TN_Country_ID)
			object = {TN_ActiveIngredients:{$in:[Searchquery]},TN_Country_ID:request.body.TN_Country_ID};
		TN.find(object)
		.populate({ path: 'form', select: 'Form_Name' })
		.populate({ path: 'route', select: 'Route_Name' })
		.populate({ path: 'strength', select: 'StrengthUnit_Name' })
		.populate({ path: 'weight', select: 'WeightUnit_Name' })
		.populate({ path: 'volume', select: 'VolumeUnit_Name' })
		.populate({ path: 'concentration', select: 'ConcentrationUnit_Name' })
		.populate({ path: 'country', select: 'Country_Name Country_Tcode' })
		.populate({ path: 'ai', select: 'AI_Code AI_Name AI_ATC_Code' })
		.sort({TN_Name:1})
		.exec(function(err, tn) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (tn) {
	        	
	            response.send(tn);
	        } 
    	})
	});


	app.post('/getTN', function(request, response) {
		var object={};
		if (request.body.TN_Country_ID)
			object = {TN_Country_ID:request.body.TN_Country_ID};
		console.log(object)
		TN.find(object)
		.populate({ path: 'form', select: 'Form_Name' })
		.populate({ path: 'route', select: 'Route_Name' })
		.populate({ path: 'strength', select: 'StrengthUnit_Name' })
		.populate({ path: 'weight', select: 'WeightUnit_Name' })
		.populate({ path: 'volume', select: 'VolumeUnit_Name' })
		.populate({ path: 'concentration', select: 'ConcentrationUnit_Name' })
		.populate({ path: 'country', select: 'Country_Name Country_Tcode' })
		.populate({ path: 'ai', select: 'AI_Name' })
		// .select('TN_Name TN_Status TN_Strength_Value TN_Weight_Value TN_Volume_Value TN_Concentration_Value ')
		.sort({TN_Code:-1}).limit(20)
		.exec(function(err, tn) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (tn) {
	        	
	            response.send(tn);
	        } 
    	})
	});

	app.post('/getTNFilterByLetter', function(request, response) {
		var object={};
		if (request.body.TN_Country_ID)
			object = {TN_Country_ID:request.body.TN_Country_ID};
		object.TN_Name = {$regex: new RegExp("^" + request.body.letter.toLowerCase(), "i")}; //	request.query.letter
		console.log(object)
		TN.find(object)
		.populate({ path: 'form', select: 'Form_Name' })
		.populate({ path: 'route', select: 'Route_Name' })
		.populate({ path: 'strength', select: 'StrengthUnit_Name' })
		.populate({ path: 'weight', select: 'WeightUnit_Name' })
		.populate({ path: 'volume', select: 'VolumeUnit_Name' })
		.populate({ path: 'concentration', select: 'ConcentrationUnit_Name' })
		.populate({ path: 'country', select: 'Country_Name Country_Tcode' })
		.populate({ path: 'ai', select: 'AI_Name' })
		// .select('TN_Name TN_Status TN_Strength_Value TN_Weight_Value TN_Volume_Value TN_Concentration_Value ')
		.sort({TN_Name:1})
		.exec(function(err, tn) {
		    if (err){
				console.log(err)
		    	response.send({message: 'Error'});
		    }
	        if (tn) {
	        	
	            response.send(tn);
	        } 
    	})
	});


	// app.post('/getTNByCountry', function(request, response) {
	// 	var Searchquery = request.body.TN_Country_ID;

	// 	TN.find({TN_Country_ID:request.body.TN_Country_ID})
	// 	.populate({ path: 'form', select: 'Form_Name' })
	// 	.populate({ path: 'route', select: 'Route_Name' })
	// 	.populate({ path: 'strength', select: 'Route_Name' })
	// 	.populate({ path: 'weight', select: 'WeightUnit_Name' })
	// 	.populate({ path: 'volume', select: 'VolumeUnit_Name' })
	// 	.populate({ path: 'concentration', select: 'ConcentrationUnit_Name' })
	// 	.populate({ path: 'country', select: 'Country_Name' })
	// 	.populate({ path: 'ai', select: 'AI_Name' })
	// 	.exec(function(err, tn) {
	// 	    if (err){
	// 	    	response.send({message: 'Error'});
	// 	    }
	//         if (tn) {
	        	
	//             response.send(tn);
	//         } 
 //    	})
	// });
	
	app.get('/searchTNByID', function(request, response) {
		var Searchquery = request.query.row_id;
		TN.findOne({TN_Code: Number(Searchquery)})
		.populate({ path: 'form', select: 'Form_Name' })
		.populate({ path: 'route', select: 'Route_Name' })
		.populate({ path: 'strength', select: 'StrengthUnit_Name' })
		.populate({ path: 'weight', select: 'WeightUnit_Name' })
		.populate({ path: 'volume', select: 'VolumeUnit_Name' })
		.populate({ path: 'concentration', select: 'ConcentrationUnit_Name' })
		.populate({ path: 'country', select: 'Country_Name' })
		.populate({ path: 'ai', select: 'AI_Name AI_ATC_Code' })
		.exec(function(err, tn) {
			if (err){
				return response.send({
					message: err
				});
			}

			if (tn.length == 0) {
				return response.send({
					message: 'No TN Code Found !!'
				});
			} else {
				return response.send({
					tn: tn
				});
			}
		})
	}); 



	// new route :: 29/9/2018

	app.get('/getCountryBasedTNRevision', function(request, response) {

		CountryBasedTNRevision.find({CountryBasedTNRevision_Code:request.body.CountryBasedTNRevision_Code}, function(err, basedtn) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (basedtn) {
	        	
	            response.send(basedtn);
	        } 
    	})
    });


	app.post('/editCountryBasedTNRevision',function (request, response){

		var images 	  = [];
		var date 	  = new Date();
    	var year  	  = date.getFullYear();
    	var month     = date.getMonth()+1; 
    	
    	var dir = path.resolve('./public/images/'+year+'/'+month);
		if (!fs.existsSync(dir)){
    		shell.mkdir('-p', dir);
		}

		var files = request.files.image;
		for (var i = 0; i < files.length; i++) {
			var file_name   = files[i].originalFilename;
			var source_file =  tinify.fromFile(files[i].path);
			source_file.toFile(dir+'/'+Date.now() + '.' + file_name);
			images.push(dir+'/'+Date.now() + '.' + file_name);
		}

		var newvalues = { $set: {
				CountryBasedTNRevision_Price		: request.body.CountryBasedTNRevision_Price,
			    CountryBasedTNRevision_Images		: images,
			   
		} };

		var myquery = { CountryBasedTNRevision_Code: request.body.row_id }; 


		CountryBasedTNRevision.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'Country TN not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});

	app.post('/AddTaskCountryBasedTNRevisionToReviewer',function (request, response){

		async function AddNewTasks(){
			var resultTask  			= await updateTaskDone();
			var Reviewer_ID 			= await getEmployeeId();
			var resultBasedTNRevision 	= await updateBasedTNRevision(Reviewer_ID);
			var Task_ID   				= await getTasksId();
			insetIntoTasks(Reviewer_ID,Task_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					Task_Status 				: 1,
					Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { Task_Code: request.body.task_id }; 

				UniversalTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Task Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};


		function getEmployeeId(){
			return new Promise((resolve, reject) => {
				Employee_role.findOne({ $and: [ { Employee_Role_Role_Code:2 }, { Employee_Role_Type_Code: 2 }, { Employee_Role_Sub_Role_Type: 4 },{ Employee_Role_Country_Code:request.body.country_id },{ Employee_Role_Status:1 } ] }, function(err, emp_role) {
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (emp_role) {
			            resolve(emp_role.Employee_Role_Employee_Code);
			        } 
		    	});
			})
		}

		function updateBasedTNRevision(Reviewer_ID){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						CountryBasedTNRevision_EditStatus 						: 1,
						CountryBasedTNRevision_EditedBy_Employee_ID   			:request.body.user_id,
						CountryBasedTNRevision_EditDate_Close 					:new Date(),

						CountryBasedTNRevision_AssiendToReviewer_Employee_ID  	:Reviewer_ID,
						CountryBasedTNRevision_ReviewStatus						:0,
						CountryBasedTNRevision_ReviewDate_Start					:new Date(),
				} };

				var myquery = { CountryBasedTNRevision_Code: request.body.based_tn_revision_id }; 

				CountryBasedTNRevision.findOneAndUpdate( myquery,newvalues, function(err, field) {
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

		function getTasksId(){
			return new Promise((resolve, reject) => {
				UniversalTasks.getLastCode(function(err, AIMaTs){
					if (AIMaTs) 
						resolve( Number(AIMaTs.Task_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function insetIntoTasks(Reviewer_ID,Task_ID){

			var newTask =  UniversalTasks() ;
			newTask.Task_Code                       = Task_ID;
			newTask.Task_Title                      = request.body.name;
			newTask.Task_AssignTo_Employee_Code     = Reviewer_ID;
			newTask.Task_AssignDate                 = new Date();
			newTask.Task_ActionTypeName             = "Review";
			newTask.Task_ActionDetails_Code         = request.body.Task_ActionDetails_Code;
			newTask.Task_RelatedTo                  = "Country Non Clinical Data";
			newTask.Task_RelatedTo_Code             = request.body.Task_RelatedTo;
			newTask.Task_Status                     = 0;
			newTask.Task_ClosedDate                 = null;
			newTask.save();

			NotificationDetails = {
				Task_Code                       : Task_ID,
				Task_Title                      : request.body.name,
				Task_AssignTo_Employee_Code     : Reviewer_ID,
				Task_AssignDate                 : new Date(),
				Task_ActionTypeName             : "Review",
				Task_ActionDetails_Code         : request.body.Task_ActionDetails_Code,
				Task_RelatedTo                  : "Country Clinical Data",
				Task_RelatedTo_Code             : request.body.Task_RelatedTo,
				Task_Status                     :0,
				icon: 'fa fa-eye',
				iconColor: '#04ec65',
			}

			var UserInSockets = clients.find(o => o.UserID === Reviewer_ID);
			if(UserInSockets){
				var ClientSocketArray = clients.filter(function(obj) {
					if(obj.UserID === 1)
						return true
					else
						return false
				});
				ClientSocketArray.forEach(function (arrayItem) {
					var SocktesToSendNotification = arrayItem.Socket;
					io.sockets.connected[SocktesToSendNotification].emit("notification", NotificationDetails);
				});
				
			}

			return response.send({
				message: true
			});
		}


		AddNewTasks();
	});

	app.post('/AddTaskCountryBasedTNRevisionToPublisher',function (request, response){

		async function AddNewTasks(){
			var resultTask  			= await updateTaskDone();
			var Publisher_ID 			= await getEmployeeId();
			var resultBasedTNRevision 	= await updateBasedTNRevision(Publisher_ID);
			var Tasks_ID   	= await getTasksId();
			insetIntoTasks(Publisher_ID,Tasks_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					Task_Status 				: 1,
					Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { Task_Code: request.body.task_id }; 

				UniversalTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Task Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function getEmployeeId(){
			return new Promise((resolve, reject) => {
				Employee_role.findOne({ $and: [ { Employee_Role_Role_Code:4 }, { Employee_Role_Type_Code: 2 }, { Employee_Role_Sub_Role_Type: 4 },{ Employee_Role_Country_Code:request.body.country_id },{ Employee_Role_Status:1 } ] }, function(err, emp_role) {
				    if (err){
				    	resolve({message: 'Error'});
				    }
			        if (emp_role) {
			            resolve(emp_role.Employee_Role_Employee_Code);
			        } 
		    	});
			})
		}

		function updateBasedTNRevision(Publisher_ID){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						CountryBasedTNRevision_ReviewStatus 					: 1,
						CountryBasedTNRevision_ReviewedBy_Employee_ID   		:request.body.user_id,
						CountryBasedTNRevision_ReviewDate_Close 				:new Date(),

						CountryBasedTNRevision_AssiendToPublisher_Employee_ID  	:Publisher_ID,
						CountryBasedTNRevision_PublishStatus					:0,
						CountryBasedTNRevision_PublishDate_Start				:new Date(),
				} };

				var myquery = { CountryBasedTNRevision_Code: request.body.based_tn_revision_id }; 

				CountryBasedTNRevision.findOneAndUpdate( myquery,newvalues, function(err, field) {
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

		function getTasksId(){
			return new Promise((resolve, reject) => {
				UniversalTasks.getLastCode(function(err, TNMaTs){
					if (TNMaTs) 
						resolve( Number(TNMaTs.Task_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function insetIntoTasks(Publisher_ID,Tasks_ID){
			var newTask =  UniversalTasks() ;
			newTask.Task_Code                       = Tasks_ID;
			newTask.Task_Title                      = request.body.name;
			newTask.Task_AssignTo_Employee_Code     = Publisher_ID;
			newTask.Task_AssignDate                 = new Date();
			newTask.Task_ActionTypeName             = "Publish";
			newTask.Task_ActionDetails_Code         = request.body.Task_ActionDetails_Code;
			newTask.Task_RelatedTo                  = "Country Non Clinical Data";
			newTask.Task_RelatedTo_Code             = request.body.Task_RelatedTo_Code;
			newTask.Task_Status                     = 0;
			newTask.Task_ClosedDate                 = null;
			newTask.save();

			NotificationDetails = {
				Task_Code                       : Tasks_ID,
				Task_Title                      : request.body.name,
				Task_AssignTo_Employee_Code     : Publisher_ID,
				Task_AssignDate                 : new Date(),
				Task_ActionTypeName             : "Review",
				Task_ActionDetails_Code         : request.body.Task_ActionDetails_Code,
				Task_RelatedTo                  : "Country 	Non linical Data",
				Task_RelatedTo_Code             : request.body.Task_RelatedTo_Code,
				Task_Status                     :0,
				icon: 'fa fa-cloud-upload',
				iconColor: '#4ebcd4',
			}

			var UserInSockets = clients.find(o => o.UserID === Publisher_ID);
			if(UserInSockets){
				var ClientSocketArray = clients.filter(function(obj) {
					if(obj.UserID === 1)
						return true
					else
						return false
				});
				ClientSocketArray.forEach(function (arrayItem) {
					var SocktesToSendNotification = arrayItem.Socket;
					io.sockets.connected[SocktesToSendNotification].emit("notification", NotificationDetails);
				});
				
			}

			return response.send({
				message: true
			});
		}


		AddNewTasks();
	});

	app.post('/AddCountryBasedTNData',function (request, response){

		async function AddNewCountryBasedTNData(){
			var resultTask  					= await updateTaskDone();
			var resultCountryBasedTNRevision    = await updateCountryBasedTNRevision();
			var dataCountryBasedRevision   		= await getCountryBasedTNRevision(request.body.based_tn_revision_id);
			var UpdateCountryBasedTN         	= await UpdateCountryBasedTN(dataCountryBasedRevision);
			var CountryBasedTNHistoryID      	= await getCountryBasedTNHistoryID();
			var insertCountryBasedHistory  		= await insetCountryBasedHistory(dataCountryBasedRevision,CountryBasedTNHistoryID);
			var removeCountryBasedRevision 		= await removeOldCountryBasedRevision(request.body.based_tn_revision_id);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					Task_Status 				: 1,
					Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { Task_Code: request.body.task_id }; 

				UniversalTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
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

		function updateCountryBasedTNRevision(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						CountryBasedTNRevision_PublishStatus 			: 1,
						CountryBasedTNRevision_Publishedby_Employee_ID  :request.body.user_id,
						CountryBasedTNRevision_PublishDate_Close 		:new Date(),
						CountryBasedTNRevision_RevisionCode				:1,
				} };

				var myquery = { CountryBasedTNRevision_Code: request.body.based_tn_revision_id }; 

				CountryBasedTNRevision.findOneAndUpdate( myquery,newvalues, function(err, field) {
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

		function getCountryBasedTNRevision(revision_id){
			return new Promise((resolve, reject) => {
				CountryBasedTNRevision.findOne({CountryBasedTNRevision_Code:revision_id} ,function(err, Basedrevision) {
					if (err) 
						resolve( err);
					else
						resolve(Basedrevision);
				})
			})
		};

		function UpdateCountryBasedTN(data){

			var newvalues = { $set: {
	            
	            CountryBasedTN_Price					: data.CountryBasedTNRevision_Price,
	            CountryBasedTN_Images					: data.CountryBasedTNRevision_Images,
			} };

			var myquery = { CountryBasedTN_Code: data.CountryBasedTNRevision_CountryBasedTN_Code };


			CountryBasedTN.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'Country TN not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
			})
		}

		function getCountryBasedTNHistoryID(){
			return new Promise((resolve, reject) => {
				CountryBasedTNHistory.getLastCode(function(err, BasedTN){
					if (BasedTN) 
						resolve( Number(BasedTN.CountryBasedTNHistory_Code)+1);
					else
						resolve(1);
				})
			})
		};


		function insetCountryBasedHistory(data,CountryBasedTNHistoryID){
			var newCountryBasedTNHistory = new CountryBasedTNHistory();
			newCountryBasedTNHistory.CountryBasedTNHistory_Code     						= CountryBasedTNHistoryID;
		    newCountryBasedTNHistory.CountryBasedTNHistory_Storage   						= data.CountryBasedTNRevision_Storage;
		    newCountryBasedTNHistory.CountryBasedTNHistory_Stability  						= data.CountryBasedTNRevision_Stability;
		    newCountryBasedTNHistory.CountryBasedTNHistory_TN_Code 							= data.CountryBasedTNRevision_TN_Code;
		    newCountryBasedTNHistory.CountryBasedTNHistory_Country_ID						= data.CountryBasedTNRevision_Country_ID;
		    newCountryBasedTNHistory.CountryBasedTNHistory_CountryBasedTN_Code				= data.CountryBasedTNRevision_CountryBasedTN_Code;
		    
		    newCountryBasedTNHistory.CountryBasedTNHistory_AssiendToEditor_Employee_ID		= data.CountryBasedTNRevision_AssiendToEditor_Employee_ID;
		    newCountryBasedTNHistory.CountryBasedTNHistory_EditStatus						= data.CountryBasedTNRevision_EditStatus;
		    newCountryBasedTNHistory.CountryBasedTNHistory_EditDate_Start					= data.CountryBasedTNRevision_EditDate_Start;
		    newCountryBasedTNHistory.CountryBasedTNHistory_EditedBy_Employee_ID				= data.CountryBasedTNRevision_EditedBy_Employee_ID;
		    newCountryBasedTNHistory.CountryBasedTNHistory_EditDate_Close					= data.CountryBasedTNRevision_EditDate_Close;
		    
		    newCountryBasedTNHistory.CountryBasedTNHistory_AssiendToReviewer_Employee_ID	= data.CountryBasedTNRevision_AssiendToReviewer_Employee_ID;
		    newCountryBasedTNHistory.CountryBasedTNHistory_ReviewStatus						= data.CountryBasedTNRevision_ReviewStatus;
		    newCountryBasedTNHistory.CountryBasedTNHistory_ReviewDate_Start					= data.CountryBasedTNRevision_ReviewDate_Start;
		    newCountryBasedTNHistory.CountryBasedTNHistory_ReviewedBy_Employee_ID			= data.CountryBasedTNRevision_ReviewedBy_Employee_ID;
		    newCountryBasedTNHistory.CountryBasedTNHistory_ReviewDate_Close					= data.CountryBasedTNRevision_ReviewDate_Close;
		   
		    newCountryBasedTNHistory.CountryBasedTNHistory_AssiendToPublisher_Employee_ID	= data.CountryBasedTNRevision_AssiendToPublisher_Employee_ID;
		    newCountryBasedTNHistory.CountryBasedTNHistory_PublishStatus					= data.CountryBasedTNRevision_PublishStatus;
		    newCountryBasedTNHistory.CountryBasedTNHistory_PublishDate_Start				= data.CountryBasedTNRevision_PublishDate_Start;
		    newCountryBasedTNHistory.CountryBasedTNHistory_Publishedby_Employee_ID			= data.CountryBasedTNRevision_Publishedby_Employee_ID;
		    newCountryBasedTNHistory.CountryBasedTNHistory_PublishDate_Close				= data.CountryBasedTNRevision_PublishDate_Close;

    		newCountryBasedTNHistory.CountryBasedTNHistory_RevisionCode                     = data.CountryBasedTNRevision_RevisionCode;

		   	newCountryBasedTNHistory.save(function(error, doneadd){
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
				CountryBasedTNRevision.remove({CountryBasedTNRevision_Code:revision_id} ,function(err, basedrevision) {
					if (err) 
						resolve( err);
					else
						resolve(true);
				})
			})
		};

		AddNewCountryBasedTNData();
	})

	// new route ::26/8/2018

	app.post('/editCountryBasedAIRevision',function (request, response){

		var newvalues = { $set: {
			    CountryBasedAIRevision_UsaageLabeledIndications		: request.body.CountryBasedAIRevision_UsaageLabeledIndications,
			    CountryBasedAIRevision_UsaageOffLabeledIndications	: request.body.CountryBasedAIRevision_UsaageOffLabeledIndications,
			    CountryBasedAIRevision_Administration   			: request.body.CountryBasedAIRevision_Administration,
			    CountryBasedAIRevision_DietaryConsiderations  		: request.body.CountryBasedAIRevision_DietaryConsiderations,
			    CountryBasedAIRevision_PreparationForAdministration : request.body.CountryBasedAIRevision_PreparationForAdministration,
			    CountryBasedAIRevision_PregnancyConsideration		: request.body.CountryBasedAIRevision_PregnancyConsideration,
			    CountryBasedAIRevision_Storage						: request.body.CountryBasedAIRevision_Storage,
			    CountryBasedAIRevision_Stability					: request.body.CountryBasedAIRevision_Stability,
			} };

		var myquery = { CountryBasedAIRevision_Code: request.body.CountryBasedAIRevision_Code }; 


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
	app.post('/AddCountryBasedAIRevisionDosing',function (request, response){
		var myquery = { CountryBasedAIRevision_Code: request.body.CountryBasedAIRevision_Code }; 
		//console.log(request.body.CountryBasedAIRevision_Dosing)
		var newvalues = { $push: {
			CountryBasedAIRevision_Dosing		: request.body.CountryBasedAIRevision_Dosing
		} };
		
		CountryBasedAIRevision.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
				console.log(err);
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

		CountryBasedAIRevision.find({CountryBasedAIRevision_Code:request.query.CountryBasedAIRevision_Code})
		.populate({ path: 'CountryBasedAIRevisionCountry', select: 'Country_Name' })
		.populate({ path: 'CountryBasedAIRevisionDosingUsageAge', select: 'UsageAge_Name' })
		.populate({ path: 'CountryBasedAIRevisionDosingMedicalCondition'})
		.populate({ path: 'CountryBasedAIRevisionDosingUsageDoseType', select: 'UsageDoseType_Name' })
		.populate({ path: 'CountryBasedAIRevisionDosingUsageDoseUnit', select: 'UsageDoseUnit_Name' })
		.populate({ path: 'CountryBasedAIRevisionDosingUsageRoute', select: 'Route_Name' })
		.populate({ path: 'CountryBasedAIRevisionDosingUsageForm', select: 'Form_Name' })
		.populate({ path: 'CountryBasedAIRevisionDosingUsageFrequenIntervalUnit', select: 'UsageFrequenIntervalUnit_Name' })
		.exec(function(err, basedai) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (basedai) {
	            response.send(basedai);
	        } 
    	})
    });

	//editAIRevision
	
	app.post('/AddTaskCountryBasedAIRevisionToReviewer',function (request, response){

		async function AddNewTasks(){
			var resultTask  			= await updateTaskDone();
			var Reviewer_ID 			= await getEmployeeId();
			var resultBasedAIRevision 	= await updateBasedAIRevision(Reviewer_ID);
			var Task_ID   				= await getTasksId();
			insetIntoTasks(Reviewer_ID,Task_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					Task_Status 				: 1,
					Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { Task_Code: request.body.task_id }; 

				UniversalTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Task Not Exist");

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
		function getTasksId(){
			return new Promise((resolve, reject) => {
				UniversalTasks.getLastCode(function(err, AIMaTs){
					if (AIMaTs) 
						resolve( Number(AIMaTs.Task_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function insetIntoTasks(Reviewer_ID,Task_ID){

			var newTask =  UniversalTasks() ;
			newTask.Task_Code                       = Task_ID;
			newTask.Task_Title                      = request.body.name;
			newTask.Task_AssignTo_Employee_Code     = Reviewer_ID;
			newTask.Task_AssignDate                 = new Date();
			newTask.Task_ActionTypeName             = "Review";
			newTask.Task_ActionDetails_Code         = request.body.Task_ActionDetails_Code;
			newTask.Task_RelatedTo                  = "Country Clinical Data";
			newTask.Task_RelatedTo_Code             = request.body.Task_RelatedTo;
			newTask.Task_Status                     = 0;
			newTask.Task_ClosedDate                 = null;
			newTask.save();

			NotificationDetails = {
				Task_Code                       : Task_ID,
				Task_Title                      : request.body.name,
				Task_AssignTo_Employee_Code     : Reviewer_ID,
				Task_AssignDate                 : new Date(),
				Task_ActionTypeName             : "Review",
				Task_ActionDetails_Code         : request.body.Task_ActionDetails_Code,
				Task_RelatedTo                  : "Country Clinical Data",
				Task_RelatedTo_Code             : request.body.Task_RelatedTo,
				Task_Status                     :0,
				icon: 'fa fa-eye',
				iconColor: '#04ec65',
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


	app.post('/AddTaskCountryBasedAIRevisionToGrammer',function (request, response){

		async function AddNewTasks(){
			var resultTask  			= await updateTaskDone();
			var Grammer_ID 			= await getEmployeeId();
			var resultBasedAIRevision 	= await updateBasedAIRevision(Grammer_ID);
			var Tasks_ID   		= await getTasksId();
			insetIntoTasks(Grammer_ID,Tasks_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					Task_Status 				: 1,
					Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { Task_Code: request.body.task_id }; 

				UniversalTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
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

		function getTasksId(){
			return new Promise((resolve, reject) => {
				UniversalTasks.getLastCode(function(err, AIMaTs){
					if (AIMaTs) 
						resolve( Number(AIMaTs.Task_Code)+1);
					else
						resolve(1);
				})
			})
		};
			

		function insetIntoTasks(Grammer_ID,Tasks_ID){

			var newTask =  UniversalTasks() ;
			newTask.Task_Code                       = Tasks_ID;
			newTask.Task_Title                      = request.body.name;
			newTask.Task_AssignTo_Employee_Code     = Grammer_ID;
			newTask.Task_AssignDate                 = new Date();
			newTask.Task_ActionTypeName             = "Grammer";
			newTask.Task_ActionDetails_Code         = request.body.Task_ActionDetails_Code;
			newTask.Task_RelatedTo                  = "Country Clinical Data";
			newTask.Task_RelatedTo_Code             = request.body.Task_RelatedTo_Code;
			newTask.Task_Status                     = 0;
			newTask.Task_ClosedDate                 = null;
			newTask.save();

			NotificationDetails = {
				Task_Code                       : Tasks_ID,
				Task_Title                      : request.body.name,
				Task_AssignTo_Employee_Code     : Grammer_ID,
				Task_AssignDate                 : new Date(),
				Task_ActionTypeName             : "Grammer",
				Task_ActionDetails_Code         : request.body.Task_ActionDetails_Code,
				Task_RelatedTo                  : "Country Clinical Data",
				Task_RelatedTo_Code             : request.body.Task_RelatedTo_Code,
				Task_Status                     :0,
				icon: 'fa fa-eye',
				iconColor: '#04ec65',
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

	app.post('/AddTaskCountryBasedAIRevisionToPublisher',function (request, response){

		async function AddNewTasks(){
			var resultTask  			= await updateTaskDone();
			var Publisher_ID 			= await getEmployeeId();
			var resultBasedAIRevision 	= await updateBasedAIRevision(Publisher_ID);
			var Tasks_ID   	= await getTasksId();
			insetIntoTasks(Publisher_ID,Tasks_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					Task_Status 				: 1,
					Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { Task_Code: request.body.task_id }; 

				UniversalTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Task Not Exist");

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

		function getTasksId(){
			return new Promise((resolve, reject) => {
				UniversalTasks.getLastCode(function(err, AIMaTs){
					if (AIMaTs) 
						resolve( Number(AIMaTs.Task_Code)+1);
					else
						resolve(1);
				})
			})
		};

		function insetIntoTasks(Publisher_ID,Tasks_ID){
			var newTask =  UniversalTasks() ;
			newTask.Task_Code                       = Tasks_ID;
			newTask.Task_Title                      = request.body.name;
			newTask.Task_AssignTo_Employee_Code     = Publisher_ID;
			newTask.Task_AssignDate                 = new Date();
			newTask.Task_ActionTypeName             = "Publish";
			newTask.Task_ActionDetails_Code         = request.body.Task_ActionDetails_Code;
			newTask.Task_RelatedTo                  = "Country Clinical Data";
			newTask.Task_RelatedTo_Code             = request.body.Task_RelatedTo_Code;
			newTask.Task_Status                     = 0;
			newTask.Task_ClosedDate                 = null;
			newTask.save();

			NotificationDetails = {
				Task_Code                       : Tasks_ID,
				Task_Title                      : request.body.name,
				Task_AssignTo_Employee_Code     : Publisher_ID,
				Task_AssignDate                 : new Date(),
				Task_ActionTypeName             : "Review",
				Task_ActionDetails_Code         : request.body.Task_ActionDetails_Code,
				Task_RelatedTo                  : "Country Clinical Data",
				Task_RelatedTo_Code             : request.body.Task_RelatedTo_Code,
				Task_Status                     :0,
				icon: 'fa fa-cloud-upload',
				iconColor: '#4ebcd4',
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

	app.post('/AddCountryBasedAIData',function (request, response){

		async function AddNewCountryBasedAIData(){
			var resultTask  					= await updateTaskDone();
			var resultCountryBasedAIRevision    = await updateCountryBasedAIRevision();
			var dataCountryBasedRevision   		= await getCountryBasedAIRevision(request.body.based_ai_revision_id);
			var UpdateCountryBasedAI         	= await UpdateCountryBasedAI(dataCountryBasedRevision);
			var CountryBasedAIHistoryID      	= await getCountryBasedAIHistoryID();
			var insertCountryBasedHistory  		= await insetCountryBasedHistory(dataCountryBasedRevision,CountryBasedAIHistoryID);
			var removeCountryBasedRevision 		= await removeOldCountryBasedRevision(request.body.based_ai_revision_id);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					Task_Status 				: 1,
					Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { Task_Code: request.body.task_id }; 

				UniversalTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
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

		function getCountryBasedAIRevision(revision_id){
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
				AI_NDC_Code 									: request.body.AI_NDC_Code, 
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

    	async function EditAIRevision(){
			var insertDataAIRevision = await InsertDataAIRevision();
			UpdateAI();
        }

		function InsertDataAIRevision(){

			var newvalues = { $set: {
				AIMasterRevision_Pharmaceutical_Categories_ID 	: request.body.AIMasterRevision_Pharmaceutical_Categories_ID,
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
		}

		function UpdateAI(){
			var newvalues = { $set: {
				AI_Pharmaceutical_Categories_ID 	: request.body.AIMasterRevision_Pharmaceutical_Categories_ID,
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

		EditAIRevision();
		
	});


    app.post('/searchAIName', function(request, response) {
		var Searchquery = request.body.searchField;
		AI.find ({AI_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.select('AI_Code AI_Name AI_ATC_Code AI_Status AI_Pharmaceutical_Categories_ID')
		.populate({ path: 'pharamaceutical', select: 'Pharmaceutical_Category_Name Pharmaceutical_Category_ATC_Code' })
		.sort({AI_Name:1})
		.exec(function(err, ai) {
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
		})
	});

	app.post('/searchAIPharmaceuticalName', function(request, response) {
		var Searchquery = request.body.searchField;
		Pharmaceutical_category.find({Pharmaceutical_Category_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.select('Pharmaceutical_Category_Code')
		.exec(function(err, Pharmaceutical) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (Pharmaceutical) {
	            getAIData(Pharmaceutical);
	        } 
    	});

		function getAIData(Pharmaceutical){
			var ParmacuticalIDs =[];
			Pharmaceutical.forEach(function(obj){ ParmacuticalIDs.push(obj.Pharmaceutical_Category_Code)});
			AI.find ({AI_Pharmaceutical_Categories_ID:{ $in: ParmacuticalIDs}})
			.select('AI_Code AI_Name AI_ATC_Code AI_Status AI_Pharmaceutical_Categories_ID')
			.populate({ path: 'pharamaceutical', 
						select: 'Pharmaceutical_Category_Name Pharmaceutical_Category_ATC_Code'})
			.sort({AI_Name:1})
			.exec(function(err, ai) {
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
					console.log(ai)
					return response.send({
						user : request.user ,
						ai: ai
					});
				}
			})
		}
		
		console.log(Searchquery)
		
	});

    app.post('/searchAIATCCode', function(request, response) {
		var Searchquery = request.body.searchField;
		AI.find ({AI_ATC_Code:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.select('AI_Code AI_Name AI_ATC_Code AI_Status AI_Pharmaceutical_Categories_ID')
		.populate({ path: 'pharamaceutical', select: 'Pharmaceutical_Category_Name Pharmaceutical_Category_ATC_Code' })
		.sort({AI_Name:1})
		.exec(function(err, ai) {
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
			Pharmaceutical_category.find({Pharmaceutical_Category_ATC_Code:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
			.sort({Pharmaceutical_Category_ATC_Code:1})
        	.exec(function(err, PharmaCats) {
				if (err){
    	    		return response.send({
						user : request.user ,
						message: err
					});
    	    	}

    	    	if (PharmaCats.length == 0) {
					return response.send({
						user : request.user ,
						message: 'No ATC Code Found !!'
					});
            	} else {
					return response.send({
						user : request.user ,
						PharmaCats: PharmaCats
					});
				}
			})
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
					if (usage){
					console.log(usage);
						resolve( Number(usage.UsageDoseUnit_Code)+1);}
					else
					resolve(1);
				})
			})
		}

		function insetIntoUsageDoseUnit(UsageNextCode){
			console.log(UsageNextCode);
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
			var Tasks_ID   			= await getTasksId();
			insetIntoTasks(Reviewer_ID,Tasks_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					Task_Status 				: 1,
					Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { Task_Code: request.body.task_id }; 

				UniversalTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Task Not Exist");

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

		function getTasksId(){
			return new Promise((resolve, reject) => {
				UniversalTasks.getLastCode(function(err, AIMaTs){
					if (AIMaTs) 
						resolve( Number(AIMaTs.Task_Code)+1);
					else
						resolve(1);
				})
			})
		};
			

		function insetIntoTasks(Reviewer_ID,Tasks_ID){

			var newTask =  UniversalTasks() ;
			newTask.Task_Code                       = Tasks_ID;
			newTask.Task_Title                      = request.body.name;
			newTask.Task_AssignTo_Employee_Code     = Reviewer_ID;
			newTask.Task_AssignDate                 = new Date();
			newTask.Task_ActionTypeName             = "Review";
			newTask.Task_ActionDetails_Code         = request.body.ai_revision_id;
			newTask.Task_RelatedTo                  = "Master AI";
			newTask.Task_RelatedTo_Code             = request.body.ai_id;
			newTask.Task_Status                     = 0;
			newTask.Task_ClosedDate                 = null;
			newTask.save();

			NotificationDetails = {
				Task_Code                       : Tasks_ID,
				Task_Title                      : request.body.name,
				Task_AssignTo_Employee_Code     : Reviewer_ID,
				Task_AssignDate                 : new Date(),
				Task_ActionTypeName             : "Review",
				Task_ActionDetails_Code         : request.body.ai_revision_id,
				Task_RelatedTo                  : "Master AI",
				Task_RelatedTo_Code             : request.body.ai_id,
				Task_Status                     : 0,
				icon: 'fa fa-eye',
				iconColor: '#04ec65',
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
			var Tasks_ID    	  = await getTasksId();
			insetIntoTasks(Grammer_ID,Tasks_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					Task_Status 				: 1,
					Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { Task_Code: request.body.task_id }; 

				UniversalTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Task Not Exist");

		            } else {

						resolve(true);
					}
				})
			})
		};

		function getTasksId(){
			return new Promise((resolve, reject) => {
			UniversalTasks.getLastCode(function(err, AIMaTs){
				if (AIMaTs) 
					resolve( Number(AIMaTs.Task_Code)+1);
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


		function insetIntoTasks(Grammer_ID,Tasks_ID){

			var newTask =  UniversalTasks() ;
			newTask.Task_Code                       = Tasks_ID;
			newTask.Task_Title                      = request.body.name;
			newTask.Task_AssignTo_Employee_Code     = Grammer_ID;
			newTask.Task_AssignDate                 = new Date();
			newTask.Task_ActionTypeName             = "Grammer Review";
			newTask.Task_ActionDetails_Code         = request.body.ai_revision_id;
			newTask.Task_RelatedTo                  = "Master AI";
			newTask.Task_RelatedTo_Code             = request.body.ai_id;
			newTask.Task_Status                     = 0;
			newTask.Task_ClosedDate                 = null;
			newTask.save();

			NotificationDetails = {
				Task_Code                       : Tasks_ID,
				Task_Title                      : request.body.name,
				Task_AssignTo_Employee_Code     : Grammer_ID,
				Task_AssignDate                 : new Date(),
				Task_ActionTypeName             : "Grammer Review",
				Task_ActionDetails_Code         : request.body.ai_revision_id,
				Task_RelatedTo                  : "Master TN",
				Task_RelatedTo_Code             : request.body.ai_id,
				Task_Status                     : 0,
				icon: 'fa fa-eye',
				iconColor: '#04ec65',
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

			var Tasks_ID    = await getTasksId();
			insetIntoTasks(Publisher_ID,Tasks_ID);
		}

		function updateTaskDone(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
					Task_Status 				: 1,
					Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { Task_Code: request.body.task_id }; 

				UniversalTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Task Not Exist");

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

		function getTasksId(){
			return new Promise((resolve, reject) => {
			UniversalTasks.getLastCode(function(err, AIMaTs){
				if (AIMaTs) 
					resolve( Number(AIMaTs.Task_Code)+1);
				else
					resolve(1);
				})
			})
		};


		function insetIntoTasks(Publisher_ID,Tasks_ID){
		
			var newTask =  UniversalTasks() ;
			newTask.Task_Code                       = Tasks_ID;
			newTask.Task_Title                      = request.body.name;
			newTask.Task_AssignTo_Employee_Code     = Publisher_ID;
			newTask.Task_AssignDate                 = new Date();
			newTask.Task_ActionTypeName             = "Publish";
			newTask.Task_ActionDetails_Code         = request.body.ai_revision_id;
			newTask.Task_RelatedTo                  = "Master AI";
			newTask.Task_RelatedTo_Code             = request.body.ai_id;
			newTask.Task_Status                     = 0;
			newTask.Task_ClosedDate                 = null;
			newTask.save();

			NotificationDetails = {
				Task_Code                       : Tasks_ID,
				Task_Title                      : request.body.name,
				Task_AssignTo_Employee_Code     : Publisher_ID,
				Task_AssignDate                 : new Date(),
				Task_ActionTypeName             : "Publish",
				Task_ActionDetails_Code         : request.body.ai_revision_id,
				Task_RelatedTo                  : "Master AI",
				Task_RelatedTo_Code             : request.body.ai_id,
				Task_Status                     :0,
				icon: 'fa fa-cloud-upload',
				iconColor: '#4ebcd4',
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

	app.post('/getTaskByAICode', function(request, response) {
		UniversalTasks.findOne({ $and:[ {Task_RelatedTo_Code: request.body.ai_id},
		{'Task_Status':0} ]}).populate({ path: 'Employee', select: 'Employee_Name Employee_Email' }).exec(function(err, tasks) {
		    if (err){
				console.log(err)
		    	response.send({message: 'Error'});
		    }
	        if (tasks) {
				response.send(tasks);
	            
	        } 
    	})
    });


	app.post('/addAIRevisionToEdit',function (request, response){
		
		async function getLastAIID(){
			var AIVersionCode    = await getAIVersionCode();
			var Tasks_ID   = await getTasksId();
			var AIRevision_ID    = await getAIRevisionId();
			insetIntoAIRevision(Tasks_ID,AIRevision_ID,AIVersionCode);
		}

		function getAIVersionCode(){
			return new Promise((resolve, reject) => {
				AI.findOne({AI_Code: Number(request.body.AI_Code)},function(err, ai){
					if (ai) 
						resolve( Number(ai.AI_VersionCode)+1);
					else
						resolve(1);
				})
			})
		}

		function getTasksId(){
			return new Promise((resolve, reject) => {
				UniversalTasks.getLastCode(function(err, AIMaTs){
					if (AIMaTs) 
						resolve( Number(AIMaTs.Task_Code)+1);
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


		function insetIntoAIRevision(Tasks_ID,AIRevision_ID,AIVersionCode){
		
			var newAiReVision = AIRevisions();

			newAiReVision.AIMasterRevision_Code  		 			   		= AIRevision_ID;
			newAiReVision.AIMasterRevision_Name								= request.body.AI_Name;
			newAiReVision.AIMasterRevision_Pharmaceutical_Categories_ID 	= request.body.AI_Pharmaceutical_Categories_ID;
			newAiReVision.AIMasterRevision_FDAFeed			 				= request.body.AI_FDAFeed
			newAiReVision.AIMasterRevision_EUFeed			 				= request.body.AI_EUFeed
			newAiReVision.AIMasterRevision_ClinicalPracticeGuidelines	 	= request.body.AI_ClinicalPracticeGuidelines;
			newAiReVision.AIMasterRevision_Contraindications   				= request.body.AI_Contraindications;
			newAiReVision.AIMasterRevision_Warnings_Precautions  			= request.body.AI_Warnings_Precautions;
			newAiReVision.AIMasterRevision_AdverseReactionsConcerns 		= request.body.AI_AdverseReactionsConcerns;
			newAiReVision.AIMasterRevision_DiseaseRelatedConcerns			= request.body.AI_DiseaseRelatedConcerns;
			newAiReVision.AIMasterRevision_DoseFormSpecificIssues			= request.body.AI_DoseFormSpecificIssues;
			newAiReVision.AIMasterRevision_Others							= request.body.AI_Others;
			newAiReVision.AIMasterRevision_GeriatricConsideration			= request.body.AI_GeriatricConsideration;
			newAiReVision.AIMasterRevision_PregnancyConsideration			= request.body.AI_PregnancyConsideration;
			newAiReVision.AIMasterRevision_AI_ID 		 			   		= request.body.AI_Code;
			newAiReVision.AIMasterRevision_AssiendToEditor_Employee_ID 		= request.body.Employee_ID;
			newAiReVision.AIMasterRevision_EditStatus 				   		= 0;
			newAiReVision.AIMasterRevision_EditDate_Start			   		= new Date();
			newAiReVision.AIMasterRevision_VersionCode			   	   		= AIVersionCode;


			newAiReVision.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}else{
					var newTask =  UniversalTasks() ;
					newTask.Task_Code                       = Tasks_ID;
					newTask.Task_Title                      = request.body.AI_Name;
					newTask.Task_AssignTo_Employee_Code     = request.body.Employee_ID;
					newTask.Task_AssignDate                 = new Date();
					newTask.Task_ActionTypeName             = "Edit";
					newTask.Task_ActionDetails_Code         = AIRevision_ID;
					newTask.Task_RelatedTo                  = "Master AI";
					newTask.Task_RelatedTo_Code             = request.body.AI_Code;
					newTask.Task_Status                     = 0;
					newTask.Task_ClosedDate                 = null;
					newTask.save();

					NotificationDetails = {
						Task_Code						: Tasks_ID,
						Task_Title                      : request.body.AI_Name,
						Task_AssignTo_Employee_Code     : request.body.Employee_ID,
						Task_AssignDate                 : new Date(),
						Task_ActionTypeName             : "Edit",
						Task_ActionDetails_Code         : AIRevision_ID,
						Task_RelatedTo                  : "Master AI",
						Task_RelatedTo_Code             : request.body.AI_Code,
						Task_Status                     :0,
						icon: 'fa fa-edit',
						iconColor: '#ef9a29',
					}
					var UserInSockets = clients.find(o => o.UserID === request.body.Employee_ID);
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
						message: true,
						TaskID : Tasks_ID,
						RevisionID : AIRevision_ID
					});
				
				}
			})
		}

		getLastAIID();
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
					Task_Status 				: 1,
					Task_ClosedDate 			: new Date(), 
				} };

				var myquery = { Task_Code: request.body.task_id }; 

				UniversalTasks.findOneAndUpdate( myquery,newvalues, function(err, field) {
					if (err){
						resolve("Error");
    	    		}
            		if (!field) {

						resolve("Task Not Exist");

		            } else {
						var UserInSockets = clients.find(o => o.UserID === request.body.user_id);
						if(UserInSockets){
							var ClientSocketArray = clients.filter(function(obj) {
								if(obj.UserID === request.body.user_id)
									return true
								else
									return false
							});
							ClientSocketArray.forEach(function (arrayItem) {
								var SocktesToSendNotification = arrayItem.Socket;
								io.sockets.connected[SocktesToSendNotification].emit("taskfinished", {taskisdone: true});
							});
						}
						resolve(true);
					}
				});


			})
		};

		function updateAIRevision(){
			return new Promise((resolve, reject) => {

				var newvalues = { $set: {
						AIMasterRevision_PublishStatus 				: 1,
						AIMasterRevision_Publishedby_Employee_ID   	:request.body.user_id,
						AIMasterRevision_PublishDate_Close 			:new Date(),
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
				AI_Status 						: 1,
				AI_VersionCode 				    : data.AIMasterRevision_VersionCode,
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
			newAIHistory.AIHistory_NDC_Code    						= data.AIMasterRevision_NDC_Code;
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

    		newAIHistory.AIHistory_VersionCode                      = data.AIMasterRevision_VersionCode;




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

		MedicalCondition.find({MedicalCondition_ICD9:{$regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }},function(err, medical_condation) {
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
		
		MedicalCondition.find({MedicalCondition_ICD10:{$regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }},function(err, medical_condation) {
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
		
		MedicalCondition.find({MedicalCondition_ICD10am:{$regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }},function(err, medical_condation) {
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
		
		MedicalCondition.find({MedicalCondition_ICD11:{$regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }},function(err, medical_condation) {
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

	app.get('/getPermisionUserType', function(request, response) {
			System_setting.findOne({System_Setting_ConfigName:"CP_Users_Permissions"}, function(err, permision) {
			    if (err){
			    	response.send({message: 'Error'});
			    }
		        if (permision) {
					
						response.send(permision.System_Setting_ConfigValue);
				} 


    		});
	});
	
	app.get('/getEmployeesWithPermissions', function(request, response) {
		Employee.find({}).select('Employee_Code Employee_Name').populate({ path: 'User', select: 'User_Permissions' }).exec( function(err, employee) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (employee) {
	        	
	            response.send(employee);
	        } 
    	});
	});
	
	app.post('/editPermisionUser',function (request, response){

		var newvalues = { $set: {
			User_Permissions 				: request.body.User_Permissions,
		} };

		var myquery = { User_Code: request.body.user_id }; 


		User.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'User not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	});

	app.post('/SearchForm',function (request, response){
		var Searchquery = request.body.search_field;
		Forms.find({Form_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.sort({Form_Name:1})
		.exec(function(err, form) {
			 if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!form) {
            	return response.send({
					message: 'Form not exists'
				});
            } else {

                return response.send({
					form: form
				});
			}

		})
	})

	app.post('/SearchRoute',function (request, response){
		var Searchquery = request.body.search_field;
		Routes.find({Route_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.sort({Route_Name:1})
		.exec(function(err, route) {
			 if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!route) {
            	return response.send({
					message: 'Route not exists'
				});
            } else {

                return response.send({
					route: route
				});
			}

		})
	})

	app.post('/SearchStrengthUnit',function (request, response){
		var Searchquery = request.body.search_field;
		StrengthUnits.find({StrengthUnit_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.exec(function(err, strengthunits) {
			 if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!strengthunits) {
            	return response.send({
					message: 'Strength Units not exists'
				});
            } else {

                return response.send({
					strengthunits: strengthunits
				});
			}

		})
	})

	app.post('/SearchConcentration',function (request, response){
		var Searchquery = request.body.search_field;
		Concentration.find({ConcentrationUnit_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.sort({ConcentrationUnit_Name:1})
		.exec(function(err, concentration) {
			 if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!concentration) {
            	return response.send({
					message: 'Concentration not exists'
				});
            } else {

                return response.send({
					concentration: concentration
				});
			}

		})
	})


	app.post('/SearchWeightUnits',function (request, response){
		var Searchquery = request.body.search_field;
		WeightUnits.find({WeightUnit_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.sort({WeightUnit_Name:1})
		.exec(function(err, weightunits) {
			 if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!weightunits) {
            	return response.send({
					message: 'Weight Units not exists'
				});
            } else {

                return response.send({
					weightunits: weightunits
				});
			}

		})
	})

	app.post('/SearchVolumeUnits',function (request, response){
		var Searchquery = request.body.search_field;
		VolumeUnits.find({VolumeUnit_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.sort({VolumeUnit_Name:1})
		.exec(function(err, volumeunits) {
			 if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!volumeunits) {
            	return response.send({
					message: 'Volume Units not exists'
				});
            } else {

                return response.send({
					volumeunits: volumeunits
				});
			}

		})
	})

	app.post('/SearchSizeUnits',function (request, response){
		var Searchquery = request.body.search_field;
		SizeUnits.find({SizeUnit_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.sort({SizeUnit_Name:1})
		.exec(function(err, sizeunits) {
			 if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!sizeunits) {
            	return response.send({
					message: 'Size Units not exists'
				});
            } else {

                return response.send({
					sizeunits: sizeunits
				});
			}

		})
	})

	app.post('/SearchUsageAge',function (request, response){
		var Searchquery = request.body.search_field;
		UsageAge.find({UsageAge_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.exec(function(err, usageage) {
			 if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!usageage) {
            	return response.send({
					message: 'Usage Age not exists'
				});
            } else {

                return response.send({
					usageage: usageage
				});
			}

		})
	})

	app.post('/SearchUsageDoseType',function (request, response){
		var Searchquery = request.body.search_field;
		UsageDoseType.find({UsageDoseType_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.exec(function(err, usagedoseType) {
			 if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!usagedoseType) {
            	return response.send({
					message: 'Dose Type not exists'
				});
            } else {

                return response.send({
					usagedoseType: usagedoseType
				});
			}

		})
	})

	app.post('/SearchUsageDoseUnit',function (request, response){
		var Searchquery = request.body.search_field;
		UsageDoseUnit.find({UsageDoseUnit_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.exec(function(err, usagedoseunit) {
			 if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!usagedoseunit) {
            	return response.send({
					message: 'Dose Unit not exists'
				});
            } else {

                return response.send({
					usagedoseunit: usagedoseunit
				});
			}

		})
	})

	app.post('/SearchUsageDoseDuration',function (request, response){
		var Searchquery = request.body.search_field;
		UsageDoseDuration.find({UsageDoseDurationUnit_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.exec(function(err, usagedoseduration) {
			 if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!usagedoseduration) {
            	return response.send({
					message: 'Dose Duration not exists'
				});
            } else {

                return response.send({
					usagedoseduration: usagedoseduration
				});
			}

		})
	})

	app.post('/SearchUsageFrequencyInterval',function (request, response){
		var Searchquery = request.body.search_field;
		UsageFrequenInterval.find({UsageFrequenIntervalUnit_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.exec(function(err, usagefrequencyinterval) {
			 if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!usagefrequencyinterval) {
            	return response.send({
					message: 'Frequen Interval not exists'
				});
            } else {

                return response.send({
					usagefrequencyinterval: usagefrequencyinterval
				});
			}

		})
	})

	app.post('/SearchPharmaceuticalAtcName', function(request, response) {
		var Searchquery = request.body.searchField;
		Pharmaceutical_category.find({Pharmaceutical_Category_Name:{ $regex: new RegExp("^" + Searchquery.toLowerCase(), "i") }})
		.sort({Pharmaceutical_Category_Name:1})
        .exec(function(err, PharmaCats) {
			if (err){
	    		return response.send({
					message: err
				});
	    	}else if (PharmaCats.length == 0) {
				return response.send({
					message: 'ATC Name Not Found !!'
				});
        	} else {
				return response.send({
					PharmaCats: PharmaCats
				});
			}
		})
	});



};
function auth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

