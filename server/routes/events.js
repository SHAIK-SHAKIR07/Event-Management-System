const router = require('express').Router();
const { protect, organizer } = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const {
  createEvent, getEvents, getEventById,
  getMyEvents, updateEvent, deleteEvent, getAnalytics
} = require('../controllers/eventController');

// Image upload
router.post('/upload-image', protect, organizer, upload.single('banner'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'eventhub', transformation: [{ width: 1200, height: 600, crop: 'fill' }] },
        (error, result) => { if (error) reject(error); else resolve(result); }
      ).end(req.file.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', getEvents);
router.get('/analytics', protect, organizer, getAnalytics);
router.get('/my-events', protect, organizer, getMyEvents);
router.get('/:id', getEventById);
router.post('/', protect, organizer, createEvent);
router.put('/:id', protect, organizer, updateEvent);
router.delete('/:id', protect, organizer, deleteEvent);

module.exports = router;