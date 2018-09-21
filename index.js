var express = require('express');
var app = express();
var mongoose = require('mongoose');
var router = express.Router();
var multer = require('multer');
var upload = multer();
var bodyParser = require('body-parser');
var mailer = require('nodemailer');


mongoose.connect('mongodb://localhost:27017/vinay', { useNewUrlParser: true });

app.set('view engine','pug');
app.set('views','./views');

app.use(express.static('css'));
app.use(express.static('images'));
// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: false })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 

//creating schema for inserting employee
var personSchema = mongoose.Schema({
    name: String,
    id:Number,
    age: Number,
    nationality: String
 });
 var Person = mongoose.model("Person", personSchema);

//routing for login & logout
app.get('/login', function(req, res){
    res.render('login');
 });

app.get('/forgotpassword',function(req,res){
  res.render('forgotpassword');
}); 

app.get('/backtologin',function(req,res){
  res.render('login');
});

app.post('/homepage', function(req, res){
    var login = req.body;//get parsed information

    if(login.username=="vinaykurmadas@gmail.com" && login.password=="Vin@y143"){
    res.render('homepage');
    }
    else{
        res.send("You provided wrong credentials");
    }
 });

  app.get('/logout',(req,res)=>{
    res.redirect('login');
  });

//routing for sending mail

app.post('/sendmail',function(req,res){

    var name = req.body.email;
   

  var transporter = mailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'vinaypsu@gmail.com', // Your email id
        pass: 'Vin@y143' 
    }
   });
   var text = 'Hello Sir \n\n' + 'Please find the Password Below \n\n'+'Vin@y143';

   var mailOptions = {
    from: 'vinaypsu@gmail.com', // sender address
    to: name, // list of receivers
    subject: 'Password Recovery', // Subject line
    text: text //, // plaintext body
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
   };
     transporter.sendMail(mailOptions, (error, info) => {
     if (error) {
      return console.log(error);
     }
    console.log('Message sent: %s', info.messageId);
  // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', mailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
res.send('Message Sent Successfully');
  
})

//routing for inserting Employee

app.get('/createemployee', function(req, res){
    res.render('createemployee');
 });

app.post('/insertingemployee', function(req, res){
    var personInfo = req.body; //Get the parsed information
    console.log(personInfo);
    
    if(!personInfo.name ||!personInfo.id || !personInfo.age || !personInfo.nationality){
       res.render('message', {
          message: "Sorry, you provided worng info", type: "error"});
    } else {
       var newPerson = new Person({
          name: personInfo.name,
          id:personInfo.id,
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


//routing for fetch employee
 app.get('/fetchemployee', function(req, res){
    res.render('fetchemployee');
 });

 app.post('/search', function(req, res,next){
    var emp= req.body;
    
 
    mongoose.connect('mongodb://localhost:27017/vinay', { useNewUrlParser: true },function(err,db){
     console.log(emp.find);
     var query = { id: parseInt(emp.find) };
    // console.log(query);
     var cursor = db.collection('people').find(query).toArray(function(err,result){
     //   console.log(result);
        if(result[0] != null){
       return  res.send(result);
        }
        else{
          res.send("No employee find! please search with another id");
        }
     })
    })
 });


//routing to delete employeee
 app.get('/deleteemployee', function(req, res){
    res.render('deleteEmployee');
 });

 app.post('/deleted', function(req, res,next){
    var emp= req.body;
    
 
    mongoose.connect('mongodb://localhost:27017/vinay', { useNewUrlParser: true },function(err,db){
     console.log(emp.delete);
     var query = { id: parseInt(emp.delete) };
     console.log(query);
     var cursor = db.collection('people').deleteOne(query,function(err,obj){
       console.log(obj);
       if(obj.deletedCount != 0){
       res.send("Record deleted Successfully");
       }
       else{
         res.send("No Record available to delete");
       }
      })
    })
 });
 
//routing to update employee  
app.get('/updateemployee', function(req, res){
  res.render('updateemployee');
});


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


app.listen(3030);