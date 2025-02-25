const express = require('express');
const { getRents} = require('../controllers/rents'); 

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');


router.route('/').get(protect, getRents)   
    

router.route('/:id')
   

module.exports = router;
