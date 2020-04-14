import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Button } from 'reactstrap';

import * as actions from '../../../redux/actions';

import './userinfo.scss';

const userInfo = props => {

  const getUserInfo = e => {
    e.preventDefault();
    props.actions.getUserInfo();
  }

  const getFormattedInfo = () => {
    let name = props.firstName + ' ' + props.lastName;
    let email = props.email;
    return (
      <div>
        {
          `Hello ${name}, logged in with email: ${email}`
        }
        {
          props.info &&
            <div>
              <p>It looks like we have this information:</p>
              <pre>
                { JSON.stringify(props.info,null,1) }
              </pre>
            </div>
        }
        {
          !props.info &&
            <div>
              Boo. We couldn't get anything on this user!
            </div>
        }
      </div>
    )
  };

  return (
    <div className='userView'>
      <div>
        {
          !props.firstName &&
            <Button className='wide' color="primary" onClick={getUserInfo}>LOGIN!</Button>
        }
      </div>
      <div>
        {
          <div>
            {
              props.firstName &&
                getFormattedInfo()
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
      getUserInfo: actions.getUserInfo,
    }, dispatch)};
}

const mapStateToProps = state => {
  const { userInfo } = state;

  console.log('userInfo >> ');
  console.log(JSON.stringify(userInfo));

  return {
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    info: userInfo.info
  };
}

export { userInfo };
export default connect(mapStateToProps, mapDispatchToProps)(userInfo);