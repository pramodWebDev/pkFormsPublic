require('dotenv').config();


const express = require('express');
const upload = require('express-fileupload');
const methodOverride = require('method-override');
const session = require('client-sessions');
const bodyParser = require('body-parser');
var app = express();
const https = require('https');
const fs = require('fs');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet')
const querystring = require('querystring');
const router = express.Router();
const mongoose = require('mongoose');
const randomstring = require('randomstring');
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
mongoose.Promise = Bluebird;
fetch.Promise = Bluebird;
const crypto = require('crypto');
const moment = require('moment');
const momentTZ = require('moment-timezone');
const request = require("request");
const rateLimit = require("express-rate-limit");
const cookieSession = require('cookie-session')


const passport = require('passport');
require('./passport-setup');






const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');


const cipher_algorithm = process.env.CIPHER_ALGORITHM; // or any other algorithm supported by OpenSSL
const cipher_key = process.env.CIPHER_KEY;


// setup route middlewares
var csrfProtection = csrf({
    cookie: true
});

var parseForm = bodyParser.urlencoded({
    extended: false
});


const AWS = require('aws-sdk');
var accessKeyId = process.env.AWS_KEY;
var secretAccessKey = process.env.AWS_SECRET;

const s3 = new AWS.S3({

    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,

});

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: 'us-east-1'
});



const User = require('./models/user');
const Meeting = require('./models/meeting');
const Payment = require('./models/payment');
const UserSubscription = require('./models/user_subscription');

const FormTable = require('./models/form');
const FormResponseTable = require('./models/form_response');



app.set('view engine', 'ejs');
app.use(session({
    cookieName: 'session',
    secret: process.env.COOKIE_SECRET,
    duration: 30 * 60 * 1000 * 30,
    activeDuration: 60 * 60 * 1000 * 30,
    httpOnly: true
}));


app.use(passport.initialize());
app.use(passport.session());
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  //secret we used to sign our JWT
  secretOrKey : 'INenuEdoOkatiWhatever',
  //we expect the user to send the token as a query paramater with the name 'secret_token'
  jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
  try {
    //Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));

app.listen(process.env.PORT);

console.log('Running on Port - ' + process.env.PORT);

// app.use('/adminui', express.static(__dirname + '/adminui/'));
app.use('/userui', express.static(__dirname + '/userui/'));
app.use(helmet())
app.use(upload())
app.use(methodOverride('_method'));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(cookieParser());


// Date base Connection

var username = process.env.DB_USERNAME;
var password = process.env.DB_PASSWORD;


if (process.env.NODE_ENV == 'development') {

    const dburl = "mongodb+srv://" + username + ":" + password + "@cluster0.rk6ip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


    mongoose.connect(dburl, { useUnifiedTopology: true, useNewUrlParser: true }, function (error, db) {
        if (!error) {
            console.log("Connected to database");
        } else {
            console.log("Error connecting to database", error);
        }

    });


} else if (process.env.NODE_ENV == 'production') {


    mongoose.connect(dburl, { useUnifiedTopology: true, useNewUrlParser: true }, function (error, db) {
        if (!error) {
            console.log("Connected to database");
        } else {
            console.log("Error connecting to database");
        }

    });


}


function checkIsLoggedIn(req, res, next) {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        next();
    }
};

// POST Requests
const createAccountLimiter = rateLimit({
    // windowMs: 60 * 60 * 1000, // 1 hour window
    // max: 20, // Start blocking after 5 requests
    windowMs: 2 * 60, // 2 minutes
    max: 100, // Start blocking after 100 requests
    message: "Too many accounts created from this IP, please try again after an hour"
});
// GET Requests for Render Views
app.get('/aws', function (req, res) {
    res.status(200).send();
    res.end();
});






app.get('/', async function (req, res) {

    if (!req.session.user)  // User Not logged IN
    {
        res.render('error');
    }
    else    // User logged IN
    {



    }


});

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn,async (req, res) => {
    var user_id = decrypt(req.session.user);
        console.log(user_id, "user id")
        // var userInfo = await getUserInfo(user_id);
        var user_forms = await getUserForms(user_id);
        res.render('home', { "user_id": user_id, "forms": user_forms });
        res.end();

})
// app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))

// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {

    console.log(req.user, "reqqqqq")
    console.log(res.user, "res userr")

    let googleUser = req.user

    let hashuser = encrypt(JSON.stringify(googleUser._id));
    console.log("Hash USERID", hashuser);
    req.session.user = hashuser;
    // Successful authentication, redirect home

    res.redirect('/home');
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})



app.get('/register', checkIsLoggedIn, function (req, res) {
    // const site_key = process.env.CAPTCHA_KEY;
    res.render('register', {
        "site_key": "site_key",
    });
});
app.get('/tailwind', function (req, res) {
    // const site_key = process.env.CAPTCHA_KEY;
    res.render('tailwind');
});

app.put('/create-form', async function(req, res) {


    var url = req.url;
    var form_custom_head = req.body.form_custom_head;
    var customFormData = req.body.customFormData;
    var user_id = req.body.user_id;

    var allow_branding = false

    var formObj = FormTable({
        user_id: user_id,
        form_custom_head:form_custom_head,
        form_custom_questions:customFormData,

        allow_branding: allow_branding,


        created_at: new Date(),
        updated_at: new Date()
    })

    formObj.save(async function(err, result) {
        if (err) {
            console.log("ERROR");
            console.log("Error Occurred in " + url, err);
            res.status(500).send({ message: "Form creation failed" });
            res.end();
            logError(url, err); // Logging necessary for Debugging in Live environment
        } else {

            console.log("Form Created SUCCESS!!!!!");
            var data = { data: result }; // Data to be sent to Front End
            res.status(200).send(data);
            res.end();


         }  

    })

});

app.get('/viewform/:userid/:formid', function (req, res) {

    var formId = req.params.formid;
    var userId = req.params.userid;

    FormTable.findOne({ "_id": formId, "user_id": userId }).exec(function (err, result) {
        if (err) {

            console.log("Error Occurred in " + url, err);
            res.status(500).send({ message: " error message to frontend" });
            res.end();
        } else {

            res.render('viewform', { "formResponse": result });
        }

    })


})

app.get('/test', function (req, res) {

    req.body

    console.log( req.headers, "heser" )
    console.log( req.body , " req.body")

    let testvar =  req.body.val;

    res.status(200).send(testvar);
 });



app.get('/create-form', function (req, res) {

   

    try {
        var user_id = decrypt(req.session.user);
        // var userInfo = await getUserInfo(user_id);

        res.render('create-form', { "user_id": user_id });
    } catch (e) {
        res.render('lazy-dev');
    }


    
    // FormTable.findOne({ "_id": formId, "user_id": userId }).exec(function (err, result) {
    //     if (err) {

    //         console.log("Error Occurred in " + url, err);
    //         res.status(500).send({ message: " error message to frontend" });
    //         res.end();
    //     } else {

    //         res.render('viewform', { "formResponse": result });
    //     }

    // })


})


app.get('/profile', requireLogin, createAccountLimiter, async function (req, res) {
    try {
        var user_id = decrypt(req.session.user);
        var userInfo = await getUserInfo(user_id);

        res.render('profile', { "userInfo": userInfo });
    } catch (e) {
        res.render('profile');
    }
})



app.get('/logout', function (req, res) {
    req.session.reset()
    res.redirect('./login');
});



// https://38a9e252.ngrok.io/me





app.get('/me', requireLogin, async function (req, res) {

    try {

        var user_id = decrypt(req.session.user);
        var userInfo = await getUserInfo(user_id);
        res.status(200).send(userInfo);
        res.end();

    } catch (e) {
        res.status(503).send();
        res.end();
    }

})
app.get('/home', requireLogin, async function (req, res) {

    try {

        var user_id = decrypt(req.session.user);
        console.log(user_id, "user id")
        // var userInfo = await getUserInfo(user_id);
        var user_forms = await getUserForms(user_id);


        res.render('home', { "user_id": user_id, "forms": user_forms });
        // res.status(200).send(userInfo);
        res.end();

    } catch (e) {
        res.render('home');
        res.end();
    }

})

app.get('/response/:formId', requireLogin, async function (req, res) {

    console.log("in response")
    var url = req.params.url;
    var user_id = decrypt(req.session.user);

    var form_id = req.params.formId;

    console.log(user_id, "<<user id")
    console.log(form_id, "<<form_id")


    try {


        res.render('response', { "user_id": user_id, "form_id": form_id });



    } catch (e) {
        res.render('error');
        res.end();
    }

})
app.get('/get-response/:formid', requireLogin, function (req, res) {

    var url = req.params.url;
    var form_id = req.params.formid;
    try {

        var user_id = decrypt(req.session.user);
        // var userInfo = await getUserInfo(user_id);

        console.log(user_id, "user id")
        console.log(form_id, "form_id")


        FormResponseTable.find({ "form_id": form_id, "user_id": user_id }).exec(function (err, result) {
            if (err) {

                console.log("Error Occurred in " + url, err);
                res.status(500).send({ message: "Proper error message to frontend" });
                res.end();
            } else {

                console.log(result, "<<result");
                res.status(200).send(result);
                res.end();
            }

        })

    } catch (e) {
        res.render('error');
        res.end();
    }


})

app.get('/get-forms/:formid', requireLogin, function (req, res) {

    var form_id = req.params.formid;
    var user_id = decrypt(req.session.user);

    var url = req.params.url;


    try {


        FormTable.findOne({ "_id": form_id, "user_id": user_id }).exec(function (err, result) {
            if (err) {

                console.log("Error Occurred in " + url, err);
                res.status(500).send({ message: "Proper error message to frontend" });
                res.end();
                // reject(err);
            } else {

                res.status(200).send(result);
                res.end();

            }

        })

    } catch (e) {
        res.render('error');
        res.end();
    }


})

app.get('/get-forms-count/:formid', requireLogin, function (req, res) {

    var user_id = decrypt(req.session.user);

    var url = req.params.url;
    var form_id = req.params.formid;


    try {


        FormResponseTable.find({ "form_id": form_id, "user_id": user_id }).countDocuments(function (err, result) {
            if (err) {

                console.log("Error Occurred in " + url, err);
                res.status(500).send({ message: "Proper error message to frontend" });
                res.end();
            } else {

                res.status(200).send({ "result": result });
                res.end();
            }

        })

    } catch (e) {

        res.status(500).send("errr");
        res.end();
    }


})
// https://d63841ad.ngrok.io/me


app.get('/login', checkIsLoggedIn, createAccountLimiter, function (req, res) {

    res.render('login');

});

app.get('/err', function (req, res) {

    res.render('lazy-dev');

});




function saveUserInfo(data, tokenInfo) {

    var url = "saveUserInfo Function"; // As we dont have a url here, we will use the function name

    console.log("Inside saveUserInfo");
    // console.log("Inside tokenInfo", tokenInfo);

    return new Promise(function (resolve, reject) {

        User.findOne({ "user_id": data.id }).exec(function (err, result) {

            if (err) {

                console.log("Inside Error", err);
                // Default error handling, just like we did else where
                console.log("Error", err);
                reject(err); // This means we got an error and this step failed. We can pass the error object to catch above.
            }
            else {

                console.log("Inside Else Condition", result);

                var currDate = new Date();

                if (result) // User Exists
                {

                    console.log("user Exists");

                    result.first_name = data.first_name;
                    result.last_name = data.last_name;
                    result.email = data.email;
                    result.access_token = tokenInfo.access_token;
                    result.refresh_token = tokenInfo.refresh_token;
                    result.expires_in = currDate.getTime() + tokenInfo.expires_in;
                    result.personal_meeting_url = data.personal_meeting_url;
                    result.timezone = data.timezone;
                    result.pic_url = data.pic_url;
                    result.account_id = data.account_id;

                    result.save(function (updateError, updatedResult) // Saving the updated model
                    {
                        if (updateError) {
                            console.log("Error Occurred in " + url, updateError);

                            reject(updateError);

                        }
                        else {
                            console.log("User Updated");
                            resolve(updatedResult);

                        }

                    });

                }
                else // Create User
                {

                    console.log("User Does Not Exist");

                    var userObj = new User({

                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        access_token: tokenInfo.access_token,
                        refresh_token: tokenInfo.refresh_token,
                        expires_in: currDate.getTime() + tokenInfo.expires_in,
                        personal_meeting_url: data.personal_meeting_url,
                        timezone: data.timezone,
                        pic_url: data.pic_url,
                        user_id: data.id,
                        account_id: data.account_id,
                        created_at: new Date(),
                        updated_at: new Date()

                    });


                    userObj.save(function (err2, result) {
                        if (err2) {
                            console.log("Error Occurred in " + url, err2);

                            reject(err2);

                            logError(url, err2); // Logging necessary for Debugging in Live environment
                        }
                        else {
                            console.log("User Created");
                            resolve(result);
                        }

                    });

                }


            }

        });


    });


}


function logError(url, errorObj) {

    if (process.env.NODE_ENV == 'production') {
        var logobj = {};
        logger.level = "error";
        logobj.timestamp = new Date();
        logobj.readable_time = moment().format('LLL');
        logobj.url = url;
        logobj.error = errorObj;
        logger.log(level, logobj);
    }

}


function sendEmail(fromEmail, toEmail, ccEmail, subject, htmlBody, type, replyToAddresses) {

    var url = "Send Email";
    var log_message = 'URL Called';
    var log_severity = 'Low';
    var log_data = {};
    var log_level = 'info';

    var log_userid = '';


    // Create sendEmail params
    var params = {
        Destination: { /* required */
            CcAddresses: ccEmail,
            ToAddresses: toEmail
        },
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: htmlBody
                },
                Text: {
                    Charset: "UTF-8",
                    Data: ""
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        Source: fromEmail,
        /* required */
        ReplyToAddresses: replyToAddresses,
    };

    // Create the promise and SES service object
    var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    sendPromise.then(
        function (data) {

            console.log('Email Sent Successfully' + ' \nType - ' + type);
            console.log(data.MessageId);

        }).catch(
            function (err) {

                log_level = 'error';
                log_message = 'Send Emails Function';
                log_severity = 'High';

                createLog(log_level, url, 'POST', log_message, log_severity, log_userid, err.stack);

                console.log('Email Sending failed' + '\nType - ' + type);
                console.error(err, err.stack);

            });

}


function getUserInfo(userid) {

    var url = "getUserInfo Function";

    return new Promise(function (resolve, reject) {

        User.findById(userid).exec(function (err, result) {

            if (err) {
                console.log("Error Occurred in " + url, err);
                res.status(500).send({ message: "Oops! Unexpected Error Occurred" });
                res.end();

                reject(err); // This means we got an error and this step failed. We can pass the error object to catch above.
            } else {

                //   console.log(result, "All data result!!!!!!!!!!!");
                resolve(result);
            }

        });

    });

}

function getUserForms(user_id) {

    var url = "getUserForms Function";

    return new Promise(function (resolve, reject) {

        FormTable.find({ "user_id": user_id }).exec(function (err, result) {

            if (err) {
                console.log("Error Occurred in " + url, err);
                res.status(500).send({ message: "Oops! Unexpected Error Occurred" });
                res.end();

                reject(err); // This means we got an error and this step failed. We can pass the error object to catch above.
            } else {

                console.log(result, "All data result!!!!!!!!!!!");
                resolve(result);
            }

        });

    });

}







function checkUserExists(email) {

    var url = "checkUserExists Function"; // As we dont have a url here, we will use the function name

    return new Promise(function (resolve, reject) {

        User.find({ 'email': email }).exec(function (err, user) {

            if (err) {
                // Default error handling, just like we did else where
                console.log("Error", err);
                reject(err); // This means we got an error and this step failed. We can pass the error object to catch above.
            } else {
                // Return success to the function
                if (user.length == 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }


            }

        });


    });


}




function uploadFileToS3(response, mimetype) {

    return new Promise(function (resolve, reject) {

        console.log('called upload function', response);
        var check = moment(new Date(), 'YYYY/MM/DD');
        var day = check.format('D');
        var month = check.format('M');
        var year = check.format('YYYY');
        const filename = response;
        var uuid = uuidv4();

        var type = "mp4";

        if (mimetype == 'video/mp4') {
            type = "mp4";
        } else if (mimetype == 'image/jpeg') {
            type = "jpeg";
        } else if (mimetype == 'image/png') {
            type = "png";
        } else if (mimetype == 'audio/mp3') {
            type = "mp3";
        }

        const filenameS3 = momentTZ(new Date).tz('Asia/Calcutta').format('HH-mm-ss') + '-' + uuid + '.' + type;

        var bucketPath = '';

        if (process.env.NODE_ENV == 'development') {
            bucketPath = 'vidlead-test';
        } else if (process.env.NODE_ENV == 'production') {
            // bucketPath = 'greymetricspdf/'+log_userid+'/'+year+'/'+month+'/'+day;
        }


        var uploadParams = { Bucket: bucketPath, Key: '', Body: '', ACL: 'public-read' };
        //
        // var fileStream = fs.createReadStream(filename);
        //
        //   fileStream.on('error', function(err) {
        //     resolve({data : data, message : 'error'});
        //   });

        uploadParams.Body = response;
        var path = require('path');
        // uploadParams.Key = path.basename(filename);
        uploadParams.Key = filenameS3;

        // call S3 to retrieve upload file to specified bucket
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                console.log("Error", err);

                // if (filename) {
                //   fs.unlinkSync(filename);
                resolve({ data: data, message: 'error' });
                //
                // }

            }
            if (data) {
                console.log("Upload Success", data.Location);

                // if (filename) {

                // fs.unlinkSync(filename);
                resolve({ data: data, message: 'success' });

                // }

            }
        });

    });


}



function encrypt(text) {
    encryptalgo = crypto.createCipher(cipher_algorithm, cipher_key);
    let encrypted = encryptalgo.update(text, 'utf8', 'hex');
    encrypted += encryptalgo.final('hex');
    return encrypted;
}


function decrypt(encrypted) {
    decryptalgo = crypto.createDecipher(cipher_algorithm, cipher_key);
    let decrypted = decryptalgo.update(encrypted, 'hex', 'utf8');
    decrypted += decryptalgo.final('utf8');
    decrypted = decrypted.replace("\"", "");
    decrypted = decrypted.replace("\"", "");
    return decrypted;
}


function requireLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
};







app.post('/register', checkIsLoggedIn, createAccountLimiter, async function (req, res) {
    // const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET;
    // const query = stringify({
    //     secret: CAPTCHA_SECRET,
    //     response: req.body.captcha,
    //     remoteip: req.connection.remoteAddress
    // });
    // const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
    // const body = await fetch(verifyURL).then(res => res.json());
    // if (body.success !== undefined && !body.success) {
    //     // If not successful
    //     res.status(400).send({ message: "Failed to Validate Captcha Please try Again " });
    //     res.end();
    // } else {
    //     // If successful
    //     // return res.json({ success: true, msg: 'Captcha passed' });
    //     // return true;
    //     // execute_register();

    // }

    execute_register();
    async function execute_register() {

        change();

        function change() {
            req.body.name = req.body.name.replace(/[<>]/g, "");
            req.body.email = req.body.email.replace(/[<>]/g, "");
            req.body.password = req.body.password.replace(/[<>]/g, "");

        };
        console.log(req.body, "dataObj");



        var userExists = false;
        if (true) {

            var url = req.url; // This will pick the current url. Will use this for debugging
            var name = req.body.name;
            var email = req.body.email;
            var password = req.body.password;
            var verification_key = uuidv4();
            var api_key = uuidv4();

            try {
                userExists = await checkUserExists(email);
                if (userExists == true) {
                    res.status(403).send({ message: "User already registered" });
                    res.end();
                } else {
                    var hash = bcrypt.hashSync(password, 10);
                    console.log("hash ", hash);
                    var userObj = new User({
                        name: name,
                        email: email,
                        // company: company,
                        password: hash,
                        verification_key: verification_key,
                        api_key: api_key,
                        // These 2 fields are default for all models creation
                        created_at: new Date(),
                        updated_at: new Date()
                    });

                    console.log(userObj, "<<<userObj");
                    userObj.save(async function (err, result) {
                        if (err) {
                            console.log("Error Occurred in " + url, err); // Useful for Testing while Development in Local
                            res.status(403).send({ message: "Oops! Unexpected Error Occurred" });
                            res.end();
                            logError(url, err); // Logging necessary for Debugging in Live environment
                        } else {

                            var hashuser = encrypt(JSON.stringify(result._id));
                            console.log("Hash USERID", hashuser);
                            req.session.user = hashuser;
                            res.status(200).send("data"); // 200 is the success status code
                            res.end();

                        }
                    });
                }
            } catch (e) {
                console.log("Error Occurred in " + url, e); // Useful for Testing while Development in Local
                // Send Error to Front End . Status codes can vary from 400 to 500 based on the need
                // Refer this for more info - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
                res.status(500).send({ message: "Oops! Unexpected Error Occurred" });
                res.end();
                logError(url, err); // Logging necessary for Debugging in Live environment
            }
        }
    }
});


app.post('/login', function (req, res) {

    var url = req.url; // This will pick the current url. Will use this for debugging

    var email = req.body.email;
    var password = req.body.password;


    User.findOne({ 'email': email }).exec(function (err, user) {

        if (err) {
            console.log("Error Occurred in " + url, err); // Useful for Testing while Development in Local

            res.status(500).send({ message: "Oops! Unexpected Error Occurred" });
            res.end();

            logError(url, err); // Logging necessary for Debugging in Live environment
        } else {

            console.log("Login User Check", user);


            if (user == null) {
                res.status(405).send({ message: "Invalid Credentials" });
                res.end();
            } else {
                if (user.is_active == false) {
                    res.status(403).send({ message: "Account Disabled" });
                    res.end();
                } else {

                    bcrypt.compare(password, user.password, function (err1, result) {

                        if (err1) {
                            console.log("Error Occurred in " + url, err1); // Useful for Testing while Development in Local

                            res.status(500).send({ message: "Password compare failed" });
                            res.end();

                            logError(url, err1); // Logging necessary for Debugging in Live environment
                        } else {

                            if (result === true) {
                                var hashuser = encrypt(JSON.stringify(user._id));
                                console.log("Hash USERID", hashuser);
                                req.session.user = hashuser;
                                var data = { data: 'success' }; // Data to be sent to Front End

                                res.status(200).send(data); // 200 is the success status code
                                res.end();
                            } else {
                                res.status(405).send({ message: "Invalid Credentials" });
                                res.end();
                            }


                        }


                    });

                }

            }

        }


    });


});



app.post('/create-custom-response', async function (req, res) {

    var url = req.url;
    var form_id = req.body.form_id;
    var user_id = req.body.user_id;
    var response = req.body.formData;


    console.log(form_id, user_id, "user_iduser_id")
    FormResponseObj = new FormResponseTable({
        'user_id': user_id,
        'form_id': form_id,
        'custom_responses': response,
        'created_at': new Date(),
        'updated_at': new Date()
    });


    FormResponseObj.save(async function (err, result) {
        if (err) {
            console.log("Error Occurred in " + url, err);
            res.status(500).send({ message: "Response creation failed" });
            res.end();
            logError(url, err); // Logging necessary for Debugging in Live environment
        } else {
            console.log(result, "result");
            res.status(200).send({ data: "response created" });
            res.end();
        }
    });

});

function uploadFileToS3(response, user_id, mimetype) {

    return new Promise(function (resolve, reject) {

        var check = moment(new Date(), 'YYYY/MM/DD');
        var day = check.format('D');
        var month = check.format('M');
        var year = check.format('YYYY');
        const filename = response;
        var uuid = uuidv4();

        var type = "mp4";

        if (mimetype == 'video/mp4') {
            type = "mp4";
        } else if (mimetype == 'image/jpeg') {
            type = "jpeg";
        } else if (mimetype == 'image/png') {
            type = "png";
        } else if (mimetype == 'audio/mp3') {
            type = "mp3";
        }
        // else{
        //   type = "";
        //
        // }

        const filenameS3 = momentTZ(new Date).tz('Asia/Calcutta').format('HH-mm-ss') + '-' + uuid + '.' + type;

        var bucketPath = process.env.S3_BUCKET_NAME;

        var uploadParams = { Bucket: bucketPath, Key: '', Body: '', ACL: 'public-read' };


        uploadParams.Body = response;
        var path = require('path');
        uploadParams.Key = filenameS3;

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                console.log("Error", err);

                // if (filename) {
                //   fs.unlinkSync(filename);
                resolve({ data: data, message: 'error' });
                //
                // }

            }
            if (data) {
                console.log("Upload Success", data.Location);

                // if (filename) {

                // fs.unlinkSync(filename);
                resolve({ data: data, message: 'success' });

                // }

            }
        });

    });


}


app.put('/updateUser', requireLogin, async function (req, res) {

    var url = req.url;

    var userid = decrypt(req.session.user);
    var name = req.body.name;
    var company = req.body.company;
    var website = req.body.website;
    var mobile = req.body.mobile;
    var role = req.body.role;
    var company_size = req.body.company_size;

    var logo = req.body.logo;


    User.findById(userid).exec(async function (err, result) {

        if (err) {
            console.log("Error Occurred in " + url, err);


            res.status(500).send({ message: "Proper error message to frontend" });
            res.end();

            logError(url, err); // Logging necessary for Debugging in Live environment
        } else {
            if (name) {
                result.name = name;
            }
            if (company) {
                result.company = company;
            }
            if (website) {
                result.website = website;
            }
            if (mobile) {
                result.mobile = mobile;
            }
            if (role) {
                result.role = role;
            }
            if (req.body.hasOwnProperty('profile_pic')) {
                var logo = req.body.profile_pic;
                const bufferLogo = new Buffer.from(logo.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                var type = logo.split(';')[0].split('/')[1];

                var logoObj = await uploadLogoToS3(bufferLogo, result.name, type);
                result.profile_pic = logoObj.data.Location;
            }


            result.save(function (updateError) // Saving the updated model
            {
                if (updateError) {
                    console.log("Error Occurred in " + url, updateError);

                    res.status(500).send({ message: "Proper error message to frontend" });
                    res.end();

                } else {
                    var data = { data: 'updated' }; // Data to be sent to Front End
                    res.status(200).send(data);
                    res.end();
                }

            });

        }

    });

});


app.put('updatePwd', requireLogin, function (req, res) {

    var url = req.url;

    var password = req.body.password;
    var newpassword = req.body.newpassword;
    var renewpassword = req.body.renewpassword;
    var hash = bcrypt.hashSync(newpassword, 10);


    if (newpassword === renewpassword) {

        User.findOne({ '_id': req.userID }).exec(function (err, user) {

            if (user == null) {


                console.log("Error Occurred in " + url, " No User found");

                res.status(401).send({ message: "Invalid Credentials" });
                res.end();

            } else {

                bcrypt.compare(password, user.password, function (err1, result) {
                    if (result === true) {

                        user.password = hash;

                        user.save(function (err1, result) {
                            if (err1) {
                                console.log("Error Occurred in " + url, " No User found");

                                res.status(401).send({ message: "Please try again" });
                                res.end();

                                logError(url, err);
                            } else {
                                res.status(200).send({ data: "Password changed successfully" });
                                res.end();
                            }
                        });

                    } else {
                        console.log("Error Occurred in " + url, err1);

                        res.status(401).send({ message: "Invalid Credentials" });
                        res.end();

                        logError(url, err1);
                    }
                });

            }

        });

    } else {
        console.log("Error Occurred in " + url, err1);

        res.status(402).send({ message: "Passwords do not match" });
        res.end();

    }

});


function uploadLogoToS3(response, user_name, mimetype) {
    return new Promise(function (resolve, reject) {
        var check = moment(new Date(), 'YYYY/MM/DD');
        var day = check.format('D');
        var month = check.format('M');
        var year = check.format('YYYY');
        const filename = response;
        var uuid = uuidv4();

        if (mimetype == 'jpeg') {
            type = "jpeg";
        } else if (mimetype == 'png') {
            type = "png";
        }
        const filenameS3 = user_name + momentTZ(new Date).tz('Asia/Calcutta').format('HH-mm-ss') + '-' + uuid + '.' + type;


        var bucketPath = 'my-sitetest-bucket';
        if (process.env.NODE_ENV == 'testing') {

            bucketPath = 'S3_BUCKET_NAME';

        } else if (process.env.NODE_ENV == 'production') {

            bucketPath = process.env.S3_BUCKET_NAME;

        }
        var uploadParams = { Bucket: bucketPath, Key: '', Body: '' };

        uploadParams.Body = response;
        var path = require('path');
        uploadParams.Key = filenameS3;


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                console.log("Error", err);

                resolve({ data: err, message: 'error' });

            }
            if (data) {
                console.log("Upload Success", data.Location);

                resolve({ data: data, message: 'success' });

            }
        });
    });
}




// DELETE Requests




app.delete('/deleteWebsite/:id', requireLogin, function (req, res) {

    var id = req.params.id;

    var url = req.url;

    Website.findById(id, function (err, result) {

        if (err) {

            console.log("Error Occurred in " + url, err);

            res.status(500).send({ message: "Failed to delete" });
            res.end();

            logError(url, err);

        } else {
            result.is_del = true;
            result.save(function (err1) {
                if (err1) {
                    console.log("Error Occurred in " + url, err1);

                    res.status(500).send({ message: "Failed to delete" });
                    res.end();

                    logError(url, err);

                } else {

                    var data = { data: 'deleted' }; // Data to be sent to Front End

                    res.status(200).send(data);
                    res.end();

                }
            });

        }

    });


});





