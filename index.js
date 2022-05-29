const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


var bodyParser = require('body-parser');

// set up the port number
const port = 8080;

// importing the DataBase
const db = require('./config/mongoose');

// importng the Schema For tasks
const  user  = require('./models/users.js');


app.use(express.json());
// using static files
app.use(express.static("./views"));
// to use encrypted data
app.use(express.urlencoded({ extended: true }));

// creating Tasks
app.post('/api/users',async (req, res)=>{
    
   var User = await user.create({
      username: req.body.username,
        
        }, function(err, newtask){
        if(err){console.log('error in creating task', err); return;}
       
        // return res.message(User);

    });
    const ResUser = await user.findOne({username:req.body.username});
    var Res = {
      '_id':ResUser._id,
      'username': ResUser.username
    }
    return res.json(Res);
});

// creating Tasks
app.get('/api/users',async (req, res)=>{
    
  var User = await user.find();
  let array = [];
  for(var i = 0 ; i < User.length ; i++){

    var obj = {
      '_id': User[i]._id,
      'username': User[i].username
    };

    array.push(obj);

  }
      
   return res.send(array);
});


// deleting Tasks
app.get('/api/users/:_id/logs', async (req, res)=>{
 
  

    var getLog = await user.findOne({'_id':req.params._id});

    var logs = []
    
    for( var i = 0 ; i < getLog.exercises.length ; i++){

      var obj = {};
      obj['description'] = getLog.exercises[i].description;
      obj['duration'] = parseInt(getLog.exercises[i].duration);
      obj['date'] = getLog.exercises[i].date;

      logs.push(obj);

    }

        var newObj = {};

        newObj['username'] = getLog.username;
        newObj['count'] = getLog.exercises.length;
        newObj['_id'] = getLog._id;
        newObj['log'] = logs;

        if(getLog){
            return res.status(200).send(newObj);
        }else{
            return res.status(400).send({error:"error in updating task"});
        }
});

// updating status
app.post('/api/users/:_id/exercises', async (req, res) =>{

   if(req.body.date == ''){
     req.body.date = new Date().toDateString();
   }

   var obj = {
    'description' : req.body.description, 
    'duration' : req.body.duration,
     'date' : req.body.date 
   }

    var update = await user.findOneAndUpdate({'_id':req.params._id} , { "$push": { "exercises": obj }}, function(err){
        if(err){
            console.log('error in updating task');
            }
        }).clone();

        var newObj = {};

        newObj['_id'] = req.params._id;
        newObj['username'] = update.username;
        newObj['description'] = obj.description;
        newObj['duration'] = obj.duration;
        newObj['date'] = obj.date;

        if(update){
            return res.status(200).send(newObj);
        }else{
            return res.status(400).send({error:"error in updating task"});
        }

    });


   

// make the app to listen on assigned port number






const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
