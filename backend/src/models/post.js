// models/Post.js
module.exports = {
  userId: String,
  type: String, // "Fishing", "Camping", etc.
  content: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
};
