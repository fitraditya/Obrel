var Mongoose = require('../../database').Mongoose
var ObjectId = Mongoose.Schema.Types.ObjectId;

var channelSchema = new Mongoose.Schema({
  name: { type : String, required: true },
  hash: { type : String, required: true },
  type: { type : String, required: true },
  description: { type : String },
  createdBy: { type : ObjectId, required: true },
  createdDate: { type : Date, default: Date.now }
});

exports.Channel = Mongoose.model('Channel', channelSchema);
