import React from 'react';
import { Link } from 'react-router-dom';
import posed from 'react-pose';

const RecipeItem = posed.li({
    shown: {
        opacity: 1
    },

    hidden: {
        opacity: 0
    }
});

export default ({ recipe }) => (
    <RecipeItem
        style={{ background: `url(${recipe.imageUrl}) center center / cover no-repeat` }}
        className="card"
    >
        <span className={recipe.category}>{recipe.category}</span>
        <div className="card-text">
            <Link to={`/recipes/${recipe._id}`}>
                <h4>{recipe.name}</h4>
            </Link>
        </div>
    </RecipeItem>
);
