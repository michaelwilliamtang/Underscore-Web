const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const PostSchema = new Schema({
    link: {
        type: String,
        required: true
    },
    // hostname: {
    //     type: String,
    //     required: true
    // },
    snippet: {
        type: String,
        required: true
    },
    visib: {
        type: String,
        defaultt: 'public'
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    comments: [{
        commentBody: {
            type: String,
            required: true
        },
        commentDate: {
            type: Date,
            default: Date.now
        },
        commentUser: {
            type: Schema.Types.ObjectId,
            ref:'users'
        }
    }],
    tags: [String],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('posts', PostSchema);
