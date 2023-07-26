const express = require('express');
const path = require('path');
const db = require('./config/connection');
// import auth middleware
const { authMiddleware } = require('./utils/auth');
// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
// import apollo server
const { ApolloServer } = require('apollo-server-express');

const app = express();
const PORT = process.env.PORT || 3001;

// create a new apollo server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// integrate apollo server with express app as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

db.once('open', () => {
  app.listen(PORT, () => 
  console.log(`🌍 Now listening on localhost:${PORT}`));
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
});