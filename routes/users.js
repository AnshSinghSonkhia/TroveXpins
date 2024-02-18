const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/trovexpins");

const userSchema = mongoose.Schema({
	username: String,
	name: String,
	email: String,
	password: String,
	profileImage: String,
	contact: Number,
	boards: {
		type: Array,
		default: []
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "post"
		}
	]
});

// boards --> number of collections / folders, that user created.

// // Pre-save hook to separate username and name fields
// userSchema.pre('save', function(next) {
//     // Check if username field is modified and has value
//     if (this.isModified('username') && this.username) {
//         // Remove spaces from the username and store it
//         this.username = this.username.replace(/\s/g, '');
//     }

//     // Check if name field is modified and has value
//     if (this.isModified('name') && this.name) {
//         // Store the name as it is
//         // Optionally, you can trim the name to remove leading and trailing spaces
//         this.name = this.name.trim();
//     }

//     next();
// });

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
