const mongoose = require('mongoose');
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
module.exports= mongoose;