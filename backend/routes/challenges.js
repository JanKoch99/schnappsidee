const express = require('express')
const Challenge = require('../models/challengeModel')
const {createChallenge, getChallenge, getChallenges, updateChallenge, deleteChallenge} = require("../controllers/challengeController");

const router = express.Router()

// require auth for all workout routes
// GET all workouts
router.get('/' , getChallenges)

// GET a single workout
router.get('/:id', getChallenge)

// POST a new workout
router.post('/', createChallenge)

// DELETE a new workout
router.delete('/:id', deleteChallenge)

// UPDATE a new workout
router.patch('/:id', updateChallenge)

module.exports = router