const { Schema, Types } = require('mongoose');
const formatTime = require('../utils/formatTime.js')

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: ()=> new Types.ObjectId()
        },
        username: {
            type: String,
            required: true
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: time => formatTime(time)
        }
    },
    {
        toJSON: {
            getters: true
        },
        id: false
    }
);

module.exports = reactionSchema;