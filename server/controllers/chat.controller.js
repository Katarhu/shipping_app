const { Chat } = require('../models/Chat');
const ApiError = require('../error/ApiError');

class ChatController {
    async createChat(req, res, next) {
        try {
            const { companionId } = req.body;

            const isChat = await Chat.findOne({ members: { $all: [companionId, req.user._id]}});

            if( isChat ) return res.status(200).json({chatId: isChat._id});

            const newChat = new Chat({
                members: [req.user._id, companionId]
            });

            await newChat.save();

            res.status(200).json({ chatId: newChat._id });

        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
    async getConversations(req, res, next) {
        try {
            const user = req.user;

            const conversations = await Chat.find({
                members: { $in: [user._id]}
            }).sort({updated_date: -1})

            return res.status(200).json(conversations);

        } catch (err) {
            return next(ApiError.internalError(err.message))
        }
    }
    async addMessage(req, res, next) {
        try {
            const { id: _id } = req.params;

            const { text } = req.body;

            const message = {
                sender: req.user._id,
                text,
                created_at: new Date().toLocaleDateString(),
            };

            await Chat.findByIdAndUpdate(_id, {$push: { messages: message}});

            return res.status(200).json({message: 'ok'});

        } catch (err) {
            return next(ApiError.internalError(err.message))
        }
    }
    async deleteChat(req, res, next) {
        try {
            const { id: _id} = req.params;

            const chat = await Chat.findById(_id);

            if( !chat ) return next(ApiError.badRequest('Chat doesn\'t exist'));

            if( !chat.members.includes(req.user._id)) return next(ApiError.forbidden('This operation is forbidden'));

            await Chat.findByIdAndDelete(_id);

            return res.status(200).json({message: success });
        } catch (err) {
            return next(ApiError.internalError(err.message));
        }
    }
}

module.exports = new ChatController();