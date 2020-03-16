const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const read = require('node-readability')
const app = express()
const { Todolist } = require('./db')
const port = process.env.PORT || 3000

app.set('port', port)
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res, next) => {
  Todolist.all((err, todos) => {
    if (err) return next(err)
    res.render('index', { todos })
  })
})

app.post('/add', (req, res, next) => {
  const { content } = req.body
  read(req.url, (err, result) => {
    if (err || !result) res.status(500).send('Server Error')
    Todolist.create({ content }, (err, todo) => {
      if (err) return next(err)
      res.send(todo)
    })
  })
})

app.delete('/delete/:id', (req, res, next) => {
  const { id } = req.params
  Todolist.delete(id, err => {
    if (err) return next(err)
    res.send({ message: 'Deleted' })
  })
})

app.listen(port, () => {
  console.log('server is runing at localhost:%s', port)
})