const { Thought, User } = require('../models');

module.exports = {
    async getThoughts(req, res){
        try{
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch(err) {
            res.status(500).json
        };
    },

    async getSingleThought(req, res){
        try{
            const thought = await Thought.findOne({ _id:req.params.thoughtId });
            
            if (!thought){
                return res.status(404).json({ message: 'Thought not found.' });
            };
            
            res.json(thought);
        } catch(err) {
            res.status(500).json(err);
        }
    },

    async createThought(req, res){
        try{
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { username: req.body.username },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            );
            
            if (!user){
                return res.status(404).json({ message: 'Thought posted, but user not found.' });
            };
            
            res.json('Thought posted successfully.');
        } catch(err) {
            res.status(500).json(err);
        }
    },

    async updateThought(req, re){
        try{
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { 
                    runValidators: true,
                    new: true
                }
            );
            
            if (!thought){
                return res.status(404).json({ message: 'Thought not found.' });
            };
            
            res.json(thought);
        } catch(err) {
            res.status(500).json(err);
        };
    },

    async deleteThought(req, res){
        try{
            const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });
            
            if (!thought){
                return res.status(404).json({ message: 'Thought not found.' });
            };

            const user = await User.findOneAndUpdate(
                { username: req.body.username },
                { $pull: { thoughts: thought._id } },
                { new: true }
            );
            if (!user){
                return res.status(404).json({ message: 'Thought deleted, but user not found.' });
            };
            
            res.json('Thought deleted successfully.');
        } catch(err) {
            res.status(500).json(err);
        };
    },
    
    async addReaction(req, res){
        try{
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { 
                    runValidators: true,
                    new: true
                }
            );
            
            if (!thought){
                return res.status(404).json({ message: 'Thought not found.' });
            };
            
            res.json(thought);
        } catch(err) {
            res.status(500).json(err);
        };
    },

    async deleteReaction(req, res){
        try{
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { 
                    runValidators: true,
                    new: true
                }
            );
            
            if (!thought){
                return res.status(404).json({ message: 'Thought not found.' });
            };
            
            res.json(thought);
        } catch(err) {
            res.status(500).json(err);
        };
    }


};