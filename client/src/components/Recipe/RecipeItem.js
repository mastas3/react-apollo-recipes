import React from 'react';
import { Link } from 'react-router-dom';

const RecipeItem = ({ recipe }) => (
    <li
        style={{ background: `url(${recipe.imageUrl}) center center / cover no-repeat` }}
        className="card"
    >
        <span className={recipe.category}>{recipe.category}</span>
        <div className="card-text">
            <Link to={`/recipes/${recipe._id}`}>
                <h4>{recipe.name}</h4>
            </Link>
        </div>
    </li>
)

export default RecipeItem;