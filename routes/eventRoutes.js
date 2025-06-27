const express = require('express');
const router = express.Router();
const eventCtrl = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.get('/new', auth, eventCtrl.getCreateForm);
router.post('/', auth, eventCtrl.createEvent);
router.get('/:id', eventCtrl.getEventDetails);
router.get('/:id/edit', auth, eventCtrl.getEditForm);
router.put('/:id', auth, eventCtrl.updateEvent);
router.delete('/:id', auth, eventCtrl.deleteEvent);

module.exports = router;
