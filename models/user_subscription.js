var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var userSubscriptionSchema = new Schema({

  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  trial_expiry : { type: Date, required: true },
  max_minutes: { type: Number, required: true },
  show_watermark : { type: Boolean, default: true },

  is_del : { type: Boolean, default: false },
  is_active : { type: Boolean, default: true },
  created_at : Date,
  updated_at : Date

});


var UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema);

module.exports = UserSubscription;
