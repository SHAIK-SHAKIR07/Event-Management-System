const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, organizer: req.user._id });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const {
      category, city, search,
      minPrice, maxPrice,
      date, sortBy,
      page = 1, limit = 12
    } = req.query;

    const query = { status: 'published' };
    if (category) query.category = category;
    if (city) query['venue.city'] = new RegExp(city, 'i');
    if (search) query.title = new RegExp(search, 'i');
    if (date) query.date = { $gte: new Date(date) };
    if (minPrice || maxPrice) {
      query['ticketTiers'] = {
        $elemMatch: {
          price: {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) })
          }
        }
      };
    }

    const sortOptions = {
      'date-asc': { date: 1 },
      'date-desc': { date: -1 },
      'price-asc': { 'ticketTiers.0.price': 1 },
      'price-desc': { 'ticketTiers.0.price': -1 },
      'popular': { views: -1 },
    };
    const sort = sortOptions[sortBy] || { date: 1 };

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizer', 'name')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sort);

    res.json({ events, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    event.views += 1;
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get organizer's own events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const updated = await Event.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    // Cancel all tickets for this event
    await Ticket.updateMany(
      { event: req.params.id },
      { status: 'cancelled' }
    );

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id });
    const eventIds = events.map(e => e._id);
    const tickets = await Ticket.find({ event: { $in: eventIds } });
    res.json({
      totalEvents: events.length,
      totalTicketsSold: tickets.length,
      totalRevenue: tickets.reduce((sum, t) => sum + t.price, 0),
      checkedIn: tickets.filter(t => t.status === 'checked-in').length,
      byEvent: events.map(event => ({
        name: event.title,
        sold: tickets.filter(t => t.event.equals(event._id)).length,
        revenue: tickets.filter(t => t.event.equals(event._id))
          .reduce((sum, t) => sum + t.price, 0),
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};