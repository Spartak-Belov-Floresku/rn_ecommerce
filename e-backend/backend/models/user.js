const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Enforce unique constraint
        trim: true,   // Remove leading and trailing spaces
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true, // Enforce unique constraint
        trim: true,   // Remove leading and trailing spaces
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    }
})

userSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Converts the ObjectId to a string
});

// Ensure the virtuals are included in JSON output
userSchema.set('toJSON', { virtuals: true });

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
