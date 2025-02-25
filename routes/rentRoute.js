const express = require('express');
const { getRents, addRent } = require('../controllers/rents');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getRents)  
    .post(protect, authorize('user'), addRent); 

router.route('/:id')
    .get(protect, getRent);


module.exports = router;