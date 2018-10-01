import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import { GET_RECIPE } from '../../queries';
import ErrorMessage from '../../components/Error';

const RecipePage = ({ match }) => {
    const { _id } = match.params;
    console.log(_id);
    return (
        <Query
            query={GET_RECIPE}
            variables={{
                _id
            }}
        >
        {({ data, loading, error }) => {
            if(error) {
                return <ErrorMessage error={error} />
            }

            if(loading) {
                return <div>Loading</div>
            }
            
            const { getRecipe: recipe } = data;

            return (
                <div className="App">
                    <h2>{recipe.name}</h2>
                    <p>Category: {recipe.category}</p>
                    <p>Instructions: {recipe.instructions}</p>
                    <p>Likes: {recipe.likes}</p>
                    <p>Created By: {recipe.username}</p>
                    <button>Like</button>
                </div>
            );
        }}
        </Query>
    );
};

export default withRouter(RecipePage);