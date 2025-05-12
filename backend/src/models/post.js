// models/Post.js
{
  userId: String,
  type: String, // "Fishing", "Camping", etc.
  content: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
}
