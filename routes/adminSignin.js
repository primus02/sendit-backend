const express = require("express");

const router = express.Router();

const Admin = require("../models/admin");

const bodyParser = require("body-parser");

const bcrypt = require("bcrypt");

require("dotenv/config");

const jwt = require("jsonwebtoken");

router.use(bodyParser.json());

router.post("/", (req,res,next)=>{
    Admin.find({username: req.body.username})
    .exec()
    .then(data=>{
        if(data.length <= 0){
            return res.json({message: "Username invalid"});
        }
        else{
            bcrypt.compare(req.body.password, data[0].password, (err, result)=>{
                if(err){
                     return res.json({
                          message: "Password invalid"
                     });
                }
                if(result){
                    const token = jwt.sign({
                        username: data[0].username,
                        userId: data[0]._id
                    },
                    `process.env.JWT_ADMIN`,
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