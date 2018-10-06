import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { GET_USER_RECIPES, 
         DELETE_USER_RECIPE, 
         GET_ALL_RECIPES,
         GET_CURRENT_USER,
        } from '../../queries';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';

const handleDelete = deleteUserRecipe => {
    const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');

    if(confirmDelete) {
        deleteUserRecipe().then(({ data }) => {
            // console.log(data);
        });
    }
}

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
                return <Spinner />;
            }

            return (
                <div>
                    <h3>Your Recipes</h3>
                    {!data.getUserRecipes.length && <p>
                        <strong>You haven't added any recipes yet.</strong>
                    </p>}
                    <ul>
                        {data.getUserRecipes.map(recipe => {
                            return (
                                <li key={recipe._id}>
                                    <Link to={`/recipes/${recipe._id}`}><p>{recipe.name}</p></Link>
                                    <p style={{ marginBottom: '0' }}>
                                        Likes: {recipe.likes}
                                    </p>
                                    <Mutation
                                        mutation={DELETE_USER_RECIPE}
                                        variables={{ _id: recipe._id }}
                                        refetchQueries={() => [
                                            { query: GET_ALL_RECIPES }, 
                                            { query: GET_CURRENT_USER }
                                        ]}
                                        update={(cache, { data: { deleteUserRecipe } }) => {
                                            const { getUserRecipes }  = cache.readQuery({
                                                query: GET_USER_RECIPES,
                                                variables: { username }
                                            });

                                            cache.writeQuery({
                                                query: GET_USER_RECIPES,
                                                variables: { username },
                                                data: {
                                                    getUserRecipes: getUserRecipes.filter(recipe => recipe._id != deleteUserRecipe._id),
                                                }
                                            })
                                        }}
                                    >
                                        {(deleteUserRecipe, attrs) => {
                                            return (
                                                <p 
                                                    className="delete-button"
                                                    onClick={() => handleDelete(deleteUserRecipe)}
                                                >
                                                    {attrs.loading? 'deleting...': 'X'}
                                                </p>
                                            )
                                        }}
                                    </Mutation>
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