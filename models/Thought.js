const { Schema, model } = require('mongoose');
const { reactionSchema } = require('./Reaction.js');
const { timeFormat } = require('../utils/formatTime.js');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: time => timeFormat(time)
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            getters: true
        },
        id: false
    }
);

thoughtSchema.virtual('reactionCount')
.get(()=>{
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;