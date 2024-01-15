const { Schema, Types } = require('mongoose');
const { formatTime } = require('../utils/formatTime.js')

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: ()=> new Types.ObjectId
        },
        username: {
            type: String,
            required: true
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 1000
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    {
        toJSON: {
            getters: true,
            virtuals: true
        },
        id: false
    }
);

reactionSchema.virtual('createdAt')
.get(()=>{
    return formatTime(this.timestamp);
})

module.exports = reactionSchema;