const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { string } = require('joi');

const employerSchema = mongoose.Schema({
    name:{
        type:String,
    },
    password:{
        type:String,
        minlength:6,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    profileStatus:{
        type:Boolean,
        default:false
    },
    company_name:{
        type:String
    },
    location:{
        type:String
    },
    employee_no: {
        type:Number
    },
    since:{
        type:Date
    },
    about:{
        type:String,
        maxlength:80
    },
    contact:{
        type:Number,
        minlength:10,
        maxlength:10
    },

})

employerSchema.methods.getAuth = function(){
    return jwt.sign({_id:this._id,name:this.name,employer:true,profileStatus:this.profileStatus},process.env.PRIVATE_KEY)
}

const Employer = mongoose.model("Employer",employerSchema);

const validate =(employer)=>{
 const Schema = Joi.object({
     password:Joi.string().min(6).required(),
     email:Joi.string().email().required(),
    })
    return Schema.validate(employer)
}

const validateProfile =(employer)=>{
    const Schema = Joi.object({
            name:Joi.string(),
           company_name:Joi.string(),
           location:Joi.string(),
           employee_no:Joi.number(),
           since:Joi.date(),
           about:Joi.string().max(80),
           contact:Joi.string().min(10).max(10),
    })
    return Schema.validate(employer)
   }

module.exports = {Employer,validate,validateProfile}