/**************************************************************************** */
//import Auth Schema
var Auth = require('../app/Schemas/auth');
//import Profile Schema
var Profile = require('../app/Schemas/profile');
//import Papers Schema
var Paper = require('../app/Schemas/papers');
//import task Schema
var Event = require('../app/Schemas/events');
//import Country Schema
var Country = require('../app/Schemas/countries');
//import Institution Schema
var Institution = require('../app/Schemas/institutions');
//import configuration properties
var PROP = require('../prop');
//import json to token/ token to json framework
var jsonWebToken = require('jsonwebtoken');
//import nodenodeMailer 
var nodeMailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
//import randomstring 
var randomstring = require("randomstring");
//import cloudnary
var cloudinary = require('cloudinary');
//import moduel mkdirp
var mkdirp = require('mkdirp');


//import file system library
var fs = require("fs");


cloudinary.config(PROP.cloudinary);

//configure mail transporter  
var transporter = nodeMailer.createTransport(smtpTransport({
    host: "smtp.gmail.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: "fuzumoe@gmail.com",
        pass: "1987adam"
    }
}));
/**************************************************************************** 
 * mail option object example 
var mailOptions = {
    from: 'example@gmail.com>', // sender address
    to: 'receiver@destination.com', // list of receivers
    subject: 'Email Example', // Subject line
    text: text //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};*/

/**************************************************************************** */
//ecnryption key
var secretKey = PROP.EncrptionKey;
//create auth token
var createToken = function(user, profile) {
        var token = jsonWebToken.sign({
            id: user._id,
            email: user.emial
        }, secretKey, {
            expiresIn: 60 * 60 * 24
        });

        return token;
    }
    /**************************************************************************** */

/**************************************************************************** */
//send mail
var sendMail = function(data) {

    transporter.sendMail(data, function(error, info) {
        if (error) {
            console.log("this error" + error);

        } else {
            console.log('Message sent: ' + info.response);

        };
    });
}

/****************************************************************************/
/**************************************************************************** */
// RESTful service module
module.exports = function(app, express) {
    //webservice
    var webService = express.Router();


    /*********************************/
    /*********************************/
    //generate temporary password service
    webService.post('/temppassword',
        function(req, res) {
            //temp password
            var temppassword = randomstring.generate({ length: 4, charset: 'alphabetic' });
            console.log(temppassword);
            // authenticate user after signup
            Auth.remove({ email: req.body.email }, function(err) {
                if (err) {
                    console.log(err);
                }


            });
            auth = new Auth({ email: req.body.email, password: temppassword });
            auth.save(function(err) {
                if (err) console.log(err);
                else {
                    sendMail({
                        from: 'fuzumoe@gmail.com', // sender address
                        to: req.body.email, // list of receivers
                        subject: 'TEAM::ALPHA:>>Passwrod reseted!!!', // Subject line
                        html: '<b>Your temporary password is <u>' + temppassword + '</u> </b>'
                    });
                    res.json({
                        success: true,
                        message: "Successfully reseted password",
                    });

                }
            });

        });
    /*********************************/
    /*********************************/
    //get list of countries list
    webService
        .get('/countries', function(req, res) {

            Country.find({})
                //select name username password fields
                .select('name').exec(function(err, countries) {
                    if (err) throw err;
                    else res.json(
                        countries
                    );
                });

        })
        /*********************************/
        /*********************************/
        //get list of institutions list
    webService.route('/institutions')
        .get(function(req, res) {

            Institution.find({})
                //select name username password fields
                .select('name').exec(function(err, institution) {
                    if (err) throw err;
                    else res.json(institution);
                });

        })
        .post(function() {

            var institution = req.body.data;

            institution = new Institution({ name: institution.name });
            institution.save(function(err) {
                if (err) console.log(err)
                else res.json({
                    success: true,
                    message: "Successfully added  Institute!",
                    url: result.url
                });

            });


        });
    /*********************************/
    /*********************************/
    //upload users Image and update profile service  
    webService
        .post('/updateProfile', function(req, res) {

            if (req.body.data.prop == "upload") {
                var image = req.body.file;
                console.log(req.body.data.filename);


                var file = "./public/assets/" + req.body.data.email + "/" + req.body.data.filename;
                var dir = "./public/assets/" + req.body.data.email + "/"

                var format = req.body.data.filename.split('.');
                if (format[1] == "jpg")
                    var image = image.replace('data:image/jpeg;base64', '');
                else
                    var image = image.replace('data:image/png;base64', '');

                mkdirp(dir, function(err) {
                    if (err) console.error(err)
                    else {
                        fs.writeFile(file, image, 'base64', function(err) {
                            if (err) console.log(err);
                            else {

                                cloudinary.uploader.upload(file, function(result) {
                                    console.log(result)

                                    Profile.update({ email: req.body.data.old_email }, {
                                            full_name: req.body.data.full_name,
                                            email: req.body.data.email,
                                            dob: req.body.data.dob,
                                            in_id: req.body.data.insid,
                                            nationality: req.body.data.nat,
                                            gender: req.body.data.gender,
                                            address: req.body.data.address,
                                            image: result.url
                                        },
                                        function(err, numberAffected, rawResponse) {
                                            if (err) console.log(err);
                                            else {

                                                res.json({
                                                    success: true,
                                                    message: "Successfully updated  profile!",
                                                    url: result.url
                                                });
                                            }
                                        });
                                });
                            }
                        });
                    }
                });


            } else {

                Profile.update({ email: req.body.data.old_email }, {
                        full_name: req.body.data.full_name,
                        email: req.body.data.email,
                        dob: req.body.data.dob,
                        in_id: req.body.data.insid,
                        nationality: req.body.data.nat,
                        gender: req.body.data.gender,
                        address: req.body.data.address
                    },
                    function(err, numberAffected, rawResponse) {
                        if (err) console.log(err);
                        else {

                            res.json({
                                success: true,
                                message: "Successfully updated  profile!"
                            });
                        }
                    });

            }

        });
    /*********************************/
    /*********************************/
    //upload users Image and update profile service variant
    webService
        .post('/upload', function(req, res) {

            // var name = req.body.name;
            var pdf = req.body.file;

            var file = "./public/assets/" + req.body.data.paper_event + "/" + req.body.data.auther_email + "/paper.pdf";
            var dir = "./public/assets/" + req.body.data.paper_event + "/" + req.body.data.auther_email + "/";



            var paperData = {
                auther_name: req.body.data.auther_name,
                auther_email: req.body.data.auther_email,
                paper_event: req.body.data.paper_event,
                paper_disc: req.body.data.paper_disc,
                paper: file
            };

            paper = new Paper(paperData);
            console.log(paperData)

            var pdf = pdf.replace('data:application/pdf;base64,', '');

            res.send('received');

            mkdirp(dir, function(err) {
                if (err) console.error(err)
                else {
                    fs.writeFile(file, pdf, 'base64', function(err) {
                        if (err) console.log(err);
                        else {
                            paper.save(function(err) {
                                if (err) console.log(err)
                                else {

                                    sendMail({
                                        from: 'fuzumoe@gmail.com', // sender address
                                        to: req.body.data.auther_email, // list of receivers
                                        subject: 'TEAM::ALPHA:>>Confirmation Email✔!', // Subject line
                                        html: '<b>Your conference paper has been recieved thank you</b>'
                                    });

                                    res.json({
                                        success: true,
                                        message: "Successfully submited paper!"
                                    });
                                }

                            });
                        }
                    });
                }
            });

        });
    /*********************************
     * signup service
     */
    webService.post('/signup',

        function(req, res) {

            //profile schema variable
            var profile;
            //user  schema variable
            var auth;


            //if user supplied user image for profie
            if (req.body.image) {
                //creat user profile data for profile Schema
                profile = new Profile({ full_name: req.body.full_name, email: req.body.email, image: req.body.image });
                //creat user auth data for Auth Schema
                auth = new Auth({ email: req.body.email, password: req.body.password, active: true });
            } else {
                //creat user profile data for profile Schema
                profile = new Profile({ full_name: req.body.full_name, email: req.body.email });
                //creat user auth data for Auth Schema
                auth = new Auth({ email: req.body.email, password: req.body.password });
            }
            //save profile to mongoDB
            profile.save(function(err) {
                if (err) {
                    console.log(err);
                    res.send({ success: false, message: "Already registred, please login!" });
                    return;
                } else {
                    auth.save(function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        // authenticate user after signup
                        Auth.findOne({
                                email: req.body.email
                            })
                            //select name username password fields
                            .select('_id full_name email image gender address dob in_id nationality').exec(function(err, user) {
                                if (err) throw err;
                                if (user) {
                                    var confirmatio = user._id;
                                    // else create token
                                    var userProfileData = {
                                        name: profile.full_name,
                                        image: profile.image,
                                        dob: profile.dob,
                                        address: profile.address,
                                        email: profile.email,
                                        in_id: profile.in_id,
                                        nationality: profile.nationality,
                                        gender: profile.gender
                                    };

                                    //user token
                                    var token = createToken(user);
                                    if (req.body.image) {
                                        sendMail({
                                            from: 'fuzumoe@gmail.com', // sender address
                                            to: req.body.email, // list of receivers
                                            subject: 'TEAM::ALPHA:>>Viva You made it✔!', // Subject line
                                            html: '<b>Glad to have you on, we have a lot to do </b>'
                                        });
                                        //send success plus token object as json if password match
                                        res.json({
                                            success: true,
                                            message: "Successfully login!",
                                            token: token,
                                            profile: userProfileData
                                        });
                                    } else {
                                        sendMail({
                                            from: 'fuzumoe@gmail.com', // sender address
                                            to: req.body.email, // list of receivers
                                            subject: 'TEAM::ALPHA:>>Viva You made it✔!', // Subject line
                                            html: '<b>Glad to have you on, we have a lot to do <br/>' +
                                                'Here is your confirmation key ::   <u>' + user._id + '</u> :: to activate your account < /b>' + '<p>use if you already cloesed the sighn up page</p><i>http://localhost:3000/confirm</i>'
                                        });
                                        //send success plus token object as json if password match
                                        res.json({
                                            success: true,
                                            token: token,
                                            message: "Successfully Signedup!",
                                        });
                                    }

                                }
                            });
                    });
                }
            });
        });
    /*********************************/
    /*********************************/
    //confirm and activate account
    webService.post('/confirm',
        function(req, res) {
            // authenticate user after signup
            Auth.update({ _id: req.body.code }, {
                active: true
            }, function(err, numberAffected, rawResponse) {
                if (err) console.log(err);
                else {
                    console.log(numberAffected);
                    console.log(rawResponse);
                    //find maching user mongoDB query
                    Auth.findOne({
                            _id: req.body.code
                        })
                        //select name username password fields
                        .select('email').exec(function(err, user) {
                            if (err) throw err;

                            else {
                                var profile = Profile.findOne({ email: user.email })
                                    .select('full_name image').exec(function(err, profile) {
                                        // else create token
                                        if (err) throw err;
                                        var userProfileData = {
                                            name: profile.full_name,
                                            image: profile.image
                                        };
                                        var token = createToken(user);
                                        //send success plus token object as json if password match
                                        res.json({
                                            success: true,
                                            message: "Successfully login",
                                            token: token,
                                            profile: userProfileData
                                        });
                                    });
                            }
                        });
                }
            });
        });
    /*********************************/
    /*********************************
     *  send email service
     */
    webService
        .post('/sendMail', function(req, res) {


            //****.sharma3@****.com, ****.bussa@****.com, ****.gawri@****.com

            if (req.body.multi) {
                //find user mongoDB query
                Profile.find({}, function(err, users) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        for (var user in users) {
                            sendMail({
                                from: 'fuzumoe@gmail.com', // sender address
                                to: users[user].email, // list of receivers
                                subject: req.body.subject, // Subject line
                                html: '<p>' + req.body.msg + '</p>'

                            });
                        };
                    }
                });
            }

            sendMail({
                from: 'fuzumoe@gmail.com', // sender address
                to: req.body.to, // list of receivers
                subject: req.body.subject, // Subject line
                html: '<p>' + req.body.msg + '</p>'

            });
            res.json({
                success: true,
                message: "Successfully sent message!"
            });

        });
    /*********************************/
    /*********************************/

    //send email to selected user service
    webService
        .post('/sendMailSelected', function(req, res) {


            var emails = req.body.to.split(' ');

            for (var i = 0; i <= emails.length; i++) {
                sendMail({
                    from: 'fuzumoe@gmail.com', // sender address
                    to: emails[i], // list of receivers
                    subject: req.body.subject, // Subject line
                    html: '<p>' + req.body.msg + '</p>'

                });

            }

            res.json({
                success: true,
                message: "Successfully sent message!"
            });

        });


    /*********************************/
    /*********************************
     * users service
     *  get list of users service
     */
    webService.route('/users')
        .get(function(req, res) {
            //find user mongoDB query
            Profile.find({ in_id: { $ne: "chair" } }, function(err, users) {
                if (err) {
                    console.log(err);
                    return;
                }
                //send users list as json
                res.json(users);
            });
        })
        //register user
        .post(function(req, res) {
            //usre id as confimation id
            var confirmation;
            var temppassword = randomstring.generate({ length: 4, charset: 'alphabetic' });
            //creat user profile data for profile Schema
            var profile = new Profile({ full_name: req.body.full_name, in_id: req.body.insId, email: req.body.email });
            //creat user auth data for Auth Schema
            var auth = new Auth({ email: req.body.email, password: temppassword, pri: '11' });

            //save profile to mongoDB
            profile.save(function(err) {
                if (err) {
                    console.log(err);

                    return;
                } else {
                    auth.save(function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        Auth.findOne({
                                email: req.body.email
                            })
                            //select name username password fields
                            .select('_id')
                            .exec(function(err, user) {
                                if (err) {
                                    console.log(err);
                                    ret
                                    urn;
                                } else {
                                    confirmation = user._id;
                                }
                            });

                        sendMail({
                            from: 'fuzumoe@gmail.com', // sender address
                            to: req.body.email, // list of receivers
                            subject: 'TEAM::ALPHA:>>Viva You made it✔!', // Subject line
                            html: '<b>You have been regisered tot team Alpha  Content mangement System, Glad to have you on, we have a lot to do!<br>  your username is <u>' + req.body.email + '</u><br> ' +
                                'your temporary password  <u>' + temppassword + '</u><br>   your confirmation key ::   <u>' + confirmation + '</u> :: to activate your account  </b> <p>  if you already closed the sign up page</p><i>http://localhost:3000/confirm</i>'
                        });
                        //send success plus token object as json if password match
                        res.json({
                            success: true,
                            message: "Successfully registered a user!"
                        });
                    });
                }
            });
        })
        //update user
        .put(function(req, res) {

            Auth.update({ email: req.body.email }, {
                active: req.body.active
            }, function(err, numberAffected, rawResponse) {
                if (err) console.log(err);
                else {
                    console.log(numberAffected);
                    console.log(rawResponse);
                    //find maching user mongoDB query
                    Auth.findOne({
                            email: req.body.email
                        })
                        //select name username password fields
                        .select('email').exec(function(err, user) {
                            if (err) throw err;

                            else {
                                sendMail({
                                    from: 'fuzumoe@gmail.com', // sender address
                                    to: req.body.email, // list of receivers
                                    subject: 'TEAM::ALPHA:>>Viva You made it✔!', // Subject line
                                    html: '<b>Your account has been activated   </b>'
                                });
                                //send success plus token object as json if password match
                                res.json({
                                    success: true,
                                    message: "Successfully deactivated user!"
                                });
                            }
                        });
                }
            });

        })
        //delete user
        .delete(function(req, res) {

            Auth.update({ email: req.body.email }, {
                active: req.body.active
            }, function(err, numberAffected, rawResponse) {
                if (err) console.log(err);
                else {
                    console.log(numberAffected);
                    console.log(rawResponse);
                    //find maching user mongoDB query
                    Auth.findOne({
                            email: req.body.email
                        })
                        //select name username password fields
                        .select('email').exec(function(err, user) {
                            if (err) throw err;

                            else {
                                sendMail({
                                    from: 'fuzumoe@gmail.com', // sender address
                                    to: req.body.email, // list of receivers
                                    subject: 'TEAM::ALPHA:>>!Your account is suspended▬!', // Subject line
                                    html: '<b>Your account has been suspended, < /b>'
                                });
                                //send success plus token object as json if password match
                                res.json({
                                    success: true,
                                    message: "Successfully deactivated user!"
                                });
                            }
                        });
                }
            });

        });
    /*********************************/
    /*********************************
     *  login service
     */
    webService.post('/login', function(req, res) {
        //find maching user mongoDB query
        Auth.findOne({
                email: req.body.email
            })
            //select name username password fields
            .select('email password pri').exec(function(err, user) {
                if (err) throw err;

                if (!user) {
                    //send fail message as json
                    res.send({ message: "User doesn't exist" });
                } else if (user) {
                    //if user found compare password to posted password
                    var validPassword = user.comparePassword(req.body.password);

                    if (!validPassword) {
                        //send fail message as json if password does not match
                        res.send({ message: "Invalid Password" });
                    } else {

                        var profile = Profile.findOne({ email: req.body.email })
                            .select('_id full_name email image gender address dob in_id nationality').exec(function(err, profile) {
                                // else create token
                                if (err) throw err;
                                var userProfileData = {
                                    name: profile.full_name,
                                    image: profile.image,
                                    dob: profile.dob,
                                    address: profile.address,
                                    email: profile.email,
                                    in_id: profile.in_id,
                                    nationality: profile.nationality,
                                    gender: profile.gender
                                };
                                console.log(userProfileData);
                                var token = createToken(user);
                                var pri = false;
                                if (user.pri == "11") pri = true;
                                //send success plus token object as json if password match
                                res.json({
                                    success: true,
                                    message: "Successfully login",
                                    token: token,
                                    profile: userProfileData,
                                    pri: pri
                                });
                            });


                    }
                }
            });
    });
    // /*********************************/

    /*********************************/
    /**
     * evetns service
     */
    //register events
    webService.route('/sendinvitation')
        .post(function(req, res) {
            //    console.log(req.body);
            Event.findOne({ _id: req.body.event_id })
                .select('_id event event_disc date_time')
                .exec(function(err, event) {
                    var disc = new String(event.event_disc);
                    var date = new String(event.date_time);
                    if (err) console.log(err);
                    else {

                        var message = '<b>'.concat(disc).concat(disc)
                            .concat(date).concat('</b>').concat('<p> You Have been Envited to event.date_time,   event.event_disc ')
                            .concat(req.body.message).concat('</p>');

                        sendMail({
                            from: 'fuzumoe@gmail.com', // sender address
                            to: req.body.to, // list of receivers
                            subject: 'TEAM::ALPHA:>>Envited for!' + event.event, // Subject line
                            html: message
                        });

                    }
                });


        });
    /*********************************/
    /**
     * tasks service
     */
    //register tasks
    webService.route('/tasks')
        .post(function(req, res) {
            console.log(req.body.data);
            // var paper = new Paper({

            //     auther_name: { type: String, required: true },
            //     auther_email: { type: String, required: true },
            //     paper_disc: { type: String, required: true },
            //     paper_event: { type: String, required: true },
            //     event_id: { type: String, required: true },
            //     paper: { type: String, required: true },
            //     key_words: { type: String, required: false },

            // });
            // event.save(function(err) {
            //     if (err) {

            //         res.send({
            //             success: false,
            //             message: err
            //         });
            //         console.log(err);
            //     } else res.send({
            //         success: true,
            //         message: "Successfully registered event"
            //     });

            // });
            // res.send({
            //     success: true,
            //     message: "Successfully Sent Invitations"
            // });

        })
        /*********************************/
        /*********************************/
        //get taks
        .get(function(req, res) {

            Task.find({})
                //select name username password fields
                .select(' _id sub_id reviewr status rank ').exec(function(err, task) {
                    if (err) console.log(err);
                    console.log(task);
                    res.json(task);



                });

        })
        /*********************************/
        /*********************************/
        //update tasks
        .put(function(req, res) {

            Event.update({ _id: req.body.id }, {
                event: req.body.event,
                event_disc: req.body.event_disc,
                date_time: req.body.date_time
            }, function(err, numberAffected, rawResponse) {
                if (err) console.log(err);
                else res.send({
                    success: true,
                    message: "Successfully updated event"
                });

            });

        })
        /*********************************/
        /*********************************/
        //delete tasks
        .delete(function(req, res, next) {
            console.log(req.body);
            Task.remove({ _id: req.body.id }, function(err, removed) {
                if (err) {
                    console.log(err);
                } else {
                    res.send({
                        success: true,
                        message: "Successfully deleted Task",
                        data: removed
                    });
                }

            });


        });
    /*********************************/
    /*********************************/
    /**
     * papers service
     */
    //upload papers
    webService.route('/papers')
        .post(function(req, res) {

            // console.log(req.body.data);
            var emails = req.body.data.emails;
            var Message = req.body.data.message;
            for (var i in emails) {
                console.log(emails[i].email);
                sendMail({
                    from: 'fuzumoe@gmail.com', // sender address
                    to: emails[i].email, // list of receivers
                    subject: 'TEAM::ALPHA:>>Conferece Envitation ✔!', // Subject line
                    html: Message
                });
            }

            res.send({
                success: true,
                message: "Successfully Sent Invitations"
            });

        })
        /*********************************/
        /*********************************/
        //get papers
        .get(function(req, res) {

            Task.find({})
                //select name username password fields
                .select(' _id sub_id reviewr status rank ').exec(function(err, task) {
                    if (err) console.log(err);
                    console.log(task);
                    res.json(task);



                });

        })
        /*********************************/
        /*********************************/
        //update papers
        .put(function(req, res) {

            Event.update({ _id: req.body.id }, {
                event: req.body.event,
                event_disc: req.body.event_disc,
                date_time: req.body.date_time
            }, function(err, numberAffected, rawResponse) {
                if (err) console.log(err);
                else res.send({
                    success: true,
                    message: "Successfully updated event"
                });

            });

        })
        /*********************************/
        /*********************************/
        //delete papers
        .delete(function(req, res, next) {
            console.log(req.body);
            Task.remove({ _id: req.body.id }, function(err, removed) {
                if (err) {
                    console.log(err);
                } else {
                    res.send({
                        success: true,
                        message: "Successfully deleted Task",
                        data: removed
                    });
                }

            });


        });
    /*********************************/

    /*********************************/
    /**
     * evetns service
     */
    //register events
    webService.route('/events')
        .post(function(req, res) {
            var host = "admin"
            if (host != "" || host != null) {
                host = req.body.host;
            }
            console.log(req.body);
            event = new Event({
                event: req.body.event,
                event_disc: req.body.event_disc,
                date_time: req.body.date_time,
                end_time: req.body.end_time,
                sub_end: req.body.sub_end,
                host: host
            });
            event.save(function(err) {
                if (err) {

                    res.send({
                        success: false,
                        message: err
                    });
                    console.log(err);
                } else res.send({
                    success: true,
                    message: "Successfully registered event"
                });

            });

        })
        /*********************************/
        /*********************************/
        //get events
        .get(function(req, res) {

            Event.find({
                    opened: true
                })
                //select name username password fields
                .select('_id event event_disc date_time end_time sub_end host').exec(function(err, event) {
                    if (err) console.log(err);

                    console.log(event);
                    res.json(event);



                });

        })
        /*********************************/
        /*********************************/
        // update events
        .put(function(req, res) {

            Event.update({ _id: req.body.id }, {
                event: req.body.event,
                event_disc: req.body.event_disc,
                date_time: req.body.date_time,
                end_time: req.body.end_time,
                sub_end: req.body.sub_end,
                host: host
            }, function(err, numberAffected, rawResponse) {
                if (err) console.log(err);
                else res.send({
                    success: true,
                    message: "Successfully updated event"
                });

            });

        })
        /*********************************/
        /*********************************/
        //delete events
        .delete(function(req, res) {

            Event.update({ _id: req.body._id }, {
                opened: false
            }, function(err, numberAffected, rawResponse) {
                if (err) console.log(err);
                else res.send({
                    success: true,
                    message: "Successfully closed event"
                });

            });

        });
    /*********************************/


    // /*********************************
    //  *  evaluate users visitin site
    //  */
    webService.use(function(req, res, next) {
        console.log("analyzing vistor");
        // get token from visiting user to check if there is late login session
        var token = req.query['x-access-token'] || req.headers['x-access-token'];
        console.log("token: " + token);
        // check if token matches existing token
        if (token) {
            //jsonWebToken compares vistors token to existing registered token
            jsonWebToken.verify(token, secretKey, function(err, decoded) {
                if (err) {
                    //send fail message as json if error.
                    res.status(403).send({ success: false, message: "Failed to authenticate user" });
                } else {
                    //else decode token and move to next proccess
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            //if there is no match to users token send failur message as token
            res.status(403).send({ success: false, message: "No token Provided" });
        }

    });

    /*********************************/
    /*********************************
     *  user profile services
     */
    webService.route('/myprofile')
        .get(function(req, res) {

        })
        .put(function(req, res) {

        });

    /*********************************
     *  user profile services
     */
    webService.route('/profile')
        // create user profile
        .post(function(req, res) {
            console.log(req.body.password);
            //create profile
            var profile = new Profile({
                full_name: req.body.full_name,
                email: req.body.email,
                // image: req.body.image
            });


            //save profile to mongoDB
            profile.save(function(err) {
                if (err) {
                    console.log(err);
                    res.send(err);
                    return;
                } else {
                    auth.save(function(err) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }
                        res.json({
                            success: true,
                            message: "Successfully Signed up",
                            token: token
                        });
                    });
                }

            });


        })
        // get user profile
        .get(function(req, res) {
            //find matching profile mongoDB query
            Profile.find({ creator: req.decoded.id }, function(err, profile) {
                if (err) {
                    //send error if error
                    res.send(err);
                    return;
                }
                //send user profile  if found as json
                res.json(stories)
            });
        });
    /*********************************/
    /*********************************
     *  get current user profile services
     */
    webService.get('/me', function(req, res) {
        //send user profile
        res.json(req.decoded);
    });
    /*********************************/
    return webService;

};
/*********************************/