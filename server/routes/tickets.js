const router = require('express').Router();
const { protect, organizer } = require('../middleware/auth');
const { bookTicket, getUserTickets, checkIn } = require('../controllers/ticketController');

router.post('/book', protect, bookTicket);
router.get('/my-tickets', protect, getUserTickets);
router.post('/checkin', protect, organizer, checkIn);

module.exports = router;