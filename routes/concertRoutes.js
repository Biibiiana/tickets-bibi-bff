const express = require("express");
const router = express.Router();
const Concert = require("../models/Concert");

// Obtener todos los conciertos
router.get("/", async (req, res) => {
  try {
    const concerts = await Concert.find();
    res.json(concerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener conciertos ordenados por género
router.get("/sort/genre", async (req, res) => {
  try {
    const concerts = await Concert.find().sort({ gender: 1 });
    res.json(concerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener conciertos ordenados por artista
router.get("/sort/artist", async (req, res) => {
  try {
    const concerts = await Concert.find().sort({ artist: 1 });
    res.json(concerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener conciertos ordenados por ciudad
router.get("/sort/city", async (req, res) => {
  try {
    const concerts = await Concert.find().sort({ city: 1 });
    res.json(concerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un concierto por ID
router.get("/byId/:id", async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if (!concert) {
      return res.status(404).json({ message: "Concierto no encontrado" });
    }

    // Convertir la fecha de MongoDB a formato JavaScript
    const concertData = {
      ...concert.toObject(),
      date: new Date(concert.date),
    };

    res.json(concertData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo concierto
router.post("/", async (req, res) => {
  const concert = new Concert(req.body);
  try {
    const newConcert = await concert.save();
    res.status(201).json(newConcert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Editar un concierto
router.put("/:id", async (req, res) => {
  try {
    const updatedConcert = await Concert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedConcert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un concierto
router.delete("/:id", async (req, res) => {
  try {
    await Concert.findByIdAndDelete(req.params.id);
    res.json({ message: "Concierto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
