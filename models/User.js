const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');



const UserSchema = new Schema({
    username:{
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String, 
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// NEED function keyword or else isModified() is not a function 
// UserSchema.pre('save', async function (next) {
//     if (this.isNew || this.isModified("password")){
//         const salt = 10;
//         this.password = await bcrypt.hash(this.password, salt);
//     }
//     next() ;
// });

const User = model('user', UserSchema);

module.exports = User