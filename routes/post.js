// Model for saving posts
const mongoose = require("mongoose");

// plm is not required here
// const plm = require("passport-local-mongoose");

// include everything, what a post should have
const postSchema = mongoose.Schema({
	user: { // bringing the id of user (from userSchema), who created the post
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
	title: String,
	description: String,
	password: String,
	image: String,
});

module.exports = mongoose.model("post", postSchema);
