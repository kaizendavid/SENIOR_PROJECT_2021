
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



/**This is the UserSchema definition and model creation file used to register users into the mongo database. The email match: uses a REGEX expression.
 * This expression is used so that the email is accepted in the proper format.  The    resetPasswordToken: String,
 * resetPasswordExpire: Date is used when creating a new password and sending the link to the user email.
 */
//schema model definition for mongo
const UserSchema = mongoose.Schema({
     //the following are key/schema type definitions for documents to be added to the User collection
    
    username: {
        type: String,
        required: [true, "please provide a username"]
    },

    email: {
        type: String,
        required: [true, "please provide an email"],
        unique: true,
        //mongo REGEX expression is used to make sure email is the proper format
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
                "please provide a valid email"]
    },

    password: {
        type: String,
        required: [true, "please enter a password"],
        max: 1024,
        minlength: 8,
        select: false   //false = don't return password when doing a mongodb query
    },

    role: {
        //roles can be either user, admin, owner
        type: String,
        required: [true, "please enter your role"],
        default: "user"

    },

    accountType: String,
    licensetotal: Number,
    firstName: String,
    middleName: String,
    lastName: String,
    address: String,
    city: String,
    states: String,
    zipcode: String,
    month: String,
    day: String,
    year: String,
    gender: String,
    phone: String,
    usingCreditCard: Boolean,
    licenseIdNumber: String,


    //track of coursework
    lastLesson: { module: Number, lessonId: Number },    
    modulesCompleted: [{ module: Number, lessonIds: [Number], moduleFinish: Boolean }],


    //used for password reset link token sent by email
    resetPasswordToken: String,
    resetPasswordExpire: Date,


}, {

    //used to add timestamp when the user was added to the database  
    timestamps: true,
});



//Create the model schema for export
const User = mongoose.model("User", UserSchema);

module.exports = User;