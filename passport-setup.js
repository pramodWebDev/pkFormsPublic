const passport = require('passport');
const User = require('./models/user');
const uuidv4 = require('uuid/v4');
var LocalStrategy = require('passport-local').Strategy;


const GoogleStrategy = require('passport-google-oauth20').Strategy;

function encrypt(text) {
  encryptalgo = crypto.createCipher(cipher_algorithm, cipher_key);
  let encrypted = encryptalgo.update(text, 'utf8', 'hex');
  encrypted += encryptalgo.final('hex');
  return encrypted;
}



passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},

  function (username, password, done) {

    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.isValid(password)) { return done(null, false); }
      return done(null, user);
    });



  }
));

passport.serializeUser(function (user, done) {

  done(null, user);
});


passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/google/callback"
},
  function (accessToken, refreshToken, profile, done) {

    console.log(profile, "profileprofile")



    User.findOne({
      'google_id': profile.id
    }, function (err, user) {

      if (err) {
        return done(err);
      }
      //No user was found... so create a new user with values from Facebook (all the profile. stuff)
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          profile_pic: profile.photos[0].value,
          provider: 'google',
          password:uuidv4(),
          google_id:profile.id
          //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
          // facebook: profile._json
        });
        user.save(function (err, result) {

          if(err){

            console.log(err);

          }else{

          return done(null, user);

          }

         
        });
      } else {
        //found user. Return
        return done(err, user);
      }
    });



  }
));
