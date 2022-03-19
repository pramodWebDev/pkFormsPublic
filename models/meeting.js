var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var meetingSchema = new Schema({

  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  title: { type: String, required: true },
  description: { type: String },
  datetime : { type: Date },
  logo_url : { type: String },
  media_url : { type: String },
  media_type : { type: String, default: 'bgcolor' },
  meeting_url : { type: String, required: true },
  meeting_id : { type: String, required: true },
  meeting_pwd : { type: String, required: true },
  authors : [{ type: String, required: true }],
  duration : { type: String },
  duration : { type: String },
  public_url : { type: String, required: true, unique: true },
  email : { type: String, required: true },
  rsvp : [{ type: String }],
  zoom_meeting_id : { type: String, required: true },
  max_seats : { type: Number },
  paid_event : { type: Boolean, default: false },
  questions : [{ type: String }],
  responses : [{ type: String }],
  embed_key : { type: String, required: true, unique: true },

  is_del : { type: Boolean, default: false },
  is_active : { type: Boolean, default: true },
  created_at : Date,
  updated_at : Date

});


var Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
