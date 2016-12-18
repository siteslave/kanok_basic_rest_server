var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ ok: true, message: 'Hello' });
});
// /hello?name=John Doe&name2=Bill Gate
// req.query.name
// req.query.name2

router.get('/hello', function (req, res, next) {
  let friends = ['Bill Gate', 'John Doe'];
  // application/json
  res.send({ friends: friends });
});
// /hello/xxxx
// req.params.name
router.get('/hello/:name/:name2', function (req, res, next) {
  let name = req.params.name;
  let name2 = req.params.name2;
  res.send({ message: 'Hello, ' + name });
});

router.post('/hello', function (req, res, next) {
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;

  let message = `Hello, 
  Name is: ${first_name}`;

  let message2 = 'Hello ' +
    ' Name is: ' + first_name;
  
  res.send({ message: message });
});

router.get('/customers', function(req, res, next) {
   req.pool.getConnection((err, conn) => {
      if (err) {
        // error
        res.send({ ok: false, error: err });
      } else {
        let sql = `select c.id, c.first_name, c.last_name, t.name as customer_type
                  from customers as c
                  left join customer_types as t on t.id=c.customer_type_id`;
        conn.query(sql, [], function (err, rows) {
          if (err) {
            // error
            res.send({ ok: false, error: err });
          } else {
            // success
            res.send({ ok: true, rows: rows });
          }
        });
        // close connection
        conn.release()
      }
    });
});

router.post('/customers', function (req, res, next) {
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let telephone = req.body.telephone;
  let email = req.body.email;
  let customer_type_id = req.body.customer_type_id;

   req.pool.getConnection((err, conn) => {
      if (err) {
        // error
        res.send({ ok: false, error: err });
      } else {
        let sql = `INSERT INTO customers(first_name, last_name, telephone, email, customer_type_id)
        VALUES(?, ?, ?, ?, ?)
        `;
        conn.query(sql, [first_name, last_name, telephone, email, customer_type_id], function (err, rows) {
          if (err) {
            // error
            res.send({ ok: false, error: err });
          } else {
            // success
            res.send({ ok: true });
          }
        });
        // close connection
        conn.release()
      }
    });
});

router.put('/customers', function (req, res, next) {
  let id = req.body.id;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let telephone = req.body.telephone;
  let email = req.body.email;
  let customer_type_id = req.body.customer_type_id;
  console.log(req.body);
   req.pool.getConnection((err, conn) => {
      if (err) {
        // error
        res.send({ ok: false, error: err });
      } else {
        let sql = `UPDATE customers 
        SET first_name=?,
        last_name=?, 
        telephone=?, 
        email=?, 
        customer_type_id=?
        WHERE id=?
        `;
        conn.query(sql, [
          first_name,
          last_name,
          telephone,
          email,
          customer_type_id,
          id
        ], function (err, rows) {
          if (err) {
            // error
            res.send({ ok: false, error: err });
          } else {
            // success
            res.send({ ok: true });
          }
        });
        // close connection
        conn.release()
      }
    });
});

router.delete('/customers/:id', function (req, res, next) {
  let id = req.params.id;

  req.pool.getConnection((err, conn) => {
    if (err) {
      // error
      res.send({ ok: false, error: err });
    } else {
      let sql = `DELETE FROM customers WHERE id=?`;
      conn.query(sql, [id], function (err, rows) {
        if (err) {
          // error
          res.send({ ok: false, error: err });
        } else {
          // success
          res.send({ ok: true });
        }
      });
      // close connection
      conn.release()
    }
  });
});

module.exports = router;
