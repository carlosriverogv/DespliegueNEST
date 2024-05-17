// Servicios relacionados con las habitaciones

const express = require('express');

const upload = require(__dirname + '/../utils/uploads.js');
const auth = require(__dirname + '/../utils/auth.js');
const Habitacion = require(__dirname + '/../models/habitacion');

let router = express.Router();

// SERVICIO: Renderizar un listado de todas las habitaciones
router.get('/', (_req, res) => {
    Habitacion.find().sort('numero')
    .then(async resultado => {
        if (resultado) {
            const habitacionesConImagen = await Habitacion.find({imagen: {$ne: null}});
            res.render('habitaciones/habitaciones_listado', {
                habitaciones: resultado,
                habitacionesConImagen: habitacionesConImagen
            });
        } else {
            res.render('error', {error: 'Error obteniendo las habitaciones'});
        }
    }).catch(() => {
        res.render('error', {error: 'Error obteniendo las habitaciones'});
    });
});

// SERVICIO: Renderizar formulario para añadir una nueva habitación
router.get('/nueva', auth.autenticacion, (_req, res) => {
    res.render('habitaciones/habitaciones_nueva', {edicion: false});
});

// SERVICIO: Renderizar formulario para editar una habitación
router.get('/editar/:id', auth.autenticacion, (req, res) => {
    Habitacion.findById(req.params.id)
    .then(resultado => {
        if (resultado)
            res.render('habitaciones/habitaciones_nueva', {datos: resultado, edicion: true});
        else
            res.render('error', {error: 'No existe el número de habitación'});
    })
    .catch(() => {
        res.render('error', {error: 'No existe el número de habitación'});
    });
});

// SERVICIO: Obtener detalles de una habitación específica
router.get('/:id', (req, res) => {
    Habitacion.findById(req.params.id)
    .then(resultado => {
        if (resultado)
            res.render('habitaciones/habitaciones_ficha', {habitacion: resultado});
        else
            res.render('error', {error: 'No existe el número de habitación'});
    })
    .catch(() => {
        res.render('error', {error: 'No existe el número de habitación'});
    });
});

// SERVICIO: Insertar una habitación
router.post('/', auth.autenticacion, upload.uploadHab.single('imagen'), (req, res) => {
    // Creación de una nueva habitación los datos del cuerpo de la petición
    const nuevaHabitacion = new Habitacion({
        numero: req.body.numero,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        ultimaLimpieza: Date.now(),
        precio: req.body.precio
    });
    if (req.file) {
        nuevaHabitacion.imagen = req.file.filename;
    }

    nuevaHabitacion.save()
    .then(resultado => {
        if (resultado) {
            res.redirect('/habitaciones');
        } else {
            res.render('error', {error: 'Error insertando habitación'});
        }
    })
    .catch((error) => {
        let errores = {
            general: 'Error insertando habitación'
        };

        if(error.errors.numero)
            errores.numero = error.errors.numero.message;
        if(error.errors.descripcion)
            errores.descripcion = error.errors.descripcion.message;
        if(error.errors.precio)
            errores.precio = error.errors.precio.message;
        if(error.errors.tipo)
            errores.tipo = error.errors.tipo.message;

        res.render('habitaciones/habitaciones_nueva', {
            errores: errores, 
            datos: req.body, 
            edicion: false
        });
    });
});

// SERVICIO: Actualizar una habitación
router.post('/:id', auth.autenticacion, upload.uploadHab.single('imagen'), (req, res) => {
    // Actualización de los campos con los datos del cuerpo de la petición
    let nuevosDatos = {
        numero: req.body.numero,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        ultimaLimpieza: req.body.ultimaLimpieza,
        precio: req.body.precio,
    }

    if (req.file) {
        nuevosDatos.imagen = req.file.filename;
    }

    Habitacion.findByIdAndUpdate(req.params.id, {$set: nuevosDatos}, 
        {new: true, runValidators: true})
    .then(resultado => {
        if (resultado) {
            res.redirect('/habitaciones/' + req.params.id);	
        } else {
            res.render('error', {error: 'Error actualizando habitación'})
        }
    })
    .catch((error) => {
        let errores = {
            general: 'Error actualizando habitación'
        };

        if(error.errors.numero)
            errores.numero = error.errors.numero.message;
        if(error.errors.descripcion)
            errores.descripcion = error.errors.descripcion.message;
        if(error.errors.precio)
            errores.precio = error.errors.precio.message;
        if(error.errors.tipo)
            errores.tipo = error.errors.tipo.message;

        res.render('habitaciones/habitaciones_nueva', {
            errores: errores, 
            datos: req.body, 
            edicion: true
        });
    });
});

// SERVICIO: Eliminar una habitación
router.delete('/:id', auth.autenticacion, (req, res) => {
    Habitacion.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if (resultado)
            res.redirect('/habitaciones');
        else
            res.render('error', {error: 'Error eliminando la habitación'});
    })
    .catch(() => {
        res.render('error', {error: 'Error eliminando la habitación'});
    });
});

// SERVICIO: Añadir una incidencia en una habitación
router.post('/:id/incidencias', auth.autenticacion, upload.uploadInc.single('imagen'), (req, res) => {
    Habitacion.findById(req.params.id)
    .then(resultado => {
        // Añadimos la incidencia con los datos de la petición
        let incidencia = {
            descripcion: req.body.descripcion,
            inicio: Date.now()
        };
        if (req.file) {
            incidencia.imagen = req.file.filename;
        }
        resultado.incidencias.push(incidencia);

        // Guardamos el resultado
        resultado.save().then(resultadoFinal => {
            if (resultadoFinal)
                res.redirect('/habitaciones/' + req.params.id);
            else
                res.render('error', {error: 'Error añadiendo la incidencia'});
        }).catch(() => {
            res.render('error', {error: 'Error añadiendo la incidencia'});
        });
    })
    .catch(() => {
        res.render('error', {error: 'Error añadiendo la incidencia'});
    });
});

// SERVICIO: Actualizar el estado de una incidencia de una habitación
router.put('/:idHab/incidencias/:idInc', auth.autenticacion, (req, res) => {
    Habitacion.findById(req.params.idHab)
    .then(resultado => {
        // Buscamos sobre todas las incidencias del resultado
        let encontrado = false;
        for(let i = 0; i < resultado.incidencias.length && !encontrado; i++) {
            // Cuando encontramos la incidencia con el id, actualizamos fecha
            if (resultado.incidencias[i]._id == req.params.idInc) {
                resultado.incidencias[i].fin = Date.now()
                encontrado = true; // Para salir del bucle
            }
        }

        resultado.save().then(resultadoFinal => {
            if (resultadoFinal)
                res.redirect('/habitaciones/' + req.params.idHab);
            else
                res.render('error', {error: 'Error cerrando la incidencia'});
        }).catch(() => {
            res.render('error', {error: 'Error cerrando la incidencia'});
        });
    })
    .catch(() => {
        res.render('error', {error: 'Error cerrando la incidencia'});
    });
});

module.exports = router;