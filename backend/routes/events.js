const express = require('express');
const { getNewCreation, getUpdates } = require('../controllers/eventController');
const router = express.Router();


// Routes for SSE streams
router.get('/', getNewCreation);
router.get('/:id',getUpdates);

module.exports = router;
