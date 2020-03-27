import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Button } from 'reactstrap';

import * as actions from '../../redux/actions';

import './chuck.scss';

const chuckJoke = props => {

  const getJoke = e => {
    e.preventDefault();
    props.actions.getJoke();
  }

  const getJokeImage = () => {
    return props.joke && props.joke.icon_url;
  };

  const getJokeString = () => props.joke && props.joke.value;

  return (
    <div className='norrisJokeView'>
      <div>
        <Button className='wide' color="primary" onClick={getJoke}>Get Chuck Norris Joke</Button>
      </div>
      <div>
        {
          <div>
            <img src={ getJokeImage() } />
            <span>{ getJokeString() }</span>
          </div>
        }
      </div>
    </div>
  );

};


const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({
      getJoke: actions.getChuckNorrisRandomJoke,
    }, dispatch)};
}

const mapStateToProps = state => {
  const { norrisJoke } = state;

  console.log('chuckJoke >> ');
  console.log(JSON.stringify(norrisJoke));

  return {
    joke : norrisJoke.joke
  };
}

export { chuckJoke };
export default connect(mapStateToProps, mapDispatchToProps)(chuckJoke);