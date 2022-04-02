// require express for setting up the express server
const express = require('express');
var bodyParser = require('body-parser');

// set up the port number
const port = 8080;

// importing the DataBase
const db = require('./config/mongoose');

// importng the Schema For tasks
const  Task  = require('./models/task.js');

// using express
const app = express();

app.use(express.json());
// using static files
app.use(express.static("./views"));
// to use encrypted data
app.use(express.urlencoded({ extended: true }));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// rendering the App Page
app.get('/', (req, res)=>{
    Task.find({}, function(err, task){
        if(err){
            console.log('Error in fetching tasks from db');
            return;
        }

        return res.render('home', {
            title: "Assessment Test",
            task: task
        });
    }
)});


// creating Tasks
app.post('/create-task', (req, res)=>{
    
    Task.create({
        definition: req.body.definition,
        endDate: req.body.endDate,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        }, function(err, newtask){
        if(err){console.log('error in creating task', err); return;}
        
        return res.redirect('back');

    });
});


// deleting Tasks
app.get('/delete-task',(req, res)=>{
    // get the id from query
    var id = req.query;

    // checking the number of tasks selected to delete
    var count = Object.keys(id).length;
    console.log(Object.keys(id))
    for(let i=0; i < count ; i++){
        
        // finding and deleting tasks from the DB one by one using id
        Task.findByIdAndDelete(Object.keys(id)[i], function(err){
        if(err){
            console.log('error in deleting task');
            }
        })
    }
    return res.redirect('back'); 
});

// updating status
app.post('/update-status', async (req, res) =>{

    var update = await Task.findByIdAndUpdate(req.body.id ,{status : req.body.status  }, function(err){
        if(err){
            console.log('error in updating task');
            }
        });
        if(update){
            return res.status(200).send({message:"updated"});
        }else{
            return res.status(400).send({error:"error in updating task"});
        }

    });


    // deleting Tasks
app.get('/pending-tasks', async (req, res)=>{
    
    try{
    const pending = await Task.find({status : 'pending'});

    if(pending){
    return res.status(200).send(pending);
    }else{
        return res.status(400).send({error:"error in getting pending tasks"});
    } 
}catch(err)
{console.log(err)}
});

// make the app to listen on assigned port number
app.listen(port, (err)=>{
    if(err){
        console.log(`Error in running the server : ${err}`);
    }

    console.log(`Server is running on port : ${port}`);
});