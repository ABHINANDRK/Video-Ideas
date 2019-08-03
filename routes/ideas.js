const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

//Load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        }else{
            res.render('ideas/edit',{
                idea: idea
            });
        }
    })
    
})

router.get('/', ensureAuthenticated, (req, res) => {
console.log('req.user:'+req.user);
    Idea.find({user: req.user.id})
    .sort({date : 'desc'})
    .then(ideas => {
        res.render('ideas/list', {
          ideas: ideas
        });
    })
    .catch(err => {
        console.log("Error when fetching ideas fron mongoDB");
    });
});

router.post('/', ensureAuthenticated, (req, res) => {
  var errors = [];

  if(!req.body.title){
      errors.push({text : "Please add a title"});
  }
  if(!req.body.details){
      errors.push({text : "Please add some details"});
  }
  if(errors.length > 0){
      res.render('ideas/add', {
          errors : errors,
          title : req.body.title,
          details : req.body.details

      })
  } else {
      const newUser = {
          title : req.body.title,
          details : req.body.details,
          user: req.user.id
        }

      new Idea(newUser)
          .save()
          .then(idea => {
              res.redirect('/ideas');
          })
          .catch(err => {
              console.log("error while saving ideas:" + err)
          });
  }

});
router.put('/:id', ensureAuthenticated,(req,res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        
        idea.save()
        .then(idea => {
            res.redirect('/ideas');
        })
    })
});

router.delete('/:id', ensureAuthenticated, (req,res) => {
    Idea.deleteOne({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg', 'Video Idea has been removed');
        res.redirect('/ideas');      
    })
});

module.exports = router;