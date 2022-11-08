const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    warranty_years: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
})

autoIncrement.initialize(mongoose.connection);
ProductSchema.plugin(autoIncrement.plugin, {
    model: "products", 
    field: "_id",
    startAt: 5, 
    incrementBy: 1, 
});

module.exports = Products = mongoose.model('products', ProductSchema)