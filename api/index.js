const express = require("express");
const url = require('url')
/** MongoDB and Models */
require('./config/config.js') //config for mongodb,
const _ = require("lodash")
const { ObjectID } = require("mongodb")
const { mongoose } = require('./db/mongoose');
const { Todo } = require("./models/todo");
const {LineUser} = require("./models/lineuser")
/** User Auth */
const jwt = require("jsonwebtoken");
var { authenticate } = require("./middleware/authenticate")
const { authenticate_admin } = require("./middleware/authenticate_admin")
/**LINELOGIN, LINE MESSAGE */
const line_login = require("./line/line-login"); //custom
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
//======================================================
// [LINE LOGIN]
//======================================================
/** 
 * LINE LOGIN
 * https://qiita.com/nkjm/items/c8eac296dfee14fe5cf7
 */
// 認証の設定。
const login = new line_login({
    channel_id: process.env.LINE_LOGIN_CHANNEL_ID,
    channel_secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
    callback_url: process.env.LINE_LOGIN_CALLBACK_URL,
    // bot_prompt: "aggressive", // 追加
    // prompt: "consent", // 追加,
    
});
// console.log('-- line_login', login);

// 認証フローを開始するためのルーター設定。
var setNextUrl = function (req,res,next){
    console.log('--enter /api/auth')
    if(req.query.nexturl) {
        req.session.nexturl = req.query.nexturl
    }
    console.log('--auth-setnextPage enter,nexturl:',req.session.nexturl)
    
    next()
}
router.get("/auth",setNextUrl, login.auth())

// ユーザーが承認したあとに実行する処理のためのルーター設定。
router.get("/callback", login.callback(async (req, res, next, token_response) => {
    //token_response.id_token     : decoded object
    //token_response.id_token_raw : original id_token (jwt format)
    console.log('jwt',token_response.id_token_raw)
    //Set Session
    var userinfo={
        lineuserid  : token_response.id_token.sub,
        displayname : token_response.id_token.name,
        picture     : token_response.id_token.picture,
        id_token    : token_response.id_token_raw,
        access_token : token_response.access_token,
    }
    
    try{ // Save LineUser to DB  
        doc = await LineUser.findOneAndUpdate(
            {   lineuserid     :token_response.id_token.sub },
            {
                displayname:token_response.id_token.name,
                picture    :token_response.id_token.picture,
                isfollow   :true,
                lastupdate : new Date().getTime(),
            },
            {upsert:true,new:true}
        );
        userinfo._id = doc._id;
        //Store Session
        req.session.lineuser = userinfo
        
        //Redirect to {req.session.nexturl}
        let redircturl ='/'
        if(req.session.nexturl) redircturl= req.session.nexturl
        res.redirect(redircturl);
    }catch(e){
        console.log('[save-error]',e)
        res.status(400).json(e);
    }
},(req, res, next, error) => {
    console.log('---Error---',error)
    // 認証フロー失敗時
    // res.status(400).json(error);
    res.json(error);
}
));

// POST /api/logout
router.post('/logout', async (req,res)=>{
    console.log('--[/api/logout]')
    debugger
    try{
        login.revoke_access_token(req.session.lineuser.access_token)
        delete req.session.lineuser
        res.status(200).json({ok:true})
    }catch(e){
        console.log(e)
    }
});

//======================================================
// [LINE MESSAGE] API (@line/bot-sdk)
//======================================================
// GET /api/lineusers
router.get('/lineusers',authenticate_admin, async (req,res)=>{
    console.log('--[/api/lineusers]')
    try{
        const lineusers = await LineUser.find();
        res.send({lineusers})
    }catch(error){
        res.status(400).send(e);
    }
});

// POST /api/line_push_self : for user self
router.post("/line_push_self",authenticate, async(req,res)=>{
    debugger
    console.log('--[POST /test/line_push_self]');
    // var userId='U5b6986839debb86192d011f49fb2553e'; //Nakamura
    // Uc5943d1660983a3b628916e0efa1d715 //chanon
    var pushmessage =  'no post data';
    if(!req.body.lineuserid || !req.body.message ){
        console.log('--Bad request body=--',req.body)
        return res.status('400').json({message:'Bad request'});
    }else if(req.body.lineuserid !== req.user.lineuserid ){ 
        //== check send LINET to SELF
        console.log('--you can sed only yourself')
        return res.status('400').json({message:'Bad request'});
    }
    console.log('--req.body',req.body)
    lineuserid = req.body.lineuserid;
    pushmessage =  req.body.message;
   
    try{
        await line_client.pushMessage(lineuserid,{type:'text',text:pushmessage})
        res.status(200).json({message: pushmessage});
    }catch(e){
        console.log(e.statusCode, e.message)
        return res.status(e.statusCode).json({message:'Bad request'});
    }
})

// POST /api/line_push : only for admin
router.post("/line_push",authenticate_admin, async(req,res)=>{
    debugger
    console.log('--[POST /test/line_push]');
    // var userId='U5b6986839debb86192d011f49fb2553e'; //Nakamura
    // Uc5943d1660983a3b628916e0efa1d715 //chanon
    var pushmessage =  'no post data';
    if(!req.body.lineuserid || !req.body.message ){
        console.log('--Bad request body=--',req.body)
        return res.status('400').json({message:'Bad request'});
    }
    console.log('--req.body',req.body)
    lineuserid = req.body.lineuserid;
    pushmessage =  req.body.message;
   
    try{
        await line_client.pushMessage(lineuserid,{type:'text',text:pushmessage})
        res.status(200).json({message: pushmessage});
    }catch(e){
        console.log(e.statusCode, e.message)
        return res.status(e.statusCode).json({message:'Bad request'});
    }
})
// POST /api/line_push_dbuserid
router.post("/line_push_dbuserid",authenticate_admin, async(req,res)=>{
// router.post("/line_push_dbuserid", async(req,res)=>{
    debugger
    console.log('--[POST /line_push_dbuserid]');
    var pushmessage =  'no post data';
    if(!req.body.dbuserid || !req.body.message ){
        console.log('--Bad request body=--',req.body)
        return res.status('400').json({message:'Bad request'});
    }
    console.log('--req.body',req.body)
    dbuserid = req.body.dbuserid;
    pushmessage =  req.body.message;
    
    try{
        //-- get Lineuser
        let lineuser = await LineUser.findOne({_id: dbuserid})
        await line_client.pushMessage(lineuser.lineuserid,{type:'text',text:pushmessage})
        res.status(200).json({message: pushmessage});
    }catch(e){
        console.log(e.statusCode, e.message)
        return res.status(e.statusCode).json({message:'Bad request'});
    }
})

//=====================================================
// [TODO]  Test Express and MongoDb,Mongoose
//=====================================================
router.post('/todos', authenticate, async(req, res) => {
  // console.log(req.body)
  var todo = new Todo({
      text: req.body.text,
      _creator: req.user._id
  });
  try{
    const doc = await todo.save();
    res.send(doc);
  }catch(e){
    res.status(400).send(e);
  }
});
router.get('/todos',authenticate, async (req, res) => {
  try{
    const todos = await Todo.find({
        _creator: req.user._id
    })
    res.send({ todos });
  }catch(e){
    res.status(400).send(e);
  }
});
router.get('/todos/:id',authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
      return res.status(400).send();
  }

  Todo.findOne({
      _id: id,
      _creator: req.user._id
  }).then((todo) => {
      if (!todo) {
          return res.status(404).send();
      }
      return res.status(200).send({ todo });
  }).catch((e) => {
      return res.status(400).send();
  })
});
router.delete('/todos/:id',authenticate, async(req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
      return res.status(404).send();
  }
  try {
      const todo = await Todo.findOneAndRemove({
          _id: id,
          _creator: req.user._id
      })
      if (!todo) {
          return res.status(404).send();
      }
      return res.status(200).send({ todo });
  }
  catch (e) {
      res.status(400).send();
  }
})
router.patch('/todos/:id',authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
      return res.status(404).send();
  }
  if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
  }
  else {
      body.completed = false;
      body.completedAt = null;
  }
  // Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
  Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user.id
  }, {
      $set: body
  }, { new: true }).then((todo) => {
      if (!todo) {
          return res.status(404).send();
      }
      res.send({ todo });
  }).catch((e) => {
      res.status(400).send();
  })
})

/**============================================
 * [Lineuser] dummylogin/:name
 *   - save db to lineuser
 *   - set session 
 * ===========================================
 */
router.post('/dummylogin/',async(req,res)=>{
    console.log('--[api]dummylogin')
    let token= jwt.sign({
        sub  : req.body.lineuserid,
        name : req.body.lineuserid,
       },process.env.LINE_LOGIN_CHANNEL_SECRET).toString();
    var userinfo={
        lineuserid  : req.body.lineuserid,
        displayname : req.body.lineuserid,
        id_token    : token,
    }
    try{
        doc = await LineUser.findOneAndUpdate(
            {   lineuserid : userinfo.lineuserid },
            {
                displayname: userinfo.displayname ,
                picture    : null,
                isfollow   :true,
                lastupdate : new Date().getTime(),
            },
            {upsert:true,new:true}
        );
        userinfo._id = doc._id;
        req.session.lineuser = userinfo
        
        res.status(200).header('x-auth', token)
            .send({ lineuser:userinfo });
        // res.redirect('/other');
    }catch(e){
        console.log('[save-error]',e)
        res.status(400).json(e);
    }
})

/**
 * Test Express
 */
router.get("/test/:id", (req, res) => {
    console.log("--test get");
    console.log("--id " ,req.params.id)
    res.status(200).json({message:`test_id = ${req.params.id}`});
 });

module.exports = {
  path: '/api',
  handler: router
}