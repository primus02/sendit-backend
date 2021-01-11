const mongoose= require("mongoose");

const orderSchema = mongoose.Schema({
    username: {type: String, required: true},
    location: {type: String, required: true},
    destination: {type: String, required: true},
    weight: {type: String, required: true},
    price: {type: Number, required: true},
    status: {type: String, default: "pending"},
    date: {type: Date, default: Date.now},
    preslocation: {type: String, default: "Company"},
    recmobile: {type: Number, required: true}
});


module.exports = mongoose.model("Order", orderSchema);