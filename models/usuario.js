const mongoose = require('mongoose');

let usuarioSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minLength: 5
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    }
});

let Usuario = mongoose.model('usuarios', usuarioSchema);
module.exports = Usuario;