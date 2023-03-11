const router = require('express').Router();
const {Job,validate} = require('../model/job')
const Employee = require('../model/employee')

router.post("/new",async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const job  = new Job(req.body);

    try {
        await job.save();
        res.status(201).send(job)
    } catch (err) {
        res.status(500).send(err)
    }
})


// for employee 
router.put("/apply",async(req,res)=>{

    const validate = await Job.findById(req.body.job_id);
    if(!validate) return res.status(404).send("Not found job")
    const duplicate = validate.status.filter((m)=>m.employee_id===req.body.employee_id)
    if(duplicate.length >0) return res.status(400).send("Already apply for the job")

    try {
        const job = await Job.findByIdAndUpdate(req.body.job_id,{$push:{status:{employee_id:req.body.employee_id,remark:req.body.remark}}},{new:true});
        if(!job) return res.status(404).send("Job not found")
        await job.save();
        res.status(200).send(job)
        
    } catch (err) {
        res.status(500).send(err)
        
    }
})


//for employer
router.put("/response",async(req,res)=>{
    try {
        const job = await Job.findById(req.body.job_id);
        if(!job) return res.status(404).send("Job not found")
        const reject = job.status.filter((m)=>m.employee_id===req.body.employee_id);
        if(!reject) return res.status(404).send("Not have account");
        console.log(reject);
        reject[0].remark=req.body.response
        await job.save()   
        res.status(200).send(job)   
    } catch (err) {
        res.status(500).send(err)   
    }
})

// for employer
router.get("/createdjob/:_id",async(req,res)=>{
    const job = await Job.find({employer_id:req.params._id});
    try {
        res.status(200).send(job)
    } catch (err) {
        res.status(500).send(err)   
        
    }
})


// for employee
router.get("/apply/:_id",async(req,res)=>{
  const job = await Job.find({status: {$elemMatch:{employee_id:req.params._id}}});

  try {
    res.status(200).send(job)
    
  } catch (err) {
    res.status(500).send(err)   
    
  }
})

// for employer
router.get("/pending/:_id",async(req,res)=>{
    const job = await Job.find().and([{employer_id:req.params._id},{status: {$elemMatch:{remark:"apply"}}}])
    try {
      res.status(200).send(job)
      
    } catch (err) {
      res.status(500).send(err)   
      
    }
  })

// for view single job
router.get("/view/:_id",async(req,res)=>{
    const job = await Job.findById(req.params._id);
    try {
        res.status(200).send(job)
    } catch (err) {
        res.status(500).send(err)   
        
    }
})

router.get("/alljob",async(req,res)=>{
    const job = await Job.find();
    try {
        res.status(200).send(job)
    } catch (err) {
        res.status(500).send(err)   
        
    }
})



module.exports = router;