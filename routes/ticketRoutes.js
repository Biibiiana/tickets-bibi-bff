const express = require("express");
const router = express.Router();
const Ticket = require("../models/Tickets");
const Concert = require("../models/Concert");
const TicketsController = require("../controllers/tickets.controller");

// Obtener tickets por usuario
router.get("/", async (req, res) => {
    try {
        const userId = req.query.user_id;
        const tickets = await Ticket.find({ user_id: userId });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Crear ticket
router.post("/", async (req, res) => {
  const session = await Ticket.startSession();
  try {
    session.startTransaction();

    // Intentar actualizar el stock y crear el ticket en una sola operación
    const concert = await Concert.findOneAndUpdate(
      {
        _id: req.body.concert_id,
        stock: { $gte: req.body.quantity },
      },
      {
        $inc: { stock: -req.body.quantity },
        $set: { updatedAt: new Date() },
      },
      {
        session,
        new: true,
        runValidators: true,
      }
    );

    // Si no hay concierto o el stock es insuficiente, concert será null
    if (!concert) {
      throw new Error("No hay suficientes entradas disponibles");
    } else {
      // Solo crear el ticket si la actualización del stock fue exitosa
      const ticket = new Ticket({
        user_id: req.body.user_id,
        concert_id: req.body.concert_id,
        quantity: req.body.quantity,
      });

      await ticket.save({ session });
      res.status(200).json(ticket);
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

router.post('/pdf/:ticketId', async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const ticketData = req.body;

    // Validar que el ticket existe
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ 
        error: 'El ticket no existe' 
      });
    }

    // Generar el PDF
    const pdfBuffer = await TicketsController.generateTicketPDF({
      ...ticketData,
      ticketId: ticket._id
    });

    // Enviar la respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${ticketId}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error en endpoint /pdf:', error);
    res.status(500).json({ 
      error: 'Error al generar el PDF' 
    });
  }
});

module.exports = router;
