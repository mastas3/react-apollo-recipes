import React from 'react';
import { Mutation } from 'react-apollo';
import { SIGNUP_USER } from '../../queries';
import ErrorMessage from '../Error';
import { withRouter } from 'react-router-dom';

const initialState = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
}

class Signup extends React.Component {
    state = {...initialState};

    clearState = () => {
        this.setState(() => ({...initialState}));
    }

    handleChange = (name) => (event) => {
        const { target: { value } } = event;
        this.setState(state => ({
            [name]: value,
        }));
    }

    handleSubmit = (event, signupUser) => {
        event.preventDefault();
        signupUser()
            .then(async ({ data }) => {
                console.log(data);
                localStorage.setItem('token', data.signupUser.token);
                await this.props.refetch();
                this.clearState();
                this.props.history.push('/');
            });
    }

    validateForm = () => {
        const { username, email, password, passwordConfirmation } = this.state;
        const isInvalid = !username || !email || !password || password !== passwordConfirmation;
        return isInvalid;
    }

    render() {
        const { username, email, password, passwordConfirmation } = this.state;

        return (
            <div className="App">
                <h2>Signup</h2>
                <Mutation
                    mutation={SIGNUP_USER}
                    variables={{
                        username, email, password
                    }}
                >
                    {(signupUser, { data, loading, error }) => {
                        return (
                            <form className="form" onSubmit={event => this.handleSubmit(event, signupUser)}>
                                <input type="text" name="username" value={username} placeholder="Username" onChange={this.handleChange('username')} />
                                <input type="email" name="email" value={email} placeholder="Email" onChange={this.handleChange('email')} />
                                <input type="password" name="password" value={password} placeholder="Password" onChange={this.handleChange('password')} />
                                <input type="password" name="passwordConfirmation" value={passwordConfirmation} placeholder="Confirm Password" onChange={this.handleChange('passwordConfirmation')} />
                                <button 
                                    disabled={loading || this.validateForm()}
                                    type="submit" 
                                    className="button-primary"
                                >
                                    Submit
                                </button>
                                {error && <ErrorMessage error={error}/>}
                            </form>
                        )
                    }}
                </Mutation>
            </div>
        )
    }
}

export default withRouter(Signup);
