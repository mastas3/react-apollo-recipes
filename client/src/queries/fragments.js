import { gql } from 'apollo-boost';

export const recipeFragments = {
    recipe: gql`
        fragment CompleteRecipe on Recipe {
            _id
            name
            category
            instructions
            imageUrl
            createdDate
            username
            likes            
        }
    `,

    like: gql`
        fragment LikeRecipe on Recipe {
            _id
            likes
        }
    `
}