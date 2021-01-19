const mongoose= require("mongoose");

const customerSchema = mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    mobile: {type: String, required: true},
    address: {type: String, required: true},
    email: {type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
    password: {type: String, required: true}
});


module.exports = mongoose.model("Customer", customerSchema);
