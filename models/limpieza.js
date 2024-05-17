const mongoose = require('mongoose');

let limpiezaSchema = new mongoose.Schema({
    habitacion: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'La habitación es obligatoria'],
        ref: 'habitaciones'
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha de la limpieza es obligatoria'],
        default: Date.now
    },
    observaciones: {
        type: String
    }
});

let Limpieza = mongoose.model('limpiezas', limpiezaSchema);
module.exports = Limpieza;