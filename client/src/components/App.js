import React from 'react';
import './App.css';
import { Query } from 'react-apollo';
import { GET_ALL_RECIPES } from '../queries';
import RecipeItem from '../components/Recipe/RecipeItem';
import posed from 'react-pose';
import Spinner from './Spinner';

const RecipeList = posed.ul({
  shown: {
    x: '0%',
    staggerChildren: 100,
  },
  hidden: {
    x: '-100%',
  }
});

class App extends React.Component {
  state = {
    on: false,
  }

  componentDidMount() {
    setTimeout(this.slideIn, 1200);
  }

  slideIn = () => {
    this.setState({
      on: !this.state.on,
    });
  }

  render() {
    return (
      <div className="App">
        <h1 className="main-title">
          Find Recipes You <strong>Love</strong>
        </h1>
        <Query
          query={GET_ALL_RECIPES}
        >
          {({ data, loading, error }) => {
            if (loading) {
              return <Spinner />;
            }

            if (error) {
              return <div>Error: {error}</div>
            }

            const { on } = this.state;

            return (
              <RecipeList
                pose={on ? 'shown' : 'hidden'}
                className="cards"
              >
                {data.getAllRecipes.map(recipe =>
                  <RecipeItem key={recipe._id} recipe={recipe} />)
                }
              </RecipeList>)
          }}
        </Query>
      </div>
    );
  }
}

export default App;
