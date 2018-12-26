const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create ninja Schema & model
const SkillSchema = new Schema({

    skillType:{
        type:String,
        require:true
    }

});


const skills = mongoose.model('skills', SkillSchema);

module.exports = {
    skills
};