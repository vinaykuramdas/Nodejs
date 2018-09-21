var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
var mongoose = require('mongoose');


app.get('/', function(req, res){
   res.render('updateemployee');
});

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('css'));

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: false })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.post('/update', function(req, res,next){
   var emp= req.body;
   console.log(emp);
   

   mongoose.connect('mongodb://localhost:27017/vinay', { useNewUrlParser: true },function(err,db){
    console.log(emp.id,emp.name,emp.age,emp.nation);
    var query = {id:1207890};
    
    if(emp.id!=null&&emp.name!=""&&emp.age!=""&&emp.nation!=""){
      var query1 ={$set:{name:emp.name,age:emp.age,nationality:
        emp.nation}};
      var cursor = db.collection('people').update(query,query1,
        function(err,resu){
          res.send(resu.result.nModified + " document(s) updated");

      })
    }
    if(emp.id!=null&&emp.name==""&&emp.age!=""&&emp.nation!=""){
      var query2={$set:{age:emp.age,nationality:
        emp.nation}};
      var cursor = db.collection('people').update(query,query2,
        function(err,resu){
          res.send(resu.result.nModified + " document(s) updated");

      })
      
    }
    if(emp.id!=null&&emp.name!=""&&emp.age==""&&emp.nation!=""){
      var query3 = {$set:{name:emp.name,nationality:
        emp.nation}};
      var cursor = db.collection('people').update(query,query3,
        function(err,resu){
          res.send(resu.result.nModified + " document(s) updated");

      })
      
    }
    if(emp.id!=null&&emp.name!=""&&emp.age!=""&&emp.nation==""){
      var query4 = {$set:{name:emp.name,age:emp.age}};
      var cursor = db.collection('people').update(query,query4,
        function(err,resu){
          res.send(resu.result.nModified + " document(s) updated");

      })
      
    }
    if(emp.id!=null&&emp.name==""&&emp.age==""&&emp.nation!=""){
      var query5 = {$set:{nationality:
        emp.nation}};
      var cursor = db.collection('people').update(query,query5,
        function(err,resu){
          res.send(resu.result.nModified + " document(s) updated");

      })
      
    }
    if(emp.id!=null&&emp.name!=""&&emp.age==""&&emp.nation==""){
      var query6 = {$set:{name:emp.name}};
      var cursor = db.collection('people').update(query,query6,
        function(err,resu){
          res.send(resu.result.nModified + " document(s) updated");

      })
      
    }
    if(emp.id!=null&&emp.name==""&&emp.age!=""&&emp.nation==""){
      var query7 = {$set:{age:emp.age}};
      var cursor = db.collection('people').update(query,query7,
        function(err,resu){
          res.send(resu.result.nModified + " document(s) updated");

      })
   
    }
    }) 
   });


app.listen(3000);