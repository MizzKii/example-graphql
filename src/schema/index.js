const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  input PostInput {
    title: String!
    message: String
  }
  input CommentInput {
    postID: ID!
    message: String!
  }
  input CommentUpdateInput {
    message: String!
  }

  type Status {
    status: String
  }
  type Post {
    id: ID
    title: String
    message: String
    comments(first: Int): [Comment]
  }
  type Comment {
    id: ID
    message: String
    post: Post
  }

  type Query {
    post(id: ID!): Post
    posts(first: Int): [Post]
    comment(id: ID!): Comment
    comments(first: Int, postID: ID): [Comment]
  }

  type Mutation {
    postCreate(input: PostInput!): Post
    postUpdate(id: ID, input: PostInput!): Post
    postDelete(id: ID!): Status
    commentCreate(input: CommentInput!): Comment
    commentUpdate(id: ID, input: CommentUpdateInput!): Comment
    commentDelete(id: ID!): Status
  }  
`);

module.exports = schema
