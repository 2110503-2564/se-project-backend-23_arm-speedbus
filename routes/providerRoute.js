const express = require('express');
const {getProviders, getProvider, createProvider, updateProvider, deleteProvider} = require('../controllers/providerController');
const {protect, authorize} = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getProviders).post(protect, authorize('admin'), createProvider);
router.route('/:id').get(getProvider).put(protect, authorize('admin'), updateProvider).delete(protect, authorize('admin'), deleteProvider);
module.exports = router;