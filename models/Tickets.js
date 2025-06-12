  const mongoose = require('mongoose');

  const ticketSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    concert_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Concert', required: true },
    quantity: { type: Number, required: true },
    purchase_date: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('Ticket', ticketSchema);