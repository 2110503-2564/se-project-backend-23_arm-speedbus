const express = require('express');
const {getAuditLogs, getAuditLog} = require('../controllers/auditLogController');
const {protect, authorize} = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, authorize('admin'), getAuditLogs);
router.route('/:id').get(protect, authorize('admin'), getAuditLog);

module.exports = router;