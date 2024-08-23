const mongoose = require('mongoose')

const Schema = mongoose.Schema

const donationSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    to: {
        type: Number,
        required: true
    },
    what: {
        type: Number,
        required: true
    },
    drink: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Donation', donationSchema)