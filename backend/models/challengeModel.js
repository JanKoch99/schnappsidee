const mongoose = require('mongoose')

const Schema = mongoose.Schema

const challengeSchema = new Schema({

    task: {
        type: String,
        required: true
    },

    difficulty: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Challenge', challengeSchema)