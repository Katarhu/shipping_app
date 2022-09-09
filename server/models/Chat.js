const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    members: { type: Array },
    messages: [{
        sender: { type: String },
        text: { type: String },
        created_at: { type: String }
    }]
}, { timestamps: {
        createdAt: "created_date",
        updatedAt: "updated_date"
} });


module.exports = {
    Chat: mongoose.model('Chat', ChatSchema)
}