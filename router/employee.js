const router = require('express').Router();
const bcrypt =require('bcrypt');
const {Employee,validate,validateProfile} = require('../model/employee');


router.get("/all",async(req,res)=>{
    try {
        const employee = await Employee.find({}).select({profileStatus:0, password:0, __v:0});
        res.status(200).send(employee)
    } catch (err) {
        res.status(500).send(err)
    
    }
})


router.get("/:_id",async(req,res)=>{
      try {
        const employee = await Employee.findById(req.params._id).select({profileStatus:0, password:0, __v:0})
        if(!employee) return res.status(404).send("Not found");
        res.status(200).send(employee)
      } catch (err) {
        res.status(500).send(err)
      }
})


router.post("/register",async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    
    let employee = await Employee.findOne({email:req.body.email})
    if(employee) return res.status(400).send("email must be unique") 

    employee = new Employee(req.body);

    try {
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(employee.password,salt)
        await employee.save()
        const token = await employee.getAuth()
        res.header("x-auth-token",token).header("access-control-expose-headers","x-auth-token").send(token)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.patch("/profile/:_id",async(req,res)=>{
    const {error} = validateProfile(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    try {
        const updateEmployee = {...req.body,profileStatus:true}
        const employee = await Employee.findByIdAndUpdate(req.params._id,updateEmployee,{new:true})
         if(!employee) return res.status(404).send("invalid account");
        await employee.save();
        const token = await employee.getAuth()
        res.header("x-auth-token",token).header("access-control-expose-headers","x-auth-token").send(token)
    } catch (err) {
        res.status(500).send(err)
    }

})

router.post("/login",async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const employee = await Employee.findOne({email:req.body.email});
    if(!employee) return res.status(404).send("invalid password or email")

    try {
        const verify =  bcrypt.compare(req.body.password,process.env.PRIVATE_KEY)
        if(!verify) return res.status(401).send("invaild password or email")

        const token = await employee.getAuth()
        res.header("x-auth-token",token).header("access-control-expose-headers","x-auth-token").send(token)
    } catch (err) {
        res.status(500).send(err);
    }

})

router.delete("/delete/:_id",async(req,res)=>{
    try {
      const employee = await Employee.findByIdAndDelete(req.params._id);
      if(!employee) return res.status(404).send("Not found Employee")
      res.status(200).send("delete account")
    } catch (err) {
        res.status(500).send(err);
    }
})


module.exports = router;