var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var paymentSchema = new Schema({

  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  status : { type: String, default: 'pending' },
  amount : { type: Number, required: true },
  gateway : { type: String, required: true },
  invoice_url : { type: String },

  is_del : { type: Boolean, default: false },
  is_active : { type: Boolean, default: true },
  created_at : Date,
  updated_at : Date

});


var Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
