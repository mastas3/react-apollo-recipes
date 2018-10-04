require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Recipe = require('./models/Recipe');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('DB connected'))
    .catch(err => console.log('error', err));

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}

app.use(cors(corsOptions))

//set up JWT auth middleware
app.use(async (req, res, next) => {
    const token = req.headers['authorization'];
    if(token !== "null") {
        try {
            const currentUser = await jwt.verify(token, process.env.SECRET);
            req.currentUser = currentUser;
        } catch(err) {
            console.log(err);
        }
    }
    next();
});

// app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.use('/graphql', bodyParser.json(), graphqlExpress((req, res) => ({
    schema,
    context: {
        Recipe,
        User,
        currentUser: req.currentUser,
    }
})))

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
