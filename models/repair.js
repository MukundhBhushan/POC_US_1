const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create ninja Schema & model
const repairsSchema = new Schema({

    requireImage: {
        type: String,
        required: true,

    },

    skill: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },

    accName: {
        type: String,
        required: true
    },
    Workers: {
        type:[worker]
    }



});


var worker = {
    NameWork: {
        "Name":{
            type:String
        },
        "price":{
            type:Number,
            require:true
        },
        "planofaction":{
            type:String
        },

        "rating":{
            type:Number,
            require:true
        },
        required: true
    },

}


const repairs = mongoose.model('repairs', repairsSchema);

module.exports = {
    repairs
};