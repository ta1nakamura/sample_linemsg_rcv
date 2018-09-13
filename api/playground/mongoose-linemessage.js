require('../config/config.js')
const { ObjectID } = require("mongodb")
const { mongoose } = require("../db/mongoose");
const {LineMessage} = require("../models/linemessage")
const {LineUser} = require("../models/lineuser")
const {Queue} = require("../models/queue")
const jwt = require("jsonwebtoken");
const JWT_SECRET='secret';

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const shopOneId = new ObjectID();
const queueOneId = new ObjectID();
const queueTwoId = new ObjectID();
const now = new Date();

//lineusers
const lineusers = [{
        _id:userOneId,
        lineuserid :'seed-dummy0001',
        displayname:'SeedDummy001',
        isfollow:true,
        lastupdate: new Date().getTime(),
        token: jwt.sign({ sub: 'seed-dummy0001', name: 'SeedDummy001'}, 
            // process.env.JWT_SECRET).toString()
            JWT_SECRET).toString()
    },{
        _id:userTwoId,
        lineuserid :'seed-dummy0002',
        displayname:'SeedDummy002',
        isfollow:true,
        lastupdate: new Date().getTime(),
        token: jwt.sign({ sub: 'seed-dummy0002', name: 'SeedDummy002'}, 
            // process.env.JWT_SECRET).toString()
            JWT_SECRET).toString()
    }
];

//queues
const queues =[{
    _id      : queueOneId,
    _shopid  : shopOneId,
    shopname : 'seed-Shop01',
    _userid  : userOneId,
    username : 'seed-User01',
    createdAt : new Date()
},{
    _id      : queueTwoId,
    _shopid  : shopOneId,
    shopname : 'seed-Shop02',
    _userid  : userTwoId,
    username :'seed-User02',
    createdAt : new Date(now.getFullYear(), now.getMonth(), now.getDate()-1 ),
}]

//linemessages
const linemessages = [{
    from_userid     : lineusers[0]._id,
    from_lineuserid  : lineusers[0].lineuserid,
    from_displayname : lineusers[0].displayname,

    to_queue_id    : queues[0]._id,
    to_shop_id     : queues[0]._shopid,
    to_shopname    : queues[0].shopname,

    type : 'message',
    text : 'test message seed 1',
    messageobj : { key1:'valu1', key2:'valu2'}
},{
    from_userid     : lineusers[1]._id,
    from_lineuserid  : lineusers[1].lineuserid,
    from_displayname : lineusers[1].displayname,

    to_queue_id    : queues[1]._id,
    to_shop_id     : queues[1]._shopid,
    to_shopname    : queues[1].shopname,
    
    type : 'message',
    text : 'test message seed 2',
    messageobj : { key1:'valu1', key2:'valu2'}
}
];

//=============== Queue ==============
const initQueues = async()=>{
    let res1=await Queue.remove({$or:[ 
        { shopname : queues[0].shopname },
        { shopname : queues[1].shopname },
    ]});
    // console.log(res1)
    await Queue.insertMany(queues);
}
//=============== LINE USER ===========
const initLineusers= async() =>{
    await LineUser.remove({
        $or:[
           {lineuserid : lineusers[0].lineuserid},
           {lineuserid : lineusers[1].lineuserid}, 
        ]
    });
    await LineUser.insertMany(lineusers);
}
//=============== LINE MESSAGE ===========

const initLinemessages=async()=>{
    await LineMessage.remove({
        $or:[
            {from_lineuserid : lineusers[0].lineuserid},
            {from_lineuserid : lineusers[1].lineuserid},
        ]
    })
    await LineMessage.insertMany(linemessages)
}
async function testSaveLinemessage() {
  console.log('--testsave')  
  const lineuserid = lineusers[0].lineuserid
  //--userlist
  const users = await LineUser.find({}).sort({lastupdate:-1});
  console.log('--find all users ')
  for (const user of users) {
    console.log(user.id)
    console.log(user.displayname + ',' + user.lastupdate)
  }
  const oneuser = await LineUser.findOne({lineuserid}).sort({lastupdate:-1});
  console.log('One ',oneuser)
  const queue = await Queue.findOne({ _userid : oneuser.id}).sort({createdAt:-1})
  console.log('Queue',queue)
  
} 
/**
 * Main
 */
const execMain=async()=>{
    console.log('--start')
    await initQueues()
    await initLineusers()
    await initLinemessages()
    await testSaveLinemessage()
    console.log('--end')
}
execMain();
