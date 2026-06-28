const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const qrcode = require('qrcode');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const transporter = require('../config/email');
const { bookingConfirmationEmail } = require('../utils/emailTemplates');

exports.bookTicket = async (req, res) => {
  try {
    const { eventId, tierName } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const tier = event.ticketTiers.find(t => t.name === tierName);
    if (!tier || tier.bookedSeats >= tier.totalSeats)
      return res.status(400).json({ message: 'No seats available' });

    // Stripe payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: tier.price * 100,
      currency: 'inr',
      payment_method_types: ['card'],
    });

    // Generate QR
    const qrToken = crypto.randomBytes(20).toString('hex');
    const qrCode = await qrcode.toDataURL(qrToken);

    // Create ticket
    const ticket = await Ticket.create({
      event: eventId,
      user: req.user._id,
      tierName,
      price: tier.price,
      qrCode,
      qrToken,
      paymentId: paymentIntent.id,
    });

    // Update seat count
    await Event.updateOne(
      { _id: eventId, 'ticketTiers.name': tierName },
      { $inc: { 'ticketTiers.$.bookedSeats': 1 } }
    );

    // Send confirmation email
    try {
      const emailContent = bookingConfirmationEmail(ticket, event, req.user);
      await transporter.sendMail({
        from: `"EventHub 🎟️" <${process.env.EMAIL_USER}>`,
        to: req.user.email,
        subject: emailContent.subject,
        html: emailContent.html,
      });
      console.log(`✅ Email sent to ${req.user.email}`);
    } catch (emailErr) {
      console.log('⚠️ Email failed (ticket still created):', emailErr.message);
    }

    res.status(201).json({ ticket, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id }).populate('event');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const { qrToken } = req.body;
    const ticket = await Ticket.findOne({ qrToken }).populate('event user');
    if (!ticket) return res.status(404).json({ message: 'Invalid QR code' });
    if (ticket.status === 'checked-in')
      return res.status(400).json({ message: 'Already checked in', ticket });
    ticket.status = 'checked-in';
    ticket.checkedInAt = new Date();
    await ticket.save();
    res.json({ message: 'Check-in successful!', ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};