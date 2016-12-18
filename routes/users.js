var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var jwt = require('../jwt');

router.post('/login', function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let encPassword = crypto.createHash('md5').update(password).digest('hex');

   req.pool.getConnection((err, conn) => {
      if (err) {
        // error
        res.send({ ok: false, error: err });
      } else {
        let sql = `SELECT * FROM users WHERE username=? AND password=?`;
        conn.query(sql, [username, encPassword], function (err, rows) {
          if (err) {
            // error
            res.send({ ok: false, error: err });
          } else {
            if (rows.length) {
              let playload = { userId: rows[0].id };
              let token = jwt.sign(playload);
              res.send({ ok: true, token: token });
            } else {
              res.send({ ok: false, message: 'Username/Password invalid' });
            }
          }
        });
        // close connection
        conn.release()
      }
    });
});

module.exports = router;
