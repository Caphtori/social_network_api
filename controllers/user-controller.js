const { User, Thought } = require('../models');


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

    async createUser(req, res){
        try{
            const user = await User.create(req.body);
            res.json(user);
        } catch(err){
            res.status(500).json(err);
        }
    },

    async updateUser(req, res){
        try{
            // const initUser = await User.findOne({ _id: req.params.userId });
            // if (!initUser){
            //     return res.status(404).json({ message: 'User not found.' });
            // }
            // const originalUsername = initUser.username;

            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { 
                    runValidators: true,
                    new: true
                }
            );
            
            if (!user){
                return res.status(404).json({ message: 'User not found.' });
            };

            // if (req.body.username){
            //     const updateThoughts = await Thought.updateMany(
            //         { _id: { $in: user.posts } },
            //         { $set: {username: req.body.username} },
            //         { new: true }
            //     );
            //     const allThoughts = await Thought.find();
            //     const userReactions = allThoughts.filter((thought)=>{
            //         for (let i=0; i<thought.reactions.length; i++){
            //             if (thought.reactions[i].username===user.username){
            //                 return true;
            //             };
            //             return false
            //         }
            //     });
    
            //     userReactions.forEach(async(thought)=>{
            //         const reactionUpdates = thought.reactions.filter((reaction)=>{
            //             if (reaction.username===originalUsername){
            //                 return true;
            //             };
            //             return false;
            //         }).forEach(async (e)=>{
            //             e.username=req.body.username;
            //             await Thought.findOneAndUpdate(
            //                 { _id: thought._id },
            //                 { $addToSet: { reactions: e } },
            //                 { new: true }
            //             );
            //         })
            //         await Thought.findOneAndUpdate(
            //             { _id: thought._id },
            //             { $pull: { reactions: { username: originalUsername } } },
            //             { new: true }
            //         );
                    
            //     })
            // };
            res.json(user);
        } catch(err) {
            console.log(err);
            res.status(500).json(err);
        };
    },

    async deleteUser(req, res){
        try{
            const user = await User.findOneAndDelete({ _id: req.params.userId });
            if (!user){
                return res.status(404).json({ message: 'User not found.' })
            }
            const deleteThoughts = await Thought.deleteMany({ _id: { $in: user.thoughts } });
            // const deleteReactions = await Thought.updateMany(
            //     { reactions: { username: user.username } },
            //     { $pull: { reactions: { username: user.username } } },
            //     { new: true }
            // );
            const allThoughts = await Thought.find();
            const userReactions = allThoughts.filter((thought)=>{
                for (let i=0; i<thought.reactions.length; i++){
                    if (thought.reactions[i].username===user.username){
                        return true;
                    };
                    return false
                }
            })
            .map((thought)=>thought._id);

            userReactions.forEach(async(thought)=>{
                await Thought.findOneAndUpdate(
                    { _id: thought },
                    { $pull: { reactions: { username: user.username } } },
                    { new: true }
                )
            })
            
            const users = await User.updateMany(
                { _id: { $in: user.friends } },
                { $pull: { friends: user._id } },
                { new: true }
            );
            
            res.json({ message: 'User and associated thoughts, reactions, and friend list entries deleted.' })

        } catch(err){
            console.log(err)
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
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            );

            if (!user){
                return res.status(404).json({ message: 'User not found.' });
            };
            await User.findOneAndUpdate(
                { _id: req.params.friendId },
                { $addToSet: { friends: user._id } },
                { new: true }
                );
            
            res.json(user);
        } catch(err){
            console.log(err);
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
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            );

            if (!user){
                return res.status(404).json({ message: 'User not found.' });
            };

            await User.findOneAndUpdate(
                { _id: req.params.friendId },
                { $pull: { friends: user._id } },
                { new: true }
            );

            res.json(user);
        } catch(err){
            res.status(500).json(err);
        };
    }
}