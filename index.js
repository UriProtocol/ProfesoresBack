const mysql = require('mysql2')
const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const bcrypt = require('bcrypt')
const fileUpload = require('express-fileupload')

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
    database: 'tutorias',
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
    estado
    } = req.body

    const sql = "INSERT INTO profesores (clave, nombres, apellidos, fnacimiento, email, sexo, estadocivil, tcasa, curp, tcelular, calle, colonia, cp, municipio, estado, estatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    db.query(sql, [clave, nombre, apellidos, fNacimiento, email, sexo, estadoCivil, tCasa, curp, tCelular, calle, colonia, cp, municipio, estado, 'inactivo'], (err, result) =>{
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

//Post para la información del currículum
app.post('/curriculum/agregar', (req, res) =>{
    const { 
        clave,
        centroEducativo,
        ubicacionCentro,
        titulo,
        campoEstudio,
        fechaGraduacion
    } = req.body
    const sql = 'INSERT INTO curriculums values(?,?,?,?,?,?)'

    db.query(sql, [clave, centroEducativo, ubicacionCentro, titulo, campoEstudio, fechaGraduacion], (err, result) =>{
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

app.all('*', (req,res) =>{
    res.send('Esta ruta no existe')
})

app.listen(port, ()=>{
    console.log(`Escuchando por el puerto ${port}`)
})