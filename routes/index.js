var express = require('express');
var router = express.Router();
var config = require('../config')
var file = require('../'+config["mode"])


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { data : "true"});
    // res.send(data)
  

  // res.render('index', { title: 'Express' });
});


router.get('/getData', function(req, res, next) {
  file.getAllObjects(function(data){
    console.log(data)
    res.send(JSON.stringify(data));
    // res.send(data)
  }
)
  // res.render('index', { title: 'Express' });
});

router.post('/createObject',function(req, res, next){
   file.createObject(req.body, function(data){
      console.log("Object created")
      res.send("Object created")
   })
})

router.post('/deleteObjects',function(req, res, next){
  file.deleteObjects(req.body, function(data){
    res.send(data)
  })
})

router.post('/renameObject',function(req, res, next){
  file.renameObject(req.body, function(data){
     console.log("Object created")
     res.send("Object renamed")
  })
})

module.exports = router;



