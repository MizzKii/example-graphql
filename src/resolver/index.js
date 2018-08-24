const PostResolver = require('./Post').resolver
const CommentResolver = require('./Comment').resolver

// The root provides a resolver function for each API endpoint
const root = {
  // Query
  post: PostResolver.get,
  posts: PostResolver.getAll,
  comment: CommentResolver.get,
  comments: CommentResolver.getAll,

  // Mutation
  postCreate: PostResolver.create,
  postUpdate: PostResolver.update,
  postDelete: PostResolver.delete,
  commentCreate: CommentResolver.create,
  commentUpdate: CommentResolver.update,
  commentDelete: CommentResolver.delete,
};

module.exports = root
