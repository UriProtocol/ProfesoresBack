const mysql = require('mysql2')
const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const bcrypt = require('bcrypt')
const fileUpload = require('express-fileupload')
const jwt = require('jsonwebtoken')

const app = express()
const port = 5000
const saltRounds = 10
const myPlainTextPassword = 's0/\/\P4$$w0rD'

app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'tutorias2',
    password: ''
})

app.get('/', (req,res) =>{
    res.send('Hola mundo')
})
app.post('/profesores/agregar', (req, res) =>{
    const {
    clave,
    nombre,
    apellidos,
    fNacimiento,
    email,
    sexo,
    estadoCivil,
    tCasa,
    curp,
    tCelular,
    calle,
    colonia,
    cp,
    municipio,
    estado,
    pass
    } = req.body

    bcrypt.hash(pass, saltRounds, (err, hash) =>{
        const sql = "INSERT INTO profesores (clave, nombres, apellidos, fnacimiento, email, sexo, estadocivil, tcasa, curp, tcelular, calle, colonia, cp, municipio, estado, pass, estatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
        db.query(sql, [clave, nombre, apellidos, fNacimiento, email, sexo, estadoCivil, tCasa, curp, tCelular, calle, colonia, cp, municipio, estado, hash, 'inactivo'], (err, result) =>{
            if(err){
                res.send({
                    status: 100,
                    errNo: err.errno,
                    mensaje: err.message,
                    codigo: err.code
                })
            } else{
                res.send({
                    status: 200
                })
            }
        })
    })    
})

app.get('/profesores', (req, res) =>{
    const sql = 'SELECT * FROM profesores'
    db.query(sql, (err, result, fields) =>{
        if(!err){
            res.send({
                status: 200,
                result,
            })
        }else{
                res.send({
                    status: 400,
                    result: {}
                })
            }
    })
})
app.put('/profesores/modificar', (req, res) =>{
  const {clave, nombres, apellidos, fnacimiento, email, sexo, estadocivil, tcasa, curp, tcelular, calle, colonia, cp, municipio, estado} = req.body
  const sql = 'UPDATE profesores set nombres=?, apellidos=?, fnacimiento=?, email=?, sexo=?, estadocivil=?, tcasa=?, curp=?, tcelular=?, calle=?, colonia=?, cp=?, municipio=?, estado=? WHERE clave=?'
  db.query(sql, [nombres, apellidos, fnacimiento, email, sexo, estadocivil, tcasa, curp, tcelular, calle, colonia, cp, municipio, estado, clave], (err, result) =>{
    if(!err){
        res.send({
            status: 200,
            result,
        })
    }else{
            res.send({
                status: 400,
                result: {}
            })
        }
  })

})
app.get('/profesor/:clave',(req, res) =>{
    const {clave} = req.params
    const sql = 'SELECT * FROM profesores where clave = ?'
    db.query(sql, [clave], (err, result) =>{
        if(!err){
            res.send({
                status: 200,
                result,
            })
        }else{
                res.send({
                    status: 400,
                    result: {}
                })
            }
      })
})

app.get('/profesor/eliminar/:clave', (req, res) =>{
    const {clave} = req.params
    const sql = 'DELETE FROM profesores WHERE clave=?'
    db.query(sql, [clave], (err, result) =>{
        if(!err){
            res.send({
                status: 200,
                result,
            })
        }else{
                res.send({
                    status: 400,
                    result: {}
                })
            }
      })
})

//------------CURRICULUMS----------------------------------------
//Post para la información del currículum
app.post('/curriculum/agregar', (req, res) =>{
    const { 
        clave,
        centroEducativo,
        ubicacionCentro,
        titulo,
        campoEstudio,
        graduacion,
        puesto,
        empleador,
        localidad,
        fInicio,
        fFinal,
        descripcion,
        nombres,
        apellidos,
        fNacimiento,
        email,
        sexo,
        tCasa,
        tCelular,
        calle,
        colonia,
        cp,
        competencias,
        hobbies,
        idiomas,
        cursos,
        actExtra,
        redSociales,
        valores

    } = req.body
    const sql = 'INSERT INTO curriculums values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'

    db.query(sql, [clave, centroEducativo, ubicacionCentro, titulo, campoEstudio, graduacion, puesto, empleador, localidad, fInicio, fFinal, descripcion, nombres, apellidos, fNacimiento, email, sexo, tCasa, tCelular, calle, colonia, cp, competencias, hobbies, idiomas, cursos, actExtra, redSociales, valores], (err, result) =>{
        if(err){
            res.send({
                status: 100,
                errNo: err.errno,
                mensaje: err.message,
                codigo: err.code
            })
        } else{
            res.send({
                status: 200
            })
        }
    })
})
//Cambiando el boolean del campo curriculum de la tabla profesores al crear o eliminar un curriculum
app.patch('/curriculum/profesor', (req, res) =>{
    const {clave, bool} = req.body
    const sql = 'UPDATE profesores set curriculum=? WHERE clave=?'
    db.query(sql, [bool, clave], (err, result) =>{
        if(err){
            res.send({
                status: 100,
                errNo: err.errno,
                mensaje: err.message,
                codigo: err.code
            })
        } else{
            res.send({
                status: 200
            })
        }

    })
})

//Eliminando el currículum
app.delete('/curriculum/eliminar/:clave', (req, res) =>{
    const {clave} = req.params
    const sql = 'DELETE FROM curriculums WHERE clave=?'
    db.query(sql, [clave], (err, result) =>{
        if(!err){
            res.send({
                status: 200,
                result,
            })
        }else{
                res.send({
                    status: 400,
                    result: {}
                })
            }
      })

})
//Obtener solu un currículum
app.get('/curriculum/ver/:clave', (req,res) =>{
    const {clave} = req.params
    const sql = 'SELECT * FROM curriculums WHERE clave = ?'
    db.query(sql, [clave], (err, result) =>{
        if(!err){
            res.send({
                status: 200,
                result,
            })
        }else{
                res.send({
                    status: 400,
                    result: {}
                })
            }
      })
})

//Actualizar la información del currículum
app.put('/curriculum/modificar/:clave', (req, res) =>{
    const { 
        centroEducativo,
        ubicacionCentro,
        titulo,
        campoEstudio,
        graduacion,
        puesto,
        empleador,
        localidad,
        fInicio,
        fFinal,
        descripcion,
        nombres,
        apellidos,
        fNacimiento,
        email,
        sexo,
        tCasa,
        tCelular,
        calle,
        colonia,
        cp,
        competencias,
        hobbies,
        idiomas,
        cursos,
        actExtra,
        redSociales,
        valores
    } = req.body

    const {clave} = req.params

    const sql = 'UPDATE curriculums SET centroEducativo=?, ubicacionCentro=?, titulo=?, campoEstudio=?, graduacion=?, puesto=?, empleador=?, localidad=?, fInicio=?, fFinal=?, descripcion=?, nombres=?, apellidos=?, fNacimiento=?, email=?, sexo=?, tCasa=?, tCelular=?, calle=?, colonia=?, cp=?, competencias=?, hobbies=?, idiomas=?, cursos=?, actExtra=?, redSociales=?, valores=? WHERE clave=?'

    db.query(sql, [centroEducativo, ubicacionCentro, titulo, campoEstudio, graduacion, puesto, empleador, localidad, fInicio, fFinal, descripcion, nombres, apellidos, fNacimiento, email, sexo, tCasa, tCelular, calle, colonia, cp, competencias, hobbies, idiomas, cursos, actExtra, redSociales, valores, clave], (err, result) =>{
        if(err){
            res.send({
                status: 100,
                errNo: err.errno,
                mensaje: err.message,
                codigo: err.code
            })
        } else{
            res.send({
                status: 200
            })
        }
    })
})

//----------------Inicio de sesión----------------

app.get('/profesor/acceder', (req, res) =>{
    const {clave, password} = req.body

    const sql = 'SELECT * from profesores WHERE clave = ?'

    db.query(sql, [clave], (err, result) =>{
        if(err){
            return( res.send({
                    status: 500,
                    auth: false,
                    mensaje: 'Problemas con el servidor, contacte al administrador',
                    err
                })
            )
        }
        if(result.length > 0){
            bcrypt.compare(password, result[0].password, (error1, result1) =>{
                if(error1){
                    return(
                        res.send({
                            status: 102,
                            auth: false,
                            error1,
                            mensaje: 'Problemas con el servidor - contacte al administrador'
                        })
                    )
                }
                if(result1){
                    const clave = result[0].clave
                    const nombres = result[0].nombres
                    const apellidos = result[0].apellidos
                    const estatus = result[0].estatus
                    const foto = result[0].foto
                    const token = jwt.sign({clave}, myPlainTextPassword, {
                        expiresIn:"1 day",
                    })



                    return(
                        res.send({
                            status: 200,
                            auth: true,
                            resultado: {clave, nombres, apellidos, estatus, foto, token},
                            mensaje: 'Datos correctos'
                            
                        })
                    )
                }
            })
        }else{
            res.send({
                status: 404,
                mensaje: 'El usuario no existe'

            })
        }
    })


})

// -----------Actividades PTC-----------

app.post('/actividades/agregar/:clave', (req, res)=>{
    const {
        fecha,
        clases,
        duracion,
        materias,
        grupos,
        alumnos,
        horario,
        preparacion,
        revision,
        investigacion,
        administrativas,
    } = req.body
    const {clave} = req.params

    const sql = 'INSERT INTO actividades values(?,?,?,?,?,?,?,?,?,?,?,?,?)'

    db.query(sql, ['NULL',fecha, clases, materias, grupos, alumnos, horario, duracion, preparacion, revision, investigacion, administrativas, clave], (err, result) =>{
        if(err){
            res.send({
                status: 100,
                errNo: err.errno,
                mensaje: err.message,
                codigo: err.code
            })
        } else{
            res.send({
                status: 200
            })
        }
    })

})

app.patch('/actividades/modificar/:id', (req, res)=>{
    const {
        clases,
        duracion,
        materias,
        grupos,
        alumnos,
        horario,
        preparacion,
        revision,
        investigacion,
        administrativas,
    } = req.body
    const {id} = req.params

    const sql = 'UPDATE actividades SET clases=?, duracion=?, materias=?, grupos=?, alumnos=?, horario=?, preparacion=?, revision=?, investigacion=?, administrativas=? WHERE id=?'

    db.query(sql, [clases, duracion, materias, grupos, alumnos, horario, preparacion, revision, investigacion, administrativas, id], (err, result) =>{
        if(err){
            res.send({
                status: 100,
                errNo: err.errno,
                mensaje: err.message,
                codigo: err.code
            })
        } else{
            res.send({
                status: 200
            })
        }
    })

})

app.get('/actividades/ver/:clave', (req,res) =>{
    const {clave} = req.params
    const sql = 'SELECT * FROM actividades WHERE clave_profesor = ?'
    db.query(sql, [clave], (err, result) =>{
        if(!err){
            res.send({
                status: 200,
                result,
            })
        }else{
                res.send({
                    status: 400,
                    result: {}
                })
            }
      })
})


app.get('/actividades/ver/registro/:id', (req,res) =>{
    const {id} = req.params
    const sql = 'SELECT * FROM actividades WHERE id = ?'
    db.query(sql, [id], (err, result) =>{
        if(!err){
            res.send({
                status: 200,
                result,
            })
        }else{
                res.send({
                    status: 400,
                    result: {}
                })
            }
      })
})

app.delete('/actividades/eliminar/:id', (req,res) =>{
    const {id} = req.params
    const sql = 'DELETE FROM actividades WHERE id = ?'
    db.query(sql, [id], (err, result) =>{
        if(!err){
            res.send({
                status: 200,
                result,
            })
        }else{
                res.send({
                    status: 400,
                    result: {}
                })
            }
      })
})



app.all('*', (req,res) =>{
    res.send('Esta ruta no existe')
})

app.listen(port, ()=>{
    console.log(`Escuchando por el puerto ${port}`)
})