var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var userSchema = new Schema({


    name: { type: String, trim: true, minlength: 3, required: true },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/, 'Please enter a valid email address']
    },
    password: { type: String, minlength: 6, required: true },
    subdomain: { type: String, minlength: 3, maxlength: 50 },
    company: { type: String },
    website: { type: String },
    mobile: { type: String },
    role: { type: String },
    company_size: { type: String },
    profile_pic: { type: String },
    verification: { type: Boolean, default: false },
    is_spam_email: { type: Boolean, default: false },
    verification_key: { type: String },
    api_key: { type: String },
    stripe_cust_id: { type: String },
    google_id:  { type: String },
    provider:  { type: String },
    is_del: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    created_at: Date,
    updated_at: Date

});


var User = mongoose.model('User', userSchema);

module.exports = User;
