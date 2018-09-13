var mongoose = require("mongoose");
var LineMessage = mongoose.model('LineMessage', {
  //--From
  from_userid     : {type: mongoose.Schema.Types.ObjectId},
  from_lineuserid  : {type: String,required: true,}, //r
  from_displayname : {type: String,required: false,},

  //--LastQueue
  to_queue_id    : {type: mongoose.Schema.Types.ObjectId},
  to_shop_id     : {type: mongoose.Schema.Types.ObjectId},
  to_shopname    : {type: String,required: false,},

  //--Message
  type:{type: String,required: true,},
  text:{type: String,required: false,}, //type==message only
  messageobj:{type:Object,require:false,}, //Hole message {type,source,message...}
  
  lastupdate: {type   : Date, default: Date.now},
});

module.exports = { LineMessage };