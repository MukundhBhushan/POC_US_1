const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create ninja Schema & model
const repairsSchema = new Schema({

    requireImage:{
        type:String,
        required: true,
        
    },

    skill: {
        type: String,
        required: true,
    },
    description:{
        type:String,
        required: true
    },

    accName:{
        type:String,
        required: true
    },

    NameWork:{
        type:[String],
        required: true
    },

    prices:{
        type:[Number],
        required: true
    }


});

// var acceptedRep = new Schema({
//     Name:{
//         type:String,
//     },
//     acc:{
//         type:Boolean
//     }
// })


const repairs = mongoose.model('repairs', repairsSchema);

module.exports = {repairs};