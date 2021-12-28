const express = require("express");
const cors = require('cors')
const register = require('./controller/register')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const Pool = require('pg').Pool;

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors())


connectionString = {
    connectionString: DATABASE_URL,
    ssl: true
}

const db = new Pool(
    // host:'ec2-54-173-2-216.compute-1.amazonaws.com',
    // database:'dfouh8r5i0ie04',
    // user:'cpihfrkykcpseh',
    // port:5432
    // host:'localhost',
    // database:'todolist',
    // user:'todolist',
    // port:5432,
    // password:'test'
    connectionString


);




app.get('/users', (req, res) => { register.getUsers(req, res, db) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }
)

app.post('/signin', (req, res) => { register.handleSignin(req, res, db, bcrypt) })

app.get('/gettodos/:userid', (req, res) => {
    register.handleGetTodo(req, res, db)
})

app.post('/todo', (req, res) => {
    register.handleAddTodo(req, res, db)
})

app.put('/edittodo', (req, res) => {
    register.handleEditTodo(req, res, db)
})

app.delete('/deletetodo', (req, res) => {
    register.handleDeleteTodo(req, res, db)
})



app.get('/api', (req, res) => {
    res.json({ message: "hello server!" })
})



app.listen(PORT, () => {
    console.log(`server listens to port ${PORT}`)
});

