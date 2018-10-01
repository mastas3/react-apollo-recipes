import React from 'react';
import { Mutation } from 'react-apollo';
import { ADD_RECIPE, GET_ALL_RECIPES } from '../../queries';
import ErrorMessage from '../../components/Error';
import { withRouter } from 'react-router-dom';

const initialState = {
    name: '',
    instructions: '',
    category: 'Breakfast',
    description: '',
    username: '',
};

class AddRecipe extends React.Component {
    state = {...initialState}

    clearState = () => {
        this.setState(state => ({...initialState}));
    }

    componentDidMount() {
        this.setState({
            username: this.props.session.getCurrentUser.username
        });
    }

    handleChange = ({ target: { name, value }}) => {
        this.setState(() => ({
            [name]: value,
        }));
    }

    handleSubmit = (event, addRecipe) => {
        event.preventDefault();
        addRecipe().then(({ data }) => {
            this.clearState();
            this.props.history.push('/');
        });
    }

    validateForm = () => {
        const { name, instructions, category, description } = this.state;
        const isInvalid = !name || !category || !description || !instructions;
        return isInvalid;
    }

    updateCache = (cache, { data: {addRecipe} }) => {
        const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });
        cache.writeQuery({
            query: GET_ALL_RECIPES,
            data: {
                getAllRecipes: [
                    addRecipe,
                    ...getAllRecipes,
                ],
            }
        });
    }

    render() {
        const { name, instructions, category, description, username } = this.state;
        return <Mutation
            mutation={ADD_RECIPE}
            variables={{
                name, 
                instructions, 
                category, 
                description, 
                username
            }}
            update={this.updateCache}
        >
        {(addRecipe, { data, error, loading }) => {
            if(loading) {
                return <div>Loading</div>
            }

            if(error) {
                return <ErrorMessage error={error} />
            }

            return (
                <div className="App">
                    <h2 className="App">Add Recipe</h2>
                    <form className="form" onSubmit={(event) => this.handleSubmit(event, addRecipe)}>
                        <input type="text" value={name} name="name" onChange={this.handleChange} />
                        <select name="category" value={category} onChange={this.handleChange}>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Snack">Snack</option>
                        </select>
                        <input type="text" value={description} name="description" placeholder="Add description" onChange={this.handleChange} />
                        <textarea name="instructions" value={instructions} onChange={this.handleChange} placeholder="Add Instructions"></textarea>
                        <button 
                            disabled={loading || this.validateForm()} 
                            className="button-primary" 
                            type="submit">
                            Submit
                        </button>
                    </form>
                </div>
            );
        }}
        </Mutation>
    }
}

export default withRouter(AddRecipe);
