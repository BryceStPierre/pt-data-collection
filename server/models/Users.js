const bcrypt = require('bcrypt');

let db = require('../database');

class Users {
  static retrieveByUsername (username, callback) {
    db.query('SELECT * FROM app.users WHERE username = $1', [username], (err, res) => {
      if (err)
        return callback(err);
      callback(res ? res[0] : null);
    });
  }

  static retrieveById (id, callback) {
    db.query('SELECT * FROM app.users WHERE id = $1', [id], (err, res) => {
      if (err)
        return callback(err);
      callback(res ? res[0] : null);
    });
  }

  static update (username, callback) {
    db.query('UPDATE app.users SET last_login = clock_timestamp() WHERE username = $1', [username], (err, res) => {
      if (err)
        return callback(err);
      callback(res ? res[0] : null);
    });
  }
}

module.exports = Users;