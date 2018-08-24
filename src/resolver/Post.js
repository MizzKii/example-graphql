const Status = require('./Status')
const database = require('../database')

class Post {
  constructor(post = {}) {
    this.id = post.id
    this.title = post.title
    this.message = post.message
    this._comments = post.comments || []
    this.comments = this.getComments.bind(this)
  }

  toObject() {
    return {
      id: this.id,
      title: this.title,
      message: this.message,
      comments: this._comments,
    }
  }

  getComments({ first } = {}) {
    const Comment = require('./Comment').resolver
    return Comment.getAll({ first, postID: this.id })
  }
}

const resolver = {
  get({ id }) {
    const post = database.posts.find(item => item.id === id)
    if (!post) {
      throw new Error(`Not found post id's "${id}"`)
    }
    return new Post(post)
  },
  getAll({ first } = {}) {
    if (first || first === 0) {
      return database.posts.map(item => new Post(item)).slice(0, first)
    }
    return database.posts.map(item => new Post(item))
  },
  create({ input }) {
    const id = `p:${Date.now()}`
    database.posts.push({ ...input, id, comments: [] })
    return resolver.get({ id })
  },
  update({ id, input }) {
    database.posts = database.posts.map(item => item.id === id ? { ...item, ...input } : item)
    return resolver.get({ id })
  },
  delete({ id }) {
    database.posts = database.posts.filter(item => item.id !== id)
    return Status.createStatus('ok')
  }
}

exports.default = Post
exports.resolver = resolver