const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('todolist')

db.serialize(() => {
  const sql = `CREATE TABLE IF NOT EXISTS todolist (id integer primary key, content TEXT)`
  db.run(sql)
})

class Todolist {
  static all (cb) {
    db.all('SELECT * FROM todolist ORDER BY id DESC', cb)
  }

  static create (todo, cb) {
    const sql = 'INSERT INTO todolist(content) VALUES (?)'
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
    db.run('DELETE FROM todolist WHERE id = ?', id, cb)
  }
}

module.exports = {
  db,
  Todolist
}

