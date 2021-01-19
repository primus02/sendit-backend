const express = require("express");

const Customer = require("../models/customer");

const router = express.Router();

const bodyParser = require("body-parser");

const bcrypt = require("bcrypt");

router.use(bodyParser.json());


router.post("/", (req,res,next)=>{
   
    Customer.find({email: req.body.email})
    .exec()
    .then(data=>{
        if(data.length >= 1){
            return res.json({message: "Mail exists"});
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if(err){
                     return res.json({
                          message: err
                     });
                }
                else{
                    const customer= new Customer({
                        name: req.body.name,
                        username: req.body.username,
                        mobile: req.body.mobile,
                        address: req.body.address,
                        email: req.body.email,
                        password: hash
                    });
                    customer
                    .save()
                    .then(data=>{
                        console.log(data)
                        res.status(201).json({
                            "statusCode": "201",
                            "statusText": "Created",
                            "message": "User Created Successfully",
                            "data": data,
                            "url": "http://localhost:3000/signin"
                        });
                    })
                    .catch(err=>{
                        res.json({
                            error: err
                        });
                    });
                }
            });
        }
    })
    .catch(err=>{
        res.json({mess: err});
    });
});



module.exports= router;
