const Status = require('./Status')
const database = require('../database')

class Comment {
  constructor(comment = {}) {
    this.id = comment.id
    this.message = comment.message
    this.postID = comment.postID
    this.post = this.getPost.bind(this)
  }

  toObject() {
    return {
      id: this.id,
      postID: this.postID,
      message: this.message,
    }
  }

  getPost() {
    const Post = require('./Post').resolver
    return Post.get({ id: this.postID })
  }
}

const resolver = {
  get({ id } = {}) {
    const item = database.posts.reduce((pre, cur) => cur.comments.find(comment => comment.id === id) || pre, undefined)
    return new Comment(item)
  },
  getAll({ first, postID } = {}) {
    const items = database.posts.reduce((pre, cur) => [...pre, ...((!postID || postID === cur.id) ? cur.comments : [])], [])
    if (first || first === 0) {
      return items.map(item => new Comment(item)).slice(0, first)
    }
    return items.map(item => new Comment(item))
  },
  create({ input }) {
    const Post = require('./Post').resolver
    const id = `${input.postID}-c:${Date.now()}`
    const post = Post.get({ id: input.postID }).toObject()
    Post.update({ id: post.id, input: { comments: [...post.comments, { ...input, id }] } })
    return resolver.get({ id })
  },
  update({ id, input }) {
    const Post = require('./Post').resolver
    const comment = resolver.get({ id })
    const post = Post.get({ id: comment.postID }).toObject()
    Post.update({ id: post.id, input: { comments: post.comments.map(c => c.id === id ? { ...c, ...input } : c) } })
    return resolver.get({ id })
  },
  delete({ id }) {
    const Post = require('./Post').resolver
    const comment = resolver.get({ id })
    const post = Post.get({ id: comment.postID }).toObject()
    Post.update({ id: comment.postID, input: { comments: post.comments.filter(c => c.id !== id) } })
    return Status.createStatus('ok')
  }
}

exports.default = Comment
exports.resolver = resolver
