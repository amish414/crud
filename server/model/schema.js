const mongoose = require('mongoose');

const schema = new mongoose.schema({
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
        require: true
    },
    CreatedDate:{
        type:Date,
        require: true,
        default: Date.now
    },
    ModifiedBy:{
        type: Date,
        require: true,
        default: Date.now
    }
})
module.exports = schema;

