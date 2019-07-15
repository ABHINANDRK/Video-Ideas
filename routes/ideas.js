const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');

//Load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/add', (req, res) => {
    res.render('ideas/add');
});

router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit',{
            idea: idea
        });
    })
    
})

router.get('/', (req, res) => {
console.log('dfd');
    Idea.find({})
    .sort({date : 'desc'})
    .then(ideas => {
        res.render('ideas/list', {
          ideas: ideas
        });
    });
});

router.post('/', (req, res) => {
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
          details : req.body.details      
        }

      new Idea(newUser)
          .save()
          .then(idea => {
              res.redirect('/ideas');
          })
  }

});
router.put('/:id', (req,res) => {
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

router.delete('/:id', (req,res) => {
    Idea.deleteOne({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg', 'Video Idea has been removed');
        res.redirect('/ideas');      
    })
});

module.exports = router;