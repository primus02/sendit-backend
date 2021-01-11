const express = require("express");

const Order = require("../models/order");

const AdminCheck = require("../middleware/adminCheck");

const router = express.Router();

const bodyParser = require("body-parser");

router.use(bodyParser.json());

router.get("/get-all-orders", AdminCheck, (req, res, next)=>{
    Order.find()
    .exec()
    .then(orders =>{
        if(orders.length <1){
            res.status(404).json({
                message: "No order found",
            });
        }
        else{
            res.status(200).json({
                "statusCode": "200",
                "statusText": "OK",
                "message": "Orders found successfully",
                "OrdersCount": orders.length,
                "orders": orders,  
            });
        }
    })
    .catch(err=>{
        res.status(500).json({
             message: "Internal server error"
        });
    });
});

router.get("/get-an-order/:orderId", AdminCheck,(req,res,next)=>{
    Order.findById({_id: req.params.orderId})
    .exec()
    .then(order=>{
        if(order){
            res.status(200).json({
                "statusCode": "200",
                "statusText": "OK",
                "message": "Order found successfully",
                "order": order,
            });
        }
        else{
            res.status(404).json({
                "statusCode": "404",
                "statusText": "Not Found",
                "message": "Order "+ req.params.orderId + " Not Found",
            });
        }
    })
    .catch(err=>{
        res.status(500).json({
            "statusCode": "500",
            "statusText": "Internal Server Error",
            "message": "Internal Server Error"
        });
    });
})

router.patch("/change-status/:orderId", AdminCheck, (req,res, next)=>{
    Order.updateOne({_id: req.params.orderId}, {$set : {status: req.body.status}})
    .exec()
    .then(order=>{
        res.status(200).json({
            "statusCode": "200",
            "statusText": "OK",
            "message": "Order " + req.params.orderId + " updated successfully",
            "order": order,
            "request": {
                "type": "GET",
                "url": `http://localhost:3000/get-order/${req.params.orderId}`
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            "statusCode": "500",
            "statusText": "Internal Server Error",
            "message": "Internal Server Error"
        });
    });
});

router.patch("/change-location/:orderId", AdminCheck, (req,res, next)=>{
    Order.updateOne({_id: req.params.orderId}, {$set : {preslocation: req.body.preslocation}})
    .exec()
    .then(order=>{
        res.status(200).json({
            "statusCode": "200",
            "statusText": "OK",
            "message": "Order " + req.params.orderId + " updated successfully",
            "order": order,
            "request": {
                "type": "GET",
                "url": `http://localhost:3000/get-order/${req.params.orderId}`
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            "statusCode": "500",
            "statusText": "Internal Server Error",
            "message": "Internal Server Error"
        });
    });
});

module.exports= router;