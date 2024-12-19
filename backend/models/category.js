const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String
    },
    icon: {
        type: String
    },
    // image: {
    //     type: String,
    //     default: ''
    // },

});

categorySchema.virtual('id').get(function () {
    return this._id.toHexString(); // Converts the ObjectId to a string
});

// Ensure the virtuals are included in JSON output
categorySchema.set('toJSON', { virtuals: true });

exports.Category = mongoose.model('Category', categorySchema);
