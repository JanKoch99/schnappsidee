const express = require('express')
const Donation = require('../models/donationModel')
const {createDonation, getDonations, getDonation, deleteDonation, updateDonation} = require("../controllers/donationController");

const router = express.Router()

// require auth for all workout routes
// GET all workouts
router.get('/' , getDonations)

// GET a single workout
router.get('/:id', getDonation)

// POST a new workout
router.post('/', createDonation)

// DELETE a new workout
router.delete('/:id', deleteDonation)

// UPDATE a new workout
router.patch('/:id', updateDonation)

module.exports = router