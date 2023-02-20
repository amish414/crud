// requiring all the file
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const moment = require('moment/moment');
const PORT = process.env.PORT || 3000;


// middlewares
const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(path.resolve(__dirname, 'assets')));
app.use(bodyparser.urlencoded({ extended: true }));


// setting up environment variable
dotenv.config({ path: 'config.env' })        // in path we will the port value as we are fetching the port from the config file

// setting up time
const dateFromDB = new Date(); 
const formattedDate = moment(dateFromDB).format('MMMM Do YYYY');
console.log(formattedDate); 
console.log(typeof formattedDate)



// setting up mongoose
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/soleradb',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then(message=>{
    console.log('Database connected successfully');
})
.catch(err=>{
    console.log(`Failed to connect ${err}`)
})

// defining schema
const driverdetail = new mongoose.Schema({
    primaryKey:{
        type:Number,
        require:true
    },
    Vechicle_SR_NO:{
        type : String,
        require: true
    },
    IsActive:{
        type: Boolean,
        require: true
    },
    CreatedBy:{
        type : String,
        require: true
    },
    ModifiedBy:{
        type: String,
        require: false
    },
    CreatedDate:{
        type:String,
        require: true,
        default: formattedDate,
    },
    ModifiedDate:{
        type: String,
        require: false,
    }
})


// signup page schme
const userdetail = new mongoose.Schema({
    username:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true
    }
})


// declaring the model
 const driver = mongoose.model("driverdetail",driverdetail);
 const user = mongoose.model("userdetails",userdetail);


 // sign in page
 app.get('/signin',(req,res)=>{
    res.render('signuppage');
 })
 
 app.post('/signin',(req,res)=>{
    console.log(req.body.email);;
    user.find({ email: req.body.email }).then((result)=>{
        // console.log(result);
        if(result.length === 0){
            const User = new user({
                username: req.body.username.toLowerCase(),
                email: req.body.email,
                password: req.body.password,
                
            })
            User.save((err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log('user added successfully');
                    res.redirect('/');
                }
            })
        }
        else{
        console.log('user already exist');
        res.redirect('/');
        }
    })
    
})



// login page  
        // login page get request
app.get('/', (req, res) => {
    res.render('LoginPage');
});

        // login page post req
let username;
app.post('/loginpage', (req, res) => {
        username = null;
     user.find({email:req.body.email}).then((result) =>{
        username=result[0].username;
        console.log(req.body.email);
        console.log(req.body.password);
        console.log(result[0].password);
        if(result[0].password === req.body.password){
            console.log('so Redirectt');
            return res.redirect('/ProductPage');
        }
        else{
            res.redirect('/');
        }
    }).catch(()=>{
        res.redirect('/');
    })  
    
     
});

// product page
     // product page does not have any input attribute so only get request is used
app.get('/ProductPage',(req,res)=>{
    if(typeof username === 'undefined' || username === null){
        res.redirect('/'); 
    }
    else{
    driver.find({IsActive:true}).then((result)=>{
        res.render("ProductPage",{users:result,user1:username});
    })
}
})



// declaring the username and password as global varibale and fetching username and password


// edit page
        // edit page get request
app.get('/editpage/:id',(req,res) =>{
    if(typeof username === 'undefined' || username === null){
        res.redirect('/'); 
    }
    else{
    console.log(req.params.id);
    driver.find({primaryKey:req.params.id}).then((result) =>{
        console.log(result);
        res.render('editpage',{users:result,user1:username});
    })
}
   
})
        // edit page post request
app.post('/editpage/:id',(req,res)=>{
    console.log(req.params.id);
    console.log(req.body.Vehiclesr);
    var serialno = req.body.Vehiclesr.trim() || null
    if(serialno === null){
        res.redirect('/ProductPage');
    }
    driver.findOneAndUpdate(
        {primaryKey: req.params.id},
        { $set: { 'Vechicle_SR_NO': serialno.toUpperCase(),'ModifiedBy':username,'ModifiedDate':formattedDate}},
    ).then((result)=>{
        res.redirect('/ProductPage')
    })
})

// fetching the data form the edit page and updating the data


// simply rendering the adddriver page
        // addriver page get request
app.get('/addDriver',(req,res) =>{
    if(typeof username === 'undefined' || username === null){
        res.redirect('/'); 
    }
    else{
    res.render('addDriver',{user1:username});
    }
})
        // addriver page post request
app.post('/addDriver',(req,res)=>{
    console.log('i am inside add driver page');
   let serialno = req.body.sr.trim() || null;
   if(serialno === null){
        res.redirect('/addDriver');
   }
   else{
    driver.find().then((result)=>{
        const driver1 = new driver({
            primaryKey:result.length+1,
            Vechicle_SR_NO: serialno.toUpperCase(),
            IsActive:true,
            CreatedBy:username,
        })
        driver1.save((err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log('data has been saved');
                res.redirect("ProductPage");
            }
        })
    }).catch((err)=>{
        console.log(err);
    })
}
});


// delete get request
app.get('/deletepage/:id',(req,res)=>{
    driver.findOneAndUpdate(
        {primaryKey: req.params.id},
        {$set:{IsActive:false}},
    ).then((result)=>{
        res.redirect('/ProductPage')
    })
})
// get request of delete page
app.get('/logout',(req,res)=>{
    username = null;
    res.redirect('/');
})

// setting up the port 
app.listen(PORT,()=>{
    console.log("Server running in port "+PORT);
});
