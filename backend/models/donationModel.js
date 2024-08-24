const mongoose = require('mongoose')

const Schema = mongoose.Schema

const donationSchema = new Schema({


    victim: {
        type: String,
        required: false
    },
    challengeID: {
        type: Schema.Types.ObjectId,
        ref: 'Challenge',
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
        required: false
    },
    taskState: {
        type: String,
        required: true
    },
    victimName: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Donation', donationSchema)