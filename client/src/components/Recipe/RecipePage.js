import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import { GET_RECIPE } from '../../queries';
import ErrorMessage from '../../components/Error';
import LikeRecipe from './LikeRecipe';
import Spinner from '../Spinner';

const RecipePage = ({ match }) => {
    const { _id } = match.params;
    return (
        <Query
            query={GET_RECIPE}
            variables={{
                _id
            }}
        >
            {({ data, loading, error }) => {
                if (error) {
                    return <ErrorMessage error={error} />
                }

                if (loading) {
                    return <Spinner />;
                }

                const { getRecipe: recipe } = data;

                return (
                    <div className="App">
                        <div className="recipe-image"
                            style={{ background: `url(${recipe.imageUrl}) center center / cover no-repeat` }}
                        >
                        </div>
                        <div className="recipe">
                            <div className="recipe-header">
                                <h2 className="recipe-name">{recipe.name}</h2>
                                <h5><strong>{recipe.category}</strong></h5>
                                <p>
                                    Created by <strong>{recipe.username}</strong>
                                </p>
                                <p>
                                    {recipe.likes} <span role="img" aria-label="heart">❤</span>
                                </p>
                            </div>
                            <blockquote className="recipe-description">
                                {recipe.description}
                            </blockquote>
                            <h3 className="rescipe-instructions__title">Instructions</h3>
                            <div className="recipe-instructions" dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
                            <LikeRecipe _id={_id} />
                        </div>
                    </div>
                );
            }}
        </Query>
    );
};

export default withRouter(RecipePage);