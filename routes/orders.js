const express = require("express");

const Order = require("../models/order");

const Customer = require("../models/customer");

const CheckAuth = require("../middleware/checkauth");

const router = express.Router();

const bodyParser = require("body-parser");

router.use(bodyParser.json());

router.post("/create-order", CheckAuth, (req,res,next)=>{
     Customer.find({username: req.body.username})
     .exec()
     .then(customer=>{
         if(customer.length <1){
              return res.status(404).json({
                   message: "username invalid"
               });
         }
         else{
             
    const order= new Order({
        username: req.body.username,
        location: req.body.location,
        destination: req.body.destination,
        weight: req.body.weight,
        price: req.body.price,
        recmobile: req.body.recmobile
    });
    order
    .save()
    .then(order=>{
        res.status(201).json({
            "statusCode": "201",
            "statusText": "Created",
            "message": "Order created successfully",
            "order": order,
            "request": {
                "type": "GET",
                "url": `http://localhost:3000/get-order/${order._id}`
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            message: err
        })
    });
         }
     })
});

router.get("/get-orders/search", CheckAuth, (req, res, next)=>{
    Order.find({username: req.query.username})
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
                "ordersCount": orders.length,
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

router.get("/get-order/search", CheckAuth, (req,res,next)=>{
    Order.find({_id: req.query.id, username: req.query.username})
    .exec()
    .then(order=>{
        if(order.length>0){
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
                "message": "Order "+ req.query.id + " Not Found",
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

router.patch("/change-destination/search", CheckAuth, (req,res, next)=>{
    Order.updateOne({_id: req.query.id, username: req.query.username }, {$set : {destination: req.body.destination}})
    .exec()
    .then(order=>{
        res.status(200).json({
            "statusCode": "200",
            "statusText": "OK",
            "message": "Order " + req.query.id + " updated successfully",
            "order": order,
            "request": {
                "type": "GET",
                "url": `http://localhost:3000/get-order/${req.query.id}`
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

// router.delete("/cancel-order/search", CheckAuth, (req,res,next)=>{
//     Order.remove({_id: req.query.id, username: req.query.username})
//     .exec()
//     .then(data=>{
//         res.status(204).json({
//         success: true,
//         data: data,
//             "statusCode": "204",
//             "statusText": "No Content",
//             "message": "Order cancelled successfully",
//         });
//     })
//     .catch(err=>{
//         res.status(500).json({
//             "statusCode": "500",
//             "statusText": "Internal Server Error",
//             "message": "Internal Server Error"
//         });
//     });
// });

router.delete("/cancel-order/search", CheckAuth, async (req, res, next) => {
    try {
      const removedPost = await Order.remove({_id: req.query.id, username: req.query.username });
      res.status(200).json({ success: true, data: removedPost });
    } catch (err) {
      res.json({ error: err });
    }
  });

module.exports= router;