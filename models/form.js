var mongoose = require('mongoose');



mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var formSchema = new Schema({
    // user_id: { type: String  },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },


    form_custom_head: { type: String },
    form_custom_questions: [{ type: Object }],

    allow_branding: { type: Boolean, default: false },
    branding_logo: { type: String },
    branding_text: { type: String },

    color1: { type: String, default: '41468d' },
  
    // custom_responses: [{ type: Object }],
  is_del : { type: Boolean, default: false },
  is_active : { type: Boolean, default: true },
  created_at : Date,
  updated_at : Date

});


var FormTable = mongoose.model('FormTable', formSchema);

module.exports = FormTable;
