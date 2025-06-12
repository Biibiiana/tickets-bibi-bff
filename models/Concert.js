const mongoose = require('mongoose');
const concertSchema = new mongoose.Schema({
    tourName: { type: String, required: true },
    artist: { type: String, required: true },
    description: { type: String, required: true },
    gender: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    poster: { type: String, required: true },
    date: { type: Date, required: true },
    city: { type: String, required: true }
});

// Aquí va el transform
concertSchema.set('toJSON', {
    transform: function(doc, ret) {
        ret.date = new Date(ret.date).toISOString();
        return ret;
    }
});

// Y aquí se crea el modelo
module.exports = mongoose.model('Concert', concertSchema);