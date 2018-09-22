var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();
var bodyParser = require('body-parser');
var app = express();

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/vinay', { useNewUrlParser: true });

app.set('view engine','pug');
app.set('views','./views');

var personSchema = mongoose.Schema({
    name: String,
    age: Number,
    nationality: String
 });
 var Person = mongoose.model("Person", personSchema);

app.get('/vinay', function(req, res){
    res.render('homepage');
 });

 // for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('css'));
app.use(express.static('images'));

app.post('/', function(req, res){
    var personInfo = req.body; //Get the parsed information
    console.log(personInfo);
    
    if(!personInfo.name || !personInfo.age || !personInfo.nationality){
       res.render('message', {
          message: "Sorry, you provided worng info", type: "error"});
    } else {
       var newPerson = new Person({
          name: personInfo.name,
          age: personInfo.age,
          nationality: personInfo.nationality
       });
         
       newPerson.save(function(err, Person){
          if(err)
             res.render('message', {message: "Database error", type: "error"});
          else
             res.render('message', {
                message: "New person added", type: "success", person: personInfo});
       });
    }
 });

 app.listen(4000);
