const express = require("express");

const router = express.Router();

const Customer = require("../models/customer");

const bodyParser = require("body-parser");

const bcrypt = require("bcrypt");

require("dotenv/config");

const jwt = require("jsonwebtoken");

router.use(bodyParser.json());

router.post("/", (req,res,next)=>{
    Customer.find({email: req.body.email})
    .exec()
    .then(data=>{
        if(data.length <= 0){
            return res.json({message: "Email does not exist"});
        }
        else{
            bcrypt.compare(req.body.password, data[0].password, (err, result)=>{
                if(err){
                     return res.json({
                          message: "Auth failed"
                     });
                }
                if(result){
                    const token = jwt.sign({
                        email: data[0].email,
                        userId: data[0]._id
                    },
                    `process.env.JWT_KEY`,
                    {expiresIn: "1hr"}
                    );

                    res.status(201).json({
                        "statusCode": "200",
                        "statusText": "OK",
                        "message": "Signed in successfully",
                        "data": data,
                        "token": token
                    });
                }
                else{
                    res.json({
                        message: "Auth failed"
                    })
                }
            });
        }
    })
   .catch(err=>{
       res.json({message: err});
   });
});



module.exports= router;