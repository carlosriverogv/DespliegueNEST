// Servicios relacionados con la autenticación

const express = require('express');

const Usuarios = require(__dirname + '/../models/usuario');

let router = express.Router();

// SERVICIO: Loguear a un usuario
router.post('/login', (req, res) => {
    Usuarios.findOne({login: req.body.login, password: req.body.password})
    .then(resultado => {
        if (resultado) {
            req.session.usuario = resultado;
            res.redirect('/');
        }
        else 
            throw new Error();
    }).catch(error => {
        res.render('login', {error: 'Usuario o contraseña incorrectos'})
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;