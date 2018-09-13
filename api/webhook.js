const express = require("express");
const url = require('url')
/** MongoDB and Models */
require('./config/config.js') //config for mongodb,
const _ = require("lodash")
const { mongoose } = require('./db/mongoose');
//--Models
const {LineUser} = require("./models/lineuser")
const {LineMessage} = require("./models/linemessage")
const {Queue} = require("./models/queue")

/**LINELOGIN, LINE MESSAGE */
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
router.post('/', line_message.middleware(config),async (req, res) => {

  console.log(req.body.events);
  //--SaveMesssage
  try{
    await saveMessage( req.body.events);
  }catch(e){
    console.log(e)
    return
    // res.status(400).send(e);
  }
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

async function saveMessage(messageobj){
  //lineuser
  const lineuserid = messageobj[0].source.userId
  const lineuser = await LineUser.findOne({lineuserid}).sort({lastupdate:-1});
  //queue
  const queue = await Queue.findOne({_userid : lineuser.id}).sort({createdAt:-1}) 
  let message= new LineMessage({
    from_userid      : lineuser ? lineuser._id : null ,          // linuser._id
    from_lineuserid  : messageobj[0].source.userId, 
    from_displayname : lineuser ? lineuser.displayname:null, // lineuser.displayname
    
    to_queue_id   : queue ? queue._id      : null ,      // queue._id
    to_shop_id    : queue ? queue._shopid  : null ,  // queue._shop_id
    to_shopname   : queue ? queue.shopname : null , // queue.shomename
    
    type : messageobj[0].type,
    text : messageobj[0].type =='message'? messageobj[0].message.text : null,
    messageobj : messageobj[0]
  })
    const doc = await message.save()
    console.log('save msg',doc)
}

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return line_client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text //実際に返信の言葉を入れる箇所
  });
}
//======= Message Example ==========================
// "events": [
//   {
//     "replyToken": "0f3779fba3b349968c5d07db31eab56f",
//     "type": "message",
//     "timestamp": 1462629479859,
//     "source": {
//       "type": "user",
//       "userId": "U4af4980629..."
//     },
//     "message": {
//       "id": "325708",
//       "type": "text",
//       "text": "Hello, world"
//     }
//   },

module.exports = {
  path: '/api/webhook',
  handler: router
}