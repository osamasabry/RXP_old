// local authentication
// For more details go to https://github.com/jaredhanson/passport-local
var LocalStrategy    = require('passport-local').Strategy;

var User       = require('../app/models/user');

module.exports = function(passport,res) {

    // Maintaining persistent login sessions
    // serialized  authenticated user to the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialized when subsequent requests are made
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

     passport.use('login', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true 
    },
     function(req, email, password, done) {
       process.nextTick(function() {
            User.findOne({ 'User_Name' :  email }, function(err, user,info) {
                if (err){ return done(err);}
                if (!user)
                  return done(null,false,{status:false,message:'user is not exist'});
                if (!user.verifyPassword(password))
                    return done(null,false,{status:false,message:'Enter correct password'});
               else
                    return done(null, user);
            });
        });

    }));


     passport.use('signup', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        process.nextTick(function() {
        
            if (!req.user) {
                console.log(email);
                User.findOne({ 'email' :  email }, function(err, user) {
            	    if (err){ return res.status(500).send();}
                    if (user) {
                        return done(null, false, req.flash('signuperror', 'User already exists'));
                    } else {
                        var newUser            = new User();
			            newUser.username    = req.body.username;
                        newUser.email    = email;
                        newUser.password = newUser.generateHash(password);
            			newUser.name	= '' ; 
            			newUser.address	= '';
                  newUser.role = 'admin';   
                        console.log(newUser);

                        newUser.save(); 
                            // if (err)
                            //     throw err;
                            // console.log(newUser);

                            // return res.status(200).send();
                            return done(null, newUser);
                        }
                        });
                    }

  //               });
  //           } else {
  // console.log(password);

  //                       return res.status(200).send();
  // console.log(req.user);

  //               var user            = req.user;
		// user.user.username    = req.body.username;
  //               user.user.email    = email;
  //               user.user.password = user.generateHash(password);
		// 	user.user.name	= ''
		// 	user.user.address	= ''
  // console.log(user);
  //       // console.log(err);
  //               user.save(function(err) {
  //                   if (err)
  //                       throw err;
  //                   return done(null, user);
  //               });

  //           }

        });


    }));



};
