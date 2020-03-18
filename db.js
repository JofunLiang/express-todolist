const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('todos.sqlite')

db.serialize(() => {
  const sql = `CREATE TABLE IF NOT EXISTS todos (id integer primary key, content TEXT)`
  db.run(sql)
})

class Todolist {
  static all (cb) {
    db.all('SELECT * FROM todos ORDER BY id DESC', cb)
  }

  static create (todo, cb) {
    const sql = 'INSERT INTO todos(content) VALUES (?)'
    db.run(sql, todo.content, err => {
      if (err) return cb(err)
      db.all('SELECT LAST_INSERT_ROWID()', (err, data) => {
        if (err) return cb(err)
        const id = data[0]['LAST_INSERT_ROWID()']
        cb(err, { id, content: todo.content })
      })
    })
  }

  static delete (id, cb) {
    if (!id) return cb(new Error('Please provide an id.'))
    db.run('DELETE FROM todos WHERE id = ?', id, cb)
  }
}

module.exports = {
  db,
  Todolist
}

