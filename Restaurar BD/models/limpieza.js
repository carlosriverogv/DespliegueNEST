/* Esquema y modelo acerca de las limpiezas realizadas por habitación */

const mongoose = require("mongoose");

let limpiezaSchema = new mongoose.Schema ({

    /* referencia de la habitación */
    habitacion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'habitaciones'
    },
    /* fecha de la limpieza */
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    /* observaciones sobre la limpieza */
    observaciones: {
        type: String,
        trim: true,
        required: false,        
    }
});

let Limpieza = mongoose.model('limpiezas', limpiezaSchema);

module.exports = Limpieza;