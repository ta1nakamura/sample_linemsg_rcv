var mongoose = require("mongoose");

var Queue = mongoose.model('Queue', {
    _shopid    :{ type: mongoose.Schema.Types.ObjectId, require: true},
    shopname   :{ type: String, require:true},
    _userid    :{ type: mongoose.Schema.Types.ObjectId, require: true},
    username   :{ type: String, require:true},
    //flags
    completeflg :{ type: Boolean, default:false},
    cancelflg   :{ type: Boolean, default:false},
    //datetime
    createdAt   :{type: Date, default: Date.now},
    completedAt :{type: Date, default: null},
    //data
    nop         :{type: Number, default: 1},
    lastupdate  :{type: Date,   default: Date.now}

});
module.exports = { Queue };