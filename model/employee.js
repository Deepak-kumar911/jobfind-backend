const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { string } = require('joi');

const employeeSchema = mongoose.Schema({
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
    DOB:{
        type:Date,

    },
    gender:{
        type:String,

    },
    status:{
        type:String,

    },
    education:{
        type:String,

    },
    profession:{
        type:String,

    },
    address:{
        type:String,

    },
    skills:{
        type:String,

    },
    about:{
        type:String,
        maxlength:80,

    },
    experience:{
        type:String,

    },
    contact:{
        type:Number,
        minlength:10,
        maxlength:10,

    },
    hobbies:{
        type:String
    }
})

employeeSchema.methods.getAuth = function(){
    return jwt.sign({_id:this._id,name:this.name,employee:true,profileStatus:this.profileStatus},process.env.PRIVATE_KEY)
}

const Employee = mongoose.model("Employee",employeeSchema);

const validate =(employee)=>{
 const Schema = Joi.object({
     password:Joi.string().min(6).required(),
     email:Joi.string().email().required(),
    })
    return Schema.validate(employee)
}

const validateProfile =(employee)=>{
    const Schema = Joi.object({
            name:Joi.string(),
           DOB:Joi.date(),
           experience:Joi.string(),
           profession:Joi.string(),
           address:Joi.string(),
           skills:Joi.string(),
           about:Joi.string(),
           gender:Joi.string(),
           status:Joi.string(),
           education:Joi.string(),
           hobbies:Joi.string(),
           contact:Joi.string().max(10).min(10)
   
    })
    return Schema.validate(employee)
   }

module.exports = {Employee,validate,validateProfile}