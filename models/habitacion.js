const mongoose = require('mongoose');

let incidenciaSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción de la incidencia es obligatoria']
    },
    imagen: {
        type: String,
    },
    inicio: {
        type: Date,
        required: [true, 'La fecha de inicio de la incidencia es obligatoria'],
        default: Date.now
    },
    fin: {
        type: Date
    }
});

let habitacionSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: [true, 'El número de habitación es obligatorio'],
        min: [1, 'El número de habitación debe ser mayor que 0'],
        max: [50, 'El número de habitación no puede ser mayor que 50']
    },
    tipo: {
        type: String,
        required: [true, 'El tipo de habitación es obligatorio'],
        enum: {
            values: ['individual', 'doble', 'familiar', 'suite'],
            message: 'El tipo de habitación no es válido'
        }
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción de la habitación es obligatoria']
    },
    imagen: {
        type: String,
    },
    ultimaLimpieza: {
        type: Date,
        required: [true, 'La fecha de la última limpieza es obligatoria'],
        default: Date.now
    },
    precio: {
        type: Number,
        required: [true, 'El precio de la habitación es obligatorio'],
        min: [0, 'El precio de la habitación no puede ser negativo'],
        max: [300, 'El precio de la habitación no puede ser mayor que 300']
    },
    incidencias: [incidenciaSchema]
});

let Habitacion = mongoose.model('habitaciones', habitacionSchema);
module.exports = Habitacion;