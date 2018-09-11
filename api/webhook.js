const express = require("express");
const url = require('url')
/** MongoDB and Models */
require('./config/config.js') //config for mongodb,
const _ = require("lodash")
const { ObjectID } = require("mongodb")
const { mongoose } = require('./db/mongoose');
// const { Todo } = require("./models/todo");
// const {LineUser} = require("./models/lineuser")
/** User Auth */
const jwt = require("jsonwebtoken");
var { authenticate } = require("./middleware/authenticate")
const { authenticate_admin } = require("./middleware/authenticate_admin")
/**LINELOGIN, LINE MESSAGE */
// const line_login = require("./line/line-login"); //custom
const line_message = require('@line/bot-sdk');
const config = {
      channelAccessToken: process.env.LINE_MESSAGE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_MESSAGE_CHANNEL_SECRET,
}
const line_client = new line_message.Client(config)

/** EXPRESS*/
const router = express.Router();
const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  //add query for LINELOGIN
  req.query = url.parse(req.url, true).query
  next()
})
//POST /api/webhook --Recieve Message
router.post('/', line_message.middleware(config),(req, res) => {

  console.log(req.body.events);

  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return line_client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text //実際に返信の言葉を入れる箇所
  });
}

module.exports = {
  path: '/api/webhook',
  handler: router
}