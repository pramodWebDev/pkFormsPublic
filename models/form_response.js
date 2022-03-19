var mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var formResponseSchema = new Schema({
    // user_id: { type: String  },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    form_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FormTable', required: true },



    custom_responses: [{ type: Object }],
    is_del: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    created_at: Date,
    updated_at: Date

});


var FormResponseTable = mongoose.model('FormResponseTable', formResponseSchema);

module.exports = FormResponseTable;
