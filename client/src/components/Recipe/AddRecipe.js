import React from 'react';
import { Mutation } from 'react-apollo';
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../queries';
import CKEditor from 'react-ckeditor-component';
import ErrorMessage from '../../components/Error';
import { withRouter } from 'react-router-dom';
import withAuth from '../withAuth';

const initialState = {
    name: '',
    instructions: '',
    category: 'Breakfast',
    imageUrl: '',
    description: '',
    username: '',
};

class AddRecipe extends React.Component {
    state = { ...initialState }

    clearState = () => {
        this.setState(state => ({ ...initialState }));
    }

    componentDidMount() {
        this.setState({
            username: this.props.session.getCurrentUser.username
        });
    }

    handleChange = ({ target: { name, value } }) => {
        this.setState(() => ({
            [name]: value,
        }));
    }

    handleEditorChange = event => {
        const newContent = event.editor.getData();
        this.setState({
            instructions: newContent
        });
    }

    handleSubmit = (event, addRecipe) => {
        event.preventDefault();
        addRecipe().then(({ data }) => {
            this.clearState();
            this.props.history.push('/');
        });
    }

    validateForm = () => {
        const { name, instructions, category, description, imageUrl } = this.state;
        const isInvalid = !name || !imageUrl || !category || !description || !instructions;
        return isInvalid;
    }

    updateCache = (cache, { data: { addRecipe } }) => {
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
        const { name, instructions, category, description, username, imageUrl } = this.state;
        return <Mutation
            mutation={ADD_RECIPE}
            variables={{
                name,
                instructions,
                category,
                description,
                imageUrl,
                username
            }}
            update={this.updateCache}
            refetchQueries={() => [
                { query: GET_USER_RECIPES, variables: { username }},
            ]}
        >
            {(addRecipe, { data, error, loading }) => {
                if (loading) {
                    return <div>Loading</div>
                }

                if (error) {
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
                            <input type="text" value={imageUrl} name="imageUrl" placeholder="Image Url" onChange={this.handleChange} />
                            <label htmlFor="instructions">Add Instructions</label>
                            <CKEditor 
                                name="instructions"
                                content={instructions}
                                events={{ change: this.handleEditorChange }}
                            />
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

export default
    withAuth(session => session && session.getCurrentUser)(withRouter(AddRecipe));
