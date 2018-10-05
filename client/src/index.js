import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import withSession from './components/withSession';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import App from './components/App';
import Signup from './components/Auth/Signup';
import Signin from './components/Auth/Signin';
import Navbar from './components/Navbar';
import Search from './components/Recipe/Search';
import AddRecipe from './components/Recipe/AddRecipe';
import RecipePage from './components/Recipe/RecipePage';
import Profile from './components/Profile/Profile';


const client = new ApolloClient({
    uri: 'http://localhost:4444/graphql',
    // uri: 'https://react-recipes-apollo-client.herokuapp.com/graphql',
    fetchOptions: {
        credentials: 'include',
    },

    request: operation => {
        const token = localStorage.getItem('token');
        operation.setContext({
            headers: {
                authorization: token
            }
        })
    },

    onError: ({ networkError }) => {
        if(networkError) {
            console.log('Network Error', networkError);
        }
    }
});

const Root = ({ refetch, session }) => (
    <Router>
        <Fragment>
            <Navbar session={session} />
            <Switch>
                <Route path="/" exact component={App} />
                <Route path="/search" component={Search} />
                <Route path="/signin" render={() => <Signin refetch={refetch} /> } />
                <Route path="/signup" render={() => <Signup refetch={refetch} /> } />
                <Route path="/recipe/add" render={() => <AddRecipe session={session}/>} />
                <Route path="/profile" render={() => <Profile session={session} />} />
                <Route path="/recipes/:_id" component={RecipePage} />
                <Redirect to="/" />
            </Switch>
        </Fragment>
    </Router>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
    <ApolloProvider client={client}>
        <RootWithSession />
    </ApolloProvider>
    , document.getElementById('root'));
