const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new Schema({
    username:   { 
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        min: 6,
        required: 'Username requis',
    },
    email:   { 
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Adresse E-mail requise',
        validate: [validateEmail, 'Veuillez entrer une adresse e-mail valide.'],
    },
    password: {
        type: String,
        require: true,
        trim: true,
        min : 6,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    disabled: {
        type: Boolean,
        default: false
    },
});


UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', UserSchema);
module.exports = User;