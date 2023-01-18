const { User, Thought } = require("../models");

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .sort({ createdAt: -1 })
      .then((Thought) => res.json(Thought))
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Get a thought by id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.id })
      .then((Thought) => {
        !Thought
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.json(Thought);
      })
      .catch((err) => res.status(500).json(err))
  },

  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((Thought) => {
        return User.findOneAndUpdate(
          { username: req.body.username },
          { $push: { thoughts: Thought._id } },
          { new: true }
        );
      })
      .then((User) => {
        !User
          ? res.status(404).json({ message: "Thought created but no user with this id!" })
          : res.json({ message: "Thought sucessfully created!" });
      })
      .catch((err) => res.status(500).json(err))
  },

  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((Thought) => {
        !Thought
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.json(Thought);
      })
      .catch((err) => res.status(500).json(err))
  },

  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.id })
      .then((Thought) => {
        if (!Thought) {
          return res.status(404).json({ message: "No thought with this id!" });
        }
        // Remove thought id from user's `thoughts` field
        return User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        !dbUserData 
          ? res.status(404).json({ message: "Thought deleted but no user with this id!" })
          : res.json({ message: "Thought sucessfully deleted!" });
      })
      .catch((err) => res.status(500).json(err));
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((Thought) => {
        !Thought
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.json(Thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Remove reaction from a thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.body.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((Thought) => {
        !Thought
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.json(Thought);
      })
      .catch((err) => res.status(500).json(err));
  },
};
