const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { MongoClient } = require('mongodb');
// const ObjectId = require('mongodb').ObjectID;
const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
const dbName = process.env.DB_NAME;
let MONGODB;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'xxxx@gmail.com',
    pass: 'xxxxxx',
  },
});
const router = express.Router();
const saltRounds = 10;


MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (!client) {
    throw err;
  } else {
    MONGODB = client.db(dbName);
    console.log('MONGODB Connected successfully to server');
  }
});


router.post('/user/create', (req, res, next) => {
  try {
    const userData = req.body;
    if (req.body !== undefined) {
      const collection = MONGODB.collection('users');
      collection.find({
        user_name: userData.user_name,
        email_id: userData.email_id,
        mobile_number: userData.mobile_number,
      }).toArray((err, body) => {
        if (err) {
          throw createError(403, 'Db Operation Failed');
        } else if (body.length > 0) {
          res.status(200).json({ message: 'User Exist..!! Try Different..!!' });
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
            active: 1,
            // eslint-disable-next-line no-shadow
          }, (err) => {
            if (err) {
              throw createError(403, 'Db Operation Failed');
            } else {
              res.status(200).json({ message: 'User Created Successfully..!!' });
            }
          });
        }
      });
    } else {
      throw createError(403, 'Missing Body Value');
    }
  } catch (err) {
    next(err);
  }
});


router.get('/user/authentication', (req, res, next) => {
  try {
    const userName = req.query.user_name;
    const { password } = req.query;
    if (userName !== undefined && password !== undefined) {
      const collection = MONGODB.collection('users');
      collection.find({
        user_name: userName,
      }).toArray((err, body) => {
        if (err) {
          throw createError(403, 'Db Operation Failed');
        } else {
          bcrypt.compare(password, body[0].password).then((result) => {
            if (result === true) {
              res.status(200).json({ message: 'Login Success..!!' });
            } else {
              res.status(422).json({ message: 'Incorrect Credentials..!!' });
            }
          });
        }
      });
    } else {
      throw createError(403, 'Param Values Mismatch');
    }
  } catch (err) {
    next(err);
  }
});


router.get('/user/resetPassword', (req, res, next) => {
  try {
    const emailId = req.query.email_id;
    if (emailId !== undefined) {
      const randomPassword = Math.random().toString(36).substring(7);
      const hash = bcrypt.hashSync(randomPassword, saltRounds);
      const collection = MONGODB.collection('users');
      collection.update(
        { email_id: emailId },
        {
          $set: {
            password: hash,
            updated_at: new Date(),
          },
        }, (err) => {
          if (err) {
            throw createError(403, 'Db Operation Failed');
          } else {
            const mailOptions = {
              from: 'xxxx@gmail.com',
              to: 'yyyy@gmail.com',
              subject: 'About Password Reset',
              text: randomPassword,
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                // eslint-disable-next-line no-console
                console.log(error);
              } else {
                // eslint-disable-next-line no-console
                console.log(`Email sent: ${info.response}`);
              }
            });
            res.status(200).json({ message: 'New Password Sent To Your Email Id' });
          }
        },
      );
    } else {
      throw createError(403, 'Param Mismatch');
    }
  } catch (err) {
    next(err);
  }
});


router.get('/user/deactive', (req, res, next) => {
  try {
    const userName = req.query.user_name;
    if (userName !== undefined) {
      const collection = MONGODB.collection('users');
      collection.update({
        user_name: userName,
      },
      {
        $set: {
          active: 0,
        },
      }, (err) => {
        if (err) {
          throw createError(403, 'Db Operation Failed');
        } else {
          res.status(200).json({ message: 'User Deactivate Success..!!' });
        }
      });
    } else {
      throw createError(403, 'Param Mismatch');
    }
  } catch (err) {
    next(err);
  }
});


router.post('/order/create', (req, res, next) => {
  try {
    const orderData = req.body;
    if (orderData !== undefined) {
      const collection = MONGODB.collection('orders');
      collection.insert({
        user_id: orderData.user_id,
        order_name: orderData.order_name,
        food_id: orderData.food_id,
        qty: orderData.qty,
        offer_price: orderData.offer_price,
        original_price: orderData.original_price,
        offer_name: orderData.offer_name,
        active: 1,
      }, (err) => {
        if (err) {
          throw createError(403, 'Db Operation Failed');
        } else {
          res.status(200).json({ message: 'Order created successfully..!!' });
        }
      });
    } else {
      throw createError(403, 'Body Value Missing');
    }
  } catch (err) {
    next(err);
  }
});


router.get('/order/getAllOrder', (req, res, next) => {
  try {
    const userId = req.query.user_id;
    if (userId !== undefined) {
      const collection = MONGODB.collection('orders');
      collection.find({
        user_id: userId,
        active: 1,
      }).toArray((err, body) => {
        if (err) {
          throw createError(403, 'Db Operation Failed');
        } else {
          res.send(body);
        }
      });
    } else {
      throw createError(403, 'Param Value Mismatch');
    }
  } catch (err) {
    next(err);
  }
});

router.get('/ingredient/getThresoldQty', (req, res, next) => {
  const collection = MONGODB.collection('ingredients');
  collection.find({ remaining_qty: { $lt: 1000 } }).toArray((err, body) => {
    if (err) {
      next(createError(403, 'Db Operation Failed'));
    } else {
      res.send(body);
    }
  });
});


router.get('/ingredient/getBySameVendor', (req, res, next) => {
  try {
    const vendorId = req.query.vendor_id;
    if (vendorId !== undefined) {
      const collection = MONGODB.collection('ingredients');
      collection.find({
        vendor_id: vendorId,
      }).toArray((err, body) => {
        if (err) {
          throw createError(403, 'Db Operation Failed');
        } else {
          res.send(body);
        }
      });
    } else {
      throw createError(403, 'Param Value Mismatch');
    }
  } catch (err) {
    next(err);
  }
});


router.get('/food/getListOverSellingCost', (req, res, next) => {
  const collection = MONGODB.collection('foods');
  collection.find({ $expr: { $gt: ['$production_cost', '$selling_cost'] } }).toArray((err, body) => {
    if (err) {
      next(createError(403, 'Db Operation Failed'));
    } else {
      res.send(body);
    }
  });
});


module.exports = router;
