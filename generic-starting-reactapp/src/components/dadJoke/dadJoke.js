import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Button } from 'reactstrap';

import * as actions from '../../redux/actions';

import imageSrc from '../../assets/images/homer-simpson.jpg';

import './dad.scss';

const dadJoke = props => {

  const getJoke = e => {
    e.preventDefault();
    props.actions.getJoke();
  }

  const getJokeImage = () => {
    return props.joke && props.joke.icon_url;
  };

  const getJokeString = () => String(props.joke) !== '' && props.joke;

  return (
    <div className='jokeView'>
      <div>
        <Button className='wide' color="primary" onClick={getJoke}>Dad Joke!</Button>
      </div>
      <div>
        {
          <div>
            <img src={imageSrc} width='100px' height='auto' />
            {
              getJokeString()
            }
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
  const { dadJoke } = state;

  console.log('dadJoke >> ');
  console.log(JSON.stringify(dadJoke));

  return {
    joke : dadJoke.joke
  };
}

export { dadJoke };
export default connect(mapStateToProps, mapDispatchToProps)(dadJoke);