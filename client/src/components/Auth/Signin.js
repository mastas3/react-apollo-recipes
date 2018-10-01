import React from 'react';
import { Mutation } from 'react-apollo';
import { SIGNIN_USER } from '../../queries';
import ErrorMessage from '../Error';
import { withRouter } from 'react-router-dom';

const initialState = {
    username: "",
    password: "",
}

class Signin extends React.Component {
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

    handleSubmit = (event, signinUser) => {
        event.preventDefault();
        signinUser()
            .then(async ({ data }) => {
                localStorage.setItem('token', data.signinUser.token);
                await this.props.refetch();
                this.clearState();
                this.props.history.push('/');
            });
    }

    validateForm = () => {
        const { username, password  } = this.state;
        const isInvalid = !username || !password;
        return isInvalid;
    }

    render() {
        const { username, password } = this.state;

        return (
            <div className="App">
                <h2>Signin</h2>
                <Mutation
                    mutation={SIGNIN_USER}
                    variables={{
                        username, password
                    }}
                >
                    {(signinUser, { data, loading, error }) => {
                        return (
                            <form className="form" onSubmit={event => this.handleSubmit(event, signinUser)}>
                                <input type="text" name="username" value={username} placeholder="Username" onChange={this.handleChange('username')} />
                                <input type="password" name="password" value={password} placeholder="Password" onChange={this.handleChange('password')} />
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

export default withRouter(Signin);
