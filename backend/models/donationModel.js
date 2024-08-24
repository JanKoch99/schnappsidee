const mongoose = require('mongoose')

const Schema = mongoose.Schema

const donationSchema = new Schema({

    victim: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    drink: {
        type: String,
        required: true
    },
    perpetrator: {
        type: String,
        required: false
    },
    contactInfo: {
        type: String,
        required: true
    },
    taskState: {
        type: String,
        required: true
    },
    victimName: {
        type: String,
        required: false
    },
    difficulty: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Donation', donationSchema)