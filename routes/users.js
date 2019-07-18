const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');

//Load idea model and UserModel
require('../models/Idea');
require('../models/User');
const Idea = mongoose.model('ideas');
const User = mongoose.model('users');
/*
User login and register route 
*/

router.get('/login', (req, res)=>{
    res.render('users/login');
});
router.post('/login', (req, res, next) => {
  
    // passport.authenticate('local', {
    //     successRedirect: '/ideas',
    //     failureRedirect: '/users/login',
    //     failureFlash: true
    // })(req, res, next);
});
router.get('/register', (req, res)=>{
    res.render('users/register');
});
router.post('/register', (req, res)=>{
    let errors = [];

    if(req.body.password !== req.body.password2){
    errors.push({text: 'password do not match'});
    }

    if(req.body.password.length < 4){
        errors.push({text: 'password must be atleast 4 charecter'});
    }

    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password:req.body.password,
            password2:  req.body.password2
        });
    }else{
       User.findOne({email: req.body.email})
       .then(user =>{
           if(user){
               console.log("present");
               req.flash('error_msg','User alredy registered');
               res.redirect('/users/login');
           }else{
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password:req.body.password
            });
    
            bcrypt.genSalt(10, (err, salt) =>{
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if(err) throw err;
                  newUser.password = hash;
                  newUser.save()
                  .then(user => {
                      req.flash('success_msg', 'You are now registerd and can log in');
                      res.redirect('/users/login');
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
    
});
router.get('/google/login', (req, res, next) => {
    passport.authenticate('google', {
            scope: [ 'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'],
            successRedirect: '/ideas',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);

})
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});
router.get('/google/callback',passport.authenticate('google'),(req, res) => {
     res.redirect('/');
})
module.exports = router;