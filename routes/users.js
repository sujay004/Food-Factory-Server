var express = require('express');
var nodemailer = require('nodemailer');
// var getDb = require("./../bin/db").getDb;

const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017';
var dbName = 'food_factory';


var MONGODB;
MongoClient.connect(url, function (err, client) {
  console.log("MONGODB Connected successfully to server");
  MONGODB = client.db(dbName);
});


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'xxxx@gmail.com',
    pass: 'xxxxxx'
  }
});




const bcrypt = require('bcrypt');
var router = express.Router();

const saltRounds = 10;
// const myPlaintextPassword = 'sujay';
// const someOtherPlaintextPassword = 'not_bacon';
// const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
// console.log(hash)
// bcrypt.compare(myPlaintextPassword, hash).then(function (result) {
//   console.log(result)
// });

/* GET users listing. */
router.post('/createUser', function (req, res, next) {

  var userData = req.body;
  console.log(userData)
  var collection = MONGODB.collection('users');

  collection.find({
    user_name: userData.user_name,
    email_id: userData.email_id,
    mobile_number: userData.mobile_number
  }).toArray((err, body) => {
    if (err) {
      res.send(403);
    } else {
      console.log(body)
      if (body.length > 0) {
        res.sendStatus(403);
      } else {
        collection.insertOne({
          first_name: userData.first_name,
          last_name: userData.last_name,
          user_name: userData.user_name,
          password: bcrypt.hashSync(userData.password, saltRounds),
          email_id: userData.email_id,
          mobile_number: userData.mobile_number,
          created_at: new Date(),
          updated_at: new Date(),
          active: 1
        }, (err, body) => {
          if (err) {
            res.sendStatus(403);
          } else {
            res.send(200);
          }
        });
      }
    }
  });

});


router.get('/userAuthentication', (req, res) => {
  var user_name = req.query.user_name;
  var password = req.query.password;
  console.log(user_name, password);

  const hash = bcrypt.hashSync(password, saltRounds);
  console.log(hash)
  var collection = MONGODB.collection('users');
  collection.find({
    user_name: user_name
    // password: hash
  }).toArray((err, body) => {
    if (err) {
      res.sendStatus(403);
    } else {
      console.log(body)
      bcrypt.compare(password, body[0].password).then(function (result) {
        if (result == true) {
          res.sendStatus(200);
        } else {
          res.sendStatus(403);
        }
      });

    }
  });
});


router.get('/resetPassword', (req, res) => {
  var email_id = req.query.email_id;
  var randomPassword = Math.random().toString(36).substring(7);
  const hash = bcrypt.hashSync(randomPassword, saltRounds);
  var collection = MONGODB.collection('users');
  collection.update(
    { email_id: email_id },
    {
      $set: {
        password: hash,
        updated_at: new Date()
      }
    }, (err, body) => {
      if (err) {
        res.sendStatus(403);
      } else {
        var mailOptions = {
          from: 'xxxx@gmail.com',
          to: 'yyyy@gmail.com',
          subject: 'About Password Reset',
          text: randomPassword
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        res.sendStatus(200);
      }
    });
});



router.get('/deactiveUser', (req, res) => {
  var user_name = req.query.user_name;

  var collection = MONGODB.collection('users');
  collection.update({
    user_name: user_name
  },
    {
      $set: {
        active: 0
      }
    }, (err, body) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.sendStatus(200);
      }
    });
});






router.post('/order/create', function (req, res) {
  console.log('hello--');
  var orderData = req.body;

  var collection = MONGODB.collection('orders');

  collection.insert({
    user_id: orderData.user_id,
    order_name: orderData.order_name,
    food_id: orderData.food_id,
    qty: orderData.qty,
    offer_price: orderData.offer_price,
    original_price: orderData.original_price,
    offer_name: orderData.offer_name,
    active: 1
  }, (err, body) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.send(200);
    }
  });

  // res.render('index', { title: 'Express' });
});



router.get('/getAllOrder', function (req, res) {

  var user_id = req.query.user_id;
  console.log(user_id)
  var collection = MONGODB.collection('orders');

  collection.find({
    user_id: user_id,
    active: 1
  }).toArray((err, body) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.send(body);
    }
  });

  // res.render('index', { title: 'Express' });
});

router.get('/getThresoldQty', function (req, res) {

  var collection = MONGODB.collection('ingredients');

  collection.find({ remaining_qty: { $lt: 1000 } }).toArray((err, body) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.send(body);
    }
  });

  // res.render('index', { title: 'Express' });
});



router.get('/getIngredientsBySameVendor', function (req, res) {
  var vendor_id = req.query.vendor_id;
  console.log('hello--', vendor_id);

  var collection = MONGODB.collection('ingredients');

  collection.find({
    vendor_id: vendor_id,
  }).toArray((err, body) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.send(body);
    }
  });

  // res.render('index', { title: 'Express' });
});


router.get('/getFoodsListOverSellingCost', function (req, res) {

  var collection = MONGODB.collection('foods');

  collection.find({ $expr: { $gt: ["$production_cost", "$selling_cost"] } }).toArray((err, body) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.send(body);
    }
  });

  // res.render('index', { title: 'Express' });
});



module.exports = router;
console.log(new Date())