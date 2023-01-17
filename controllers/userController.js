const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((Users) => res.json(Users))
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Get one user by id
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.id })
      .populate("friends")
      .populate("thoughts")
      .then((User) => {
        !User
          ? res.status(404).json({ message: "No User with that ID"})
          : res.json(User)
      })
      .catch((err) => res.status(500).json(err))
  },

  // Create a User
  createUser(req, res) {
    User.create(req.body)
      .then((User) => {
        console.log(User);
        res.status(200).json(User);
      })
      .catch((err) => res.status(500).json(err))
  },

  // Update a User
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    )
      .then((User) => {
        !User 
          ? res.status(404).json({ message: "No user with this ID"})
          : res.json(User);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Delete a user and BONUS: delete associated thoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((User) => {
        !User 
          ? res.status(404).json({ message: "No user with this ID"})
          : Thought.deleteMany({ _id: { $in: User.thoughts } });
      })
      .then(() => {
        res.json({ message: "User and associated thoughts are removed"})
      })
      .catch((err) => res.status(500).json(err))
  },

  // Add a friend to friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId }},
      { new: true }
    )
      .then((User) => {
        !User 
          ? res.status(404).json({ message: "No user with this ID"})
          : res.json(User);
      })
      .catch((err) => res.status(500).json(err))
  },

  // Remove friend from friend list
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((User) => {
        !User 
          ? res.status(404).json({ message: "No user with this ID"})
          : res.json(User);
      })
      .catch((err) => res.status(500).json(err))
  },
};
