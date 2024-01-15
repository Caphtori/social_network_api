const { reset } = require('nodemon');
const { User, Thought } = require('../models');
const { findOneAndDelete } = require('../models/User');


module.exports = {
    async getUsers(req, res){
        try{
            const users = await User.find();
            res.json(users);
        } catch(err){
            res.status(500).json(err);
        };
    },

    async getSingleUser(req, res){
        try{
            const user = await User.findOne({ _id: req.params.userId });
            if (!user){
                return res.status(404).json({ message: 'User not found.' });
            };

            res.json(user)
        } catch(err){
            res.status(500).json(err);
        }
    },

    async createleUser(req, res){
        try{
            const user = await User.create(req.body);
            res.json(user);
        } catch(err){
            res.status(500).json(err);
        }
    },

    async deleteUser(req, res){
        try{
            const user = await User.findOneAndDelete({ _id: req.params.userId });
            if (!user){
                return res.status()
            }
            const deleteThoughts = await Thought.deleteMany({ _id: { $in: user.thoughts } });
            const deleteReactions = await Thought.updateMany(
                { reactions: { username: user.username } },
                { $pull: { reactions: { username: username } } },
                { new: true }
            );
            const users = await User.updateMany(
                { _id: { $in: user.friends } },
                { $pull: { friends: user._id } },
                { new: true }
            );
            
            res.json({ message: 'User and associated thoughts, reactions, and friend list entries deleted.' })

        } catch(err){
            res.status(500).json(err);
        }
    },

    async addFriend(req, res){
        try{
            const friend = await User.find({ _id: req.params.friendId });
            if (!friend){
                return res.status(404).json({ message: 'Friend not found.' });
            };

            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { friends: friend._id } },
                { new: true }
            );

            if (!user){
                return res.status(404).json({ message: 'User not found.' });
            };

            res.json(user);
        } catch(err){
            res.status(500).json(err);
        }
    },

    async removeFriend(req, res){
        try{
            const friend = await User.find({ _id: req.params.friendId });
            if (!friend){
                return res.status(404).json({ message: 'Friend not found.' });
            };

            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $pull: { friends: friend._id } },
                { new: true }
            );

            if (!user){
                return res.status(404).json({ message: 'User not found.' });
            };

            res.json(user);
        } catch(err){
            res.status(500).json(err);
        };
    }
}