const express = require('express');
const { graphql } = require('graphql');
var bodyParser = require('body-parser');
var graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const rootValue = require('./resolver');

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/v1/graphql', (req, res) => graphql(schema, req.body.query, root).then(res.send.bind(res)));
app.use('/v2/graphql', graphqlHTTP({ schema, rootValue, graphiql: true, }));

app.listen(3000, () => console.log('Now browse to \nhttp://localhost:3000/v1/graphql\nhttp://localhost:3000/v2/graphql'));
