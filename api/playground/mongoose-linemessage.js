require('../config/config.js')
const { ObjectID } = require("mongodb")
const { mongoose } = require("../db/mongoose");
const {LineMessage} = require("../models/linemessage")
const {LineUser} = require("../models/lineuser")
const jwt = require("jsonwebtoken");
 const JWT_SECRET='secret';

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const lineusers = [{
        _id:userOneId,
        lineuserid :'seed-dummy0001',
        displayname:'SeedDummy-001',
        isfollow:true,
        lastupdate: new Date().getTime(),
        token: jwt.sign({ sub: 'seed-dummy0001', name: 'SeedDummy-001'}, 
            // process.env.JWT_SECRET).toString()
            JWT_SECRET).toString()
    },{
        _id:userTwoId,
        lineuserid :'seed-dummy0002',
        displayname:'SeedDummy-002',
        isfollow:true,
        lastupdate: new Date().getTime(),
        token: jwt.sign({ sub: 'seed-dummy0002', name: 'SeedDummy-002'}, 
            // process.env.JWT_SECRET).toString()
            JWT_SECRET).toString()
    }
];


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
const messageOneId = new ObjectID();
const messageTwoId = new ObjectID();
const linemessages = [{
    _id:messageOneId,
    from_user_id     : lineusers[0]._id,
    from_lineuserid  : lineusers[0].lineuserid,
    from_displayname : lineusers[0].displayname,
    to_user_id       : lineusers[1]._id,
    to_lineuserid    : lineusers[1].lineuserid,
    to_displayname   : lineusers[1].displayname,
    type : 'message',
    text : 'test message 1',
    messageobj : { key1:'valu1', key2:'valu2'}
},{
    _id:messageTwoId,
    from_user_id     : lineusers[1]._id,
    from_lineuserid  : lineusers[1].lineuserid,
    from_displayname : lineusers[1].displayname,
    to_user_id       : lineusers[0]._id,
    to_lineuserid    : lineusers[0].lineuserid,
    to_displayname   : lineusers[0].displayname,
    type : 'message',
    text : 'test message 1',
    messageobj : { key1:'valu1', key2:'valu2'}
}
];

const initLinemessages=async()=>{
    await LineMessage.remove({
        $or:[
            {from_lineuserid : lineusers[0].lineuserid},
            {from_lineuserid : lineusers[1].lineuserid},
        ]
    })
    await LineMessage.insertMany(linemessages)
}
/**
 * Main
 */
const execMain=async()=>{
    console.log('--start')
    await initLineusers()
    await initLinemessages()
    console.log('--end')
}
execMain();
