import React from 'react';
import { Query } from 'react-apollo';
import { GET_USER_RECIPES } from '../../queries';
import { Link } from 'react-router-dom';

const UserRecipes = ({ username }) => (
    <Query
        query={GET_USER_RECIPES}
        variables={{
            username
        }}
    >
        {({ data, loading, error }) => {
            if (error) {
                return <div>Erorr</div>;
            }
            if (loading) {
                return <div>Loading...</div>;
            }

            console.log(data);

            return (
                <div>
                    <h3>Your Recipes</h3>
                    <ul>
                        {data.getUserRecipes.map(recipe => {
                            return (
                                <li key={recipe._id}>
                                    <Link to={`/recipes/${recipe._id}`}><p>{recipe.name}</p></Link>
                                    <p>Likes: {recipe.likes}</p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );;


        }}
    </Query>

)

export default UserRecipes;