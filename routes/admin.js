const express = require("express");

const Admin = require("../models/admin");

const router = express.Router();

const bodyParser = require("body-parser");

const bcrypt = require("bcrypt");

router.use(bodyParser.json());

router.post("/", (req,res,next)=>{
    Admin.find({username: req.body.username})
    .exec()
    .then(data=>{
        if(data.length >= 1){
            return res.json({message: "Username already exists"});
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if(err){
                     return res.json({
                          message: err
                     });
                }
                else{
                    const admin= new Admin({
                        username: req.body.username,
                        password: hash
                    });
                    admin
                    .save()
                    .then(data=>{
                        res.status(201).json({
                            "statusCode": "201",
                            "statusText": "Created",
                            "message": "Admin Created Successfully",
                            "data": data,
                            "url": "http://localhost:3000/admin/signin"
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