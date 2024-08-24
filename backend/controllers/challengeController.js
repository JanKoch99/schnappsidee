const Challenge = require('../models/challengeModel')
const mongoose = require('mongoose')
const axios = require("axios");
// get all workouts
const getChallenges = async (req,res) => {
    const challenges = await Challenge.find().sort({createdAt: -1})

    res.status(200).json(challenges)
}
// get a single challenge
const getChallenge = async (req,res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such challenge'})
    }

    const challenge = await Challenge.findById(id)

    if (!challenge) {
        return res.status(404).json({error: 'No such challenge'})
    }
    res.status(200).json(challenge)
}
// create new challenge
const createChallenge = async (req, res) => {
    let {task, difficulty} = req.body
    let emptyFields = []

    if(!task) {
        emptyFields.push('task')
    }
    if(!difficulty) {
        difficulty = 0
    }

    if(emptyFields.length > 0){
        return res.status(400).json({ error: "Please fill in all the fields", emptyFields })
    }
    //add doc to db
    try {
        const challenge = await Challenge.create({task, difficulty});
        res.status(200).json(challenge)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a challenge
const deleteChallenge = async (req,res) => {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such challenge'})
    }

    const challenge = await Challenge.findByIdAndDelete({_id: id})

    if (!challenge) {
        return res.status(404).json({error: 'No such challenge'})
    }
    res.status(200).json(challenge)
}
// update a challenge
const updateChallenge = async (req,res) =>{
    const id = req.params.id
    let {task, difficulty} = req.body


    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such challenge'})
    }


    const challenge = await Challenge.findOneAndUpdate({_id: id}, {
         task, difficulty
    })
    if (!challenge) {
        return res.status(404).json({error: 'No such challenge'})
    }



    res.status(200).json(challenge)
}



module.exports = {
    createChallenge, getChallenges, getChallenge, deleteChallenge, updateChallenge
}