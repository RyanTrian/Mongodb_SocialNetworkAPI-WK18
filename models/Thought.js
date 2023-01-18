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
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  },
);

ThoughtSchema
  .virtual("reactionCount")
  .get( function () {
    if (this.reactions) {
      return this.reactions.length;
    } else {
      return 0;
    }
  })

const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;
