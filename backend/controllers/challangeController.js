const Donation = require('../models/donationModel')
const mongoose = require('mongoose')
const axios = require("axios");
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
    const {victim, task, drink, perpetrator, contactInfo, taskState, victimName, difficulty} = req.body
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
    if(!victimName) {
        emptyFields.push('victimName')
    }
    if(!difficulty) {
        emptyFields.push('difficulty')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({ error: "Please fill in all the fields", emptyFields })
    }
    //add doc to db
    try {
        const donation = await  Donation.create({victim, task, drink, perpetrator, contactInfo, taskState, victimName, difficulty});
        res.status(200).json(donation)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a donation
const deleteDonation = async (req,res) => {
    const id = req.params.id
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
    let {victim, task, drink,perpetrator, contactInfo, taskState, victimName, difficulty} = req.body


    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such donation'})
    }


    const donation = await Donation.findOneAndUpdate({_id: id}, {
        victim, task, drink, perpetrator, contactInfo, taskState, victimName, difficulty
    })
    if (!donation) {
        return res.status(404).json({error: 'No such donation'})
    }

    if(taskState === 'inProgress'){

        try {
            const slackApiUrl = `https://slack.com/api/users.lookupByEmail?email=${victim}`;
            const slackApiToken = process.env.SLACK_API_TOKEN;

            const response = await axios.get(slackApiUrl, {
                headers: {
                    'Authorization': `Bearer ${slackApiToken}`
                }
            })

            if (!response.data.ok) {
                return res.status(400).send(response.data)
            }
            if (!perpetrator){
                perpetrator= 'Anonymus'
            }
            const userID = response.data.user.id
            await axios.post(process.env.WEBHOOK, {
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `Hey <@${userID}>,\nyou have been offered a drink by ${perpetrator}. Earn your drink now by simply completing a challenge at <https://veracalma.ch/|VeraCalma> at the <https://maps.app.goo.gl/M6paQkdfdJ1EE9Y77|following address>.`
                        }
                    },
                ]
            });

        } catch (error) {
                console.error('Error sending message:', error);
                res.status(500).send('Internal Server Error');
        }
    }


    res.status(200).json(donation)
}



module.exports = {
    createDonation, getDonations, getDonation, deleteDonation, updateDonation
}