import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { SEARCH_RECIPES } from '../../queries';
import SearchItem from './SearchItem';

export default class Search extends React.Component {
    state = {
        searchResults: []
    }

    handleChange = ({ searchRecipes: searchResults }) => {
        this.setState(state => ({
            searchResults
        }));
    }

    render() {
        const { searchResults } = this.state;

        return (
            <ApolloConsumer>
                {client => (
                    <div className="App">
                        <input 
                            type="search" 
                            placeholder="Search for Recipes"
                            onChange={async event => {
                                event.persist();
                                const { data } = await client.query({
                                    query: SEARCH_RECIPES,
                                    variables: { searchTerm: event.target.value }
                                });
                                this.handleChange(data);
                            }}
                        />
                        <ul>
                            {searchResults.map(recipe => 
                                <SearchItem key={recipe._id} recipe={recipe}/>)}
                        </ul>
                    </div>
                )
                }
            </ApolloConsumer >
        )
    }
}