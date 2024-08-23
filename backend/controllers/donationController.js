const Donation = require('../models/donationModel')
const mongoose = require('mongoose')
// get all workouts
const getDonations = async (req,res) => {
    const donations = await Donation.find().sort({createdAt: -1})

    res.status(200).json(donations)
}
// get a single donation
const getDonation = async (req,res) => {
    const {id} = req.params
    console.log(id)
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such donation'})
    }

    const donation = await Donation.findById(id)

    if (!donation) {
        return res.status(404).json({error: 'No such donation'})
    }
    res.status(200).json(donation)
}
// create new donation
const createDonation = async (req, res) => {
    const {victim, task, drink,perpetrator, contactInfo, taskState} = req.body
    let emptyFields = []

    if(!victim) {
        emptyFields.push('victim')
    }
    if(!task) {
        emptyFields.push('task')
    }
    if(!drink) {
        emptyFields.push('drink')
    }
    if(!perpetrator) {
        emptyFields.push('perpetrator')
    }
    if(!contactInfo) {
        emptyFields.push('contactInfo')
    }
    if(!taskState) {
        emptyFields.push('taskState')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({ error: "Please fill in all the fields", emptyFields })
    }
    //add doc to db
    try {
        const donation = await  Donation.create({victim, task, drink, perpetrator, contactInfo, taskState});
        res.status(200).json(donation)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a donation
const deleteDonation = async (req,res) => {
    const id = req.params.id
    const {victim, task, drink,perpetrator, contactInfo, taskState} = req.body
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such donation'})
    }

    const donation = await Donation.findByIdAndDelete({_id: id})

    if (!donation) {
        return res.status(404).json({error: 'No such donation'})
    }
    res.status(200).json(donation)
}
// update a donation
const updateDonation = async (req,res) =>{
    const id = req.params.id
    const {victim, task, drink,perpetrator, contactInfo, taskState} = req.body


    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such donation'})
    }


    const donation = await Donation.findOneAndUpdate({_id: id}, {
        victim, task, drink, perpetrator, contactInfo, taskState
    })

    if(taskState == 'inProgress'){
        //TODO versand per slack odr sms
        }

    if (!donation) {
        return res.status(404).json({error: 'No such donation'})
    }
    res.status(200).json(donation)
}



module.exports = {
    createDonation, getDonations, getDonation, deleteDonation, updateDonation
}