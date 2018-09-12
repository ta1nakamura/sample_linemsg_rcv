var mongoose = require("mongoose");
var LineMessage = mongoose.model('LineMessage', {
  //--From
  from_user_id     : {type: String,required: false,},
  from_lineuserid  : {type: String,required: true,}, //r
  from_displayname : {type: String,required: false,},

  //--To
  to_user_id     : {type: String,required: false,},
  to_lineuserid  : {type: String,required: true,},
  to_displayname : {type: String,required: false,},

  //--Message
  type:{type: String,required: true,},
  text:{type: String,required: false,}, //type==message only
  messageobj:{type:Object,require:false,}, //Hole message {type,source,message...}
  
  lastupdate: {type   : Date, default: Date.now},
});

module.exports = { LineMessage };