const router = require('express').Router();
const bcrypt =require('bcrypt');
const {Employer,validate,validateProfile} = require('../model/employer');


router.get("/all",async(req,res)=>{
    try {
        const employer = await Employer.find({}).select({profileStatus:0, password:0, __v:0});
        res.status(200).send(employer)
    } catch (err) {
        res.status(500).send(err)
    
    }
})


router.get("/:_id",async(req,res)=>{
      try {
        const employer = await Employer.findById(req.params._id).select({profileStatus:0, password:0, __v:0})
        if(!employer) return res.status(404).send("Not found");
        res.status(200).send(employer)
      } catch (err) {
        res.status(500).send(err)
      }
})


router.post("/register",async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let employer = await Employer.findOne({email:req.body.email})
    if(employer) return res.status(400).send("email must be unique") 

     employer = new Employer(req.body);

    try {
        const salt = await bcrypt.genSalt(10);
        employer.password = await bcrypt.hash(employer.password,salt)
        await employer.save()
        const token = await employer.getAuth()
        res.header("x-auth-token",token).header("access-control-expose-headers","x-auth-token").send(token)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.patch("/profile/:_id",async(req,res)=>{
    const {error} = validateProfile(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    try {
        const updateEmployer = {...req.body,profileStatus:true}
        const employer = await Employer.findByIdAndUpdate(req.params._id,updateEmployer,{new:true})
         if(!employer) return res.status(404).send("invalid account");
        await employer.save()
        const token = await employer.getAuth()
        res.header("x-auth-token",token).header("access-control-expose-headers","x-auth-token").send(token)
    } catch (err) {
        res.status(500).send(err)
    }

})

router.post("/login",async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const employer = await Employer.findOne({email:req.body.email});
    if(!employer) return res.status(404).send("invalid password or email")

    try {
        const verify =  bcrypt.compare(req.body.password,process.env.PRIVATE_KEY)
        if(!verify) return res.status(401).send("invaild password or email")

        const token = await employer.getAuth()
        res.header("x-auth-token",token).header("access-control-expose-headers","x-auth-token").send(token)
    } catch (err) {
        res.status(500).send(err);
    }

})

router.delete("/delete/:_id",async(req,res)=>{
    try {
      const employer = await Employer.findByIdAndDelete(req.params._id);
      if(!employer) return res.status(404).send("Not found Employer")
      res.status(200).send("delete account")
    } catch (err) {
        res.status(500).send(err);
    }
})


module.exports = router;