const express = require('express');
const router = express.Router();
const eventCtrl = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.get('/new', auth, auth.isAdmin, eventCtrl.getCreateForm);
router.post('/', auth, auth.isAdmin, eventCtrl.createEvent);
router.get('/:id/edit', auth, auth.isAdmin, eventCtrl.getEditForm);
router.put('/:id', auth, auth.isAdmin, eventCtrl.updateEvent);
router.delete('/:id', auth, auth.isAdmin, eventCtrl.deleteEvent);

router.get('/:id', eventCtrl.getEventDetails);



module.exports = router;