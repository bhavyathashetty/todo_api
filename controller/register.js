

const getUsers = (req, res, db) => {
  db.query(`select * from users`)
    .then(user => {
      res.json(user.rows)
    })
    .catch(err => res.status(400).json('unable to get user'))

}

const handleRegister = (req, res, db, bcrypt) => {
  const { useremail, username, userpassword } = req.body;
  if (!useremail || !username || !userpassword) {
    return res.status(400).json('incorrect form submission')
  }
  const hash = bcrypt.hashSync('userpassword', 8);
  db.query(`INSERT INTO users(username,useremail,userpassword) VALUES($1,$2,$3) RETURNING *`,
    [username, useremail, hash]
  )
    .then(user => {
      res.json(user.rows[0])
    })
    .catch(err => res.status(400).json('unable to register'))
}

const  handleSignin =  (req, res, db, bcrypt) => {
  const { signInEmail, signInPassword } = req.body;
  if (!signInEmail || !signInPassword) {
    return res.status(400).json('incorrect form submission')
  }
  db.query(`SELECT userpassword,useremail FROM users where useremail='${signInEmail}'`)
    .then(data => {
      // const hash = bcrypt.hashSync('signInPassword',8);
      const isValid = bcrypt.compare(signInPassword, data.rows[0].userpassword);
      
      if (isValid) {
        return db.query(`SELECT * FROM users WHERE useremail='${signInEmail}'`)

          .then(user => {
            res.json(user.rows[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong input credentials')
      }
    }
    )
    .catch(err => res.status(400).json('wrong credentials'))
}

const handleAddTodo = (req, res, db) => {
  const { todo, todouserid } = req.body;
  db.query(`INSERT INTO todos(todo,todouserid) VALUES ($1,$2) RETURNING *`, [todo, todouserid])
    .then(user => {
      res.json(user.rows[0])
    })
    .catch(err => res.status(400).json('unable to add todo'))
}


const handleGetTodo=(req,res,db)=>{
  const {userid} = req.params;
  db.query(`SELECT id,todo FROM todos where todouserid='${userid}'ORDER BY id ASC`)
  .then(user => {
  res.json(user.rows)
  })
  .catch(err => res.status(400).json('unable to get todos'))
}


const handleEditTodo=(req,res,db)=>{
  const {id} = req.body;
  const {todo} = req.body;
  db.query(`UPDATE todos SET todo='${todo}' WHERE id = '${id}' RETURNING * `)
  
  .then(user=>res.json(user.rows))
  .catch(err => res.status(400).json('unable to update todo'))
}


const handleDeleteTodo=(req,res,db)=>{
  const {id}=req.body;
  db.query(`DELETE from todos where id='${id}' `)
  .then(user=>res.json(user.rows))
  .catch(err => res.status(400).json('unable to delete todo'))
}


module.exports = {
  getUsers: getUsers,
  handleRegister: handleRegister,
  handleSignin: handleSignin,
  handleAddTodo:handleAddTodo,
  handleGetTodo:handleGetTodo,
  handleEditTodo:handleEditTodo,
  handleDeleteTodo:handleDeleteTodo
}