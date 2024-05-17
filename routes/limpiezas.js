// Servicios relacionados con las limpiezas

const express = require('express');

const auth = require(__dirname + '/../utils/auth.js');
const Limpieza = require(__dirname + '/../models/limpieza');
const Habitacion = require(__dirname + '/../models/habitacion');

let router = express.Router();

// SERVICIO: Renderizar las limpiezas de una habitación
router.get('/:id', (req, res) => {
    let limpiezas;

    Limpieza
    .find({habitacion: req.params.id})
    .sort('-fecha')
    .then(resultado => {
        if (resultado) {
            limpiezas = resultado;
            return Habitacion.findById(req.params.id);
        } else {
            res.render('error', {error: 'Error encontrando las limpiezas'});
        }
    })
    .then(resultado => {
        res.render('limpiezas/limpiezas_listado', {
            limpiezas: limpiezas, 
            habitacion: resultado
        });
    })
    .catch(() => {
        res.render('error', {error: 'No hay limpiezas registradas para esa habitación'});
    });
});

// SERVICIO: Renderizar el formulario para registrar una nueva limpieza
router.get('/nueva/:id', auth.autenticacion, (req, res) => {
    const fechaActual = new Date();
    Habitacion.findById(req.params.id)
    .then(resultado => {
        res.render('limpiezas/limpiezas_nueva', {
            habitacion: resultado, 
            fechaActual: fechaActual.toISOString().split('T')[0]
        });
    })
    .catch(() => {
        res.render('error', {error: 'No se ha podido obtener la habitación'});
    });
});

// SERVICIO: Actualizar el estado de una limpieza
router.post('/:id', auth.autenticacion, (req, res) => {
    const nuevaLimpieza = new Limpieza({
        habitacion: req.params.id,
        fecha: req.body.fecha,
        observaciones: req.body.observaciones
    });

    nuevaLimpieza.save()
    .then(resultado => {
        if (resultado) {
            Limpieza.find({habitacion: req.params.id}).sort('-fecha')
            .then(resultadoLimpieza => {
                Habitacion.findByIdAndUpdate(req.params.id, {ultimaLimpieza: resultadoLimpieza[0].fecha})
                .then(() => {
                    res.redirect('/limpiezas/' + req.params.id);
                })
                .catch(() => {res.render('error', {error: 'Error registrando limpieza'});});
            })
            .catch(() => {res.render('error', {error: 'Error registrando limpieza'});});
        } else {
            res.render('error', {error: 'Error registrando limpieza'});
        }
    })
    .catch(() => {
        res.render('error', {error: 'Error registrando limpieza'});
    });
});

module.exports = router;