const mongoose = require('mongoose');
const Joi = require('joi');
const { required } = require('joi');

const jobSchema = mongoose.Schema({
    employer_id:{
        type:String,
        required:true
    },
    job:{
        type:String,
        required:true
    },
    skills:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required :true,
        maxlength:200
    },
    timing:{
        type:String
    },
    salary:{
        type:Number,
        required:true
    },
    openings: {
        type:Number,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    english:{
        type:String,
    },
    qualification:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        default:true
    },   
    status:[
        {employee_id: String, remark:String}
    ]
})




const Job = mongoose.model("Job",jobSchema);

const validate =(job)=>{
 const Schema = Joi.object({
        employer_id:Joi.string().required(),
        job:Joi.string().required(),
        skills:Joi.string().required(),
        description:Joi.string().max(200).required(),
        timing:Joi.string().required(),
        salary:Joi.number().required(),
        openings:Joi.number().required(),
        experience:Joi.string().required(),
        english:Joi.string().required(),
        qualification:Joi.string().required(),
        status:Joi.array()    
 })
 return Schema.validate(job)
}


module.exports = {Job,validate}