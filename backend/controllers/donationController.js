const Donation = require('../models/donationModel')
const mongoose = require('mongoose')
// get all workouts
const getDonations = async (req,res) => {
    const user_id = req.user._id

    const donations = await Donation.find({user_id}).sort({createdAt: -1})

    res.status(200).json(donations)
}
// get a single workout
const getDonation = async (req,res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such donation'})
    }

    const donation = await Donation.findById(id)

    if (!donation) {
        return res.status(404).json({error: 'No such donation'})
    }
    res.status(200).json(donation)
}
// create new workout
const createDonation = async (req, res) => {
    const {title, load, reps} = req.body

    let emptyFields = []

    if(!title) {
        emptyFields.push('title')
    }
    if(!load) {
        emptyFields.push('load')
    }
    if(!reps) {
        emptyFields.push('reps')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({ error: "Please fill in all the fields", emptyFields })
    }
    //add doc to db
    try {
        const user_id = req.user._id
        const donation = await Donation.create({title, load, reps, user_id})
        res.status(200).json(donation)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a workout
const deleteDonation = async (req,res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such donation'})
    }

    const donation = await Donation.findByIdAndDelete({_id: id})

    if (!donation) {
        return res.status(404).json({error: 'No such donation'})
    }
    res.status(200).json(donation)
}
// update a workout

const updateDonation = async (req,res) =>{
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such donation'})
    }

    const donation = await Donation.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!donation) {
        return res.status(404).json({error: 'No such donation'})
    }
    res.status(200).json(donation)
}



module.exports = {
    createDonation, getDonations, getDonation, deleteDonation, updateDonation
}