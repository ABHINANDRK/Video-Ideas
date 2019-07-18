const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load user model
const User = mongoose.model('users');

// module.exports = function(passport){
//     passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
//         User.findOne({
//             email: email
//         })
//         .then(user => {
//             if(!user){
//                 return done(null, false, {message: 'No User Found'});
//             }

//             //Match passport
//            bcrypt.compare(password, user.password, (err, isMatch) => {
//                if(err) throw err;
//                if(isMatch){
//                    return done(null, user);
//                }else{
//                    return done(null, false, {message: 'Password Incorrect'});
//                }
//            })
//         })
//     }));

//     passport.serializeUser(function(user, done) {
//         done(null, user.id);
//       });
      
//       passport.deserializeUser(function(id, done) {
//         User.findById(id, function(err, user) {
//           done(err, user);
//         });
//       });
// }

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: '717354661808-ne77bgee48d77limesi8d822nmeibmd4.apps.googleusercontent.com',
        clientSecret: 'M6pX_mLQOnuf0CaXT814Oomn',
        callbackURL: '/users/google/callback'
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({
                        email: profile.emails[0].value
                    })
                    .then(user => {
                        if(user){
                            done(null, user);
                        }else{
                            const newUser = new User({
                                name: profile.displayName,
                                email: profile.emails[0].value,
                                password: profile.id
                            });
                    
                            bcrypt.genSalt(10, (err, salt) =>{
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                  if(err) throw err;
                                  newUser.password = hash;
                                  newUser.save()
                                  .then(user => {
                                    //   req.flash('success_msg', 'You are now registerd and can log in');
                                    //   res.redirect('/users/login');
                                    done(null,user);
                                    console.log("new user is created");
                                  })
                                  .catch(err => {
                                      console.log(err);
                                      return;
                                  })
                                })
                                
                            });

                        }
                     
                    })
      }
    ));  


         passport.serializeUser(function(user, done) {
                done(null, user.id);
              });
              
              passport.deserializeUser(function(id, done) {
                User.findById(id, function(err, user) {
                  done(err, user);
                });
              });
}