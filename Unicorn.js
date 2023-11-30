const mongoose = require('mongoose')

const unicornSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    loves: [String],
    weight: Number,
    gender: String
})

module.exports = mongoose.model('unicorn' ,unicornSchema)