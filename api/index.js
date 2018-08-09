const express = require("express");
/** MongoDB and Models */
require('./config/config.js') //config for mongodb,
const { ObjectID } = require("mongodb")
var { mongoose } = require('./db/mongoose');
var { Todo } = require("./models/todo");


const router = express.Router();

const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})
/**
 * Test Express
 */
router.get("/test/:id", (req, res) => {
   console.log("--test get");
   console.log("--id " ,req.params.id)
   res.status(200).json({message:`test_id = ${req.params.id}`});
});

/**
 * Test Express and MongoDb,Mongoose
 */
router.get('/todos', (req, res) => {
  Todo.find({
      // _creator: req.user._id
  }).then((todos) => {
      res.send({ todos });
  }, (e) => {
      res.status(400).send(e);
  })
});

module.exports = {
  path: '/api',
  handler: router
}