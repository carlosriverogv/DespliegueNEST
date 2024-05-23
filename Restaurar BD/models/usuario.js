/* Esquema y modelo acerca de los usuarios autorizados */

const mongoose = require("mongoose");

let usuarioSchema = new mongoose.Schema ({

    /* login */
    login: {
            type: String,
            required: true,
            trim: true,
            minlength: 5
    },
    /* password */
    password: {
        type: String,
        required: true,
        minlength: 8
    }
});

let Usuario = mongoose.model('usuarios', usuarioSchema);

module.exports = Usuario;