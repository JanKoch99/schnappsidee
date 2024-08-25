const Donation = require('../models/donationModel')
const mongoose = require('mongoose')
const axios = require("axios");
// get all workouts
const getDonations = async (req,res) => {
    const donations = await Donation.find().populate("challengeID").sort({createdAt: -1})
    const formattedDonations = donations.map((donation) => (
        {
            _id: donation._id,
            victim: donation.victim,
            task: donation.challengeID.task,
            drink: donation.drink,
            perpetrator: donation.perpetrator,
            contactInfo: donation.contactInfo,
            taskState: donation.taskState,
            victimName: donation.victimName,
            difficulty: donation.challengeID.difficulty,
            createdAt: donation.createdAt,
            updatedAt: donation.updatedAt,
            price: donation.price
        }))
    res.status(200).json(formattedDonations)
}
// get a single donation
const getDonation = async (req,res) => {
    const {id} = req.params
    console.log(id)
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such donation'})
    }

    const donation = await Donation.findById(id).populate("challengeID")

    if (!donation) {
        return res.status(404).json({error: 'No such donation'})
    }
    const formattedDonation = {
            _id: donation._id,
            victim: donation.victim,
            task: donation.challengeID.task,
            drink: donation.drink,
            perpetrator: donation.perpetrator,
            contactInfo: donation.contactInfo,
            taskState: donation.taskState,
            victimName: donation.victimName,
            difficulty: donation.challengeID.difficulty,
            price: donation.price

        }

    res.status(200).json(formattedDonation)
}
// create new donation
const createDonation = async (req, res) => {
    let {victim, challengeID, drink, perpetrator, contactInfo, taskState, victimName, price} = req.body

    let emptyFields = []

    if(!challengeID) {
        emptyFields.push('challengeID')
    }
    if(!drink) {
        emptyFields.push('drink')
    }
    if(!perpetrator) {
        perpetrator = "Anonymous"
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
    if(!price) {
        emptyFields.push('price')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({ error: "Please fill in all the fields", emptyFields })
    }
    //add doc to db
    try {
        const donation = await Donation.create({victim, challengeID, drink, perpetrator, contactInfo, taskState, victimName, price});
        const populatedDonation = await Donation.findById(donation._id).populate("challengeID")

        const formattedDonation = {
            _id: populatedDonation._id,
            victim: populatedDonation.victim,
            task: populatedDonation.challengeID.task,
            drink: populatedDonation.drink,
            perpetrator: populatedDonation.perpetrator,
            contactInfo: populatedDonation.contactInfo,
            taskState: populatedDonation.taskState,
            victimName: populatedDonation.victimName,
            difficulty: populatedDonation.challengeID.difficulty,
            price: populatedDonation.price
        }
        req.broadcastEventById(populatedDonation._id, formattedDonation)
        res.status(200).json(formattedDonation)
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
    let {victim, challengeID, drink,perpetrator, contactInfo, taskState, victimName, price} = req.body


    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such donation'})
    }

    if(!perpetrator) {
        perpetrator = "Anonymous"
    }

    const donation = await Donation.findOneAndUpdate({_id: id}, {
        victim, challengeID, drink, perpetrator, contactInfo, taskState, victimName, price
    }).populate("challengeID")
    if (!donation) {
        return res.status(404).json({error: 'No such donation'})
    }

    const formattedDonation = {
        _id: donation._id,
        victim: donation.victim,
        task: donation.challengeID.task,
        drink: donation.drink,
        perpetrator: donation.perpetrator,
        contactInfo: donation.contactInfo,
        taskState: donation.taskState,
        victimName: donation.victimName,
        difficulty: donation.challengeID.difficulty,
        price: donation.price
    }


    if(taskState === 'inProgress'){

        try {
            const slackApiUrl = `https://slack.com/api/users.lookupByEmail?email=${victim}`;
            const slackApiToken = process.env.SLACK_API_TOKEN;

            const responseVictim = await axios.get(slackApiUrl, {
                headers: {
                    'Authorization': `Bearer ${slackApiToken}`
                }
            })

            if (!responseVictim.data.ok) {
                return res.status(400).send(responseVictim.data)
            }
            const victimUserID = responseVictim.data.user.id
            await axios.post(process.env.WEBHOOK, {
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `Hey <@${victimUserID}>,\nyou have been offered a drink by ${perpetrator}. Earn your drink now by simply completing a challenge at <https://veracalma.ch/|VeraCalma> at the <https://maps.app.goo.gl/M6paQkdfdJ1EE9Y77|following address>.`
                        }
                    },
                ]
            });


            if (isValidEmail(contactInfo)) {
                const perpetratorSlackApiUrl = `https://slack.com/api/users.lookupByEmail?email=${contactInfo}`;

                const perpetratorResponse = await axios.get(perpetratorSlackApiUrl, {
                    headers: {
                        'Authorization': `Bearer ${slackApiToken}`
                    }
                })

                if (!perpetratorResponse.data.ok) {
                    return res.status(400).send(perpetratorResponse.data)
                }
                const perpetratorUserId = perpetratorResponse.data.user.id
                await axios.post(process.env.WEBHOOK, {
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": `Hey <@${perpetratorUserId}>,\nYour challenge has been submitted and we are waiting on <@${victimUserID}> to accept it.`
                            }
                        },
                    ]
                });
            }



        } catch (error) {
                console.error('Error sending message:', error);
                res.status(500).send('Internal Server Error');
        }
    }
    if(taskState === 'done'){

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
            const userID = response.data.user.id
            await axios.post(process.env.WEBHOOK, {
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `<@${userID}> great performance!\nYou have earned your special drink, enjoy :beers:!`
                        }
                    },
                ]
            });

            if (isValidEmail(contactInfo)) {
                const perpetratorSlackApiUrl = `https://slack.com/api/users.lookupByEmail?email=${contactInfo}`;
                const perpetratorResponse = await axios.get(perpetratorSlackApiUrl, {
                    headers: {
                        'Authorization': `Bearer ${slackApiToken}`
                    }
                })

                if (!perpetratorResponse.data.ok) {
                    return res.status(400).send(perpetratorResponse.data)
                }
                const perpetratorUserID = perpetratorResponse.data.user.id
                await axios.post(process.env.WEBHOOK, {
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": `<@${perpetratorUserID}>\nyour victim has successfully finished a challenge!`
                            }
                        },
                    ]
                });
            }

        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    if(taskState === 'chicken'){

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
            const userID = response.data.user.id
            await axios.post(process.env.WEBHOOK, {
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `<@${userID}>, chickened out :chicken:!`
                        }
                    },
                ]
            });

            if (isValidEmail(contactInfo)) {
                const perpetratorSlackApiUrl = `https://slack.com/api/users.lookupByEmail?email=${contactInfo}`;
                const perpetratorResponse = await axios.get(perpetratorSlackApiUrl, {
                    headers: {
                        'Authorization': `Bearer ${slackApiToken}`
                    }
                })

                if (!perpetratorResponse.data.ok) {
                    return res.status(400).send(perpetratorResponse.data)
                }
                const perpetratorUserID = perpetratorResponse.data.user.id
                await axios.post(process.env.WEBHOOK, {
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": `<@${perpetratorUserID}>\nyour victim has chickened out :chicken:!`
                            }
                        },
                    ]
                });
            }

        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    req.broadcastEventById(formattedDonation._id, formattedDonation)
    res.status(200).json(formattedDonation)
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}



module.exports = {
    createDonation, getDonations, getDonation, deleteDonation, updateDonation
}