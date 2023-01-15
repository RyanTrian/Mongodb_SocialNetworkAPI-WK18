const { Schema, model } = require("mongoose");
const { formatDate } = require('../utils/formatDate');
const { ReactionSchema } = require("./Reaction");

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => formatDate(timestamp),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [ReactionSchema],
  },
  {
    toJson: {
      getters: true,
    },
  },
);

ThoughtSchema
  .virtual("reactionCount")
  .get( function () {
    return this.reactions.length;
  })

const Thought = model("Thought", ThoughtSchema);

module.exports = {
  Thought
};
