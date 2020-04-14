import React from 'react';

// Testing functionality
import { cleanup, fireEvent, render } from '@testing-library/react';

// component that the suite is testing
import { UserInfo } from './userInfo';

// cleanup
afterEach(cleanup);

// main describe block
describe('UserInfo component', () => {

  // 3 describe blocks each verify component ui state with various conditions present in props

  // condition of component with no user info
  describe('no user info', () => {

    it('should have a button if the firstName does not have a truthy value in the component props', () => {
      const{ getByText } = render(<UserInfo firstName={null} lastName={null} email={null} info={null}></UserInfo>);
      expect( getByText(/LOGIN!/)).toBeTruthy();
    });

    it('should not have the greeting message if it does not have the firstName property', () => {
      const{ getByText } = render(<UserInfo></UserInfo>);
      expect( ()=>{ getByText(/logged in with email/) } ).toThrow();
    });

    it('clicking the login buttom should call the props action "getUserInfo"', () => {
      // jest is globally available in react unit tests
      let spy = jest.fn();
      let actions = { 
        getUserInfo: spy
      };
      const{ getByText } = render(<UserInfo actions={actions}></UserInfo>);
      fireEvent.click(getByText(/LOGIN!/));
      expect(spy).toHaveBeenCalled();
    });

  });

  // condition of component with some user info
  describe('user name and email but no info', () => {
    
    it('should not have a login button', () => {
      const{ getByText } = render(<UserInfo firstName={'bob'} lastName={'bobman'} email={'bob@email.com'} info={null}></UserInfo>);
      expect( ()=>{ getByText(/LOGIN!/) } ).toThrow();
    });

    it('should display a greeting with name and email', () => {
      let firstName = 'bob', lastName = 'bobman', email = 'bob@email.com';
      let name = firstName + ' ' + lastName;
      let searchString = `Hello ${name}, logged in with email: ${email}`;
      const{ getByText } = render(<UserInfo firstName={firstName} lastName={lastName} email={email} info={null}></UserInfo>);
      expect(getByText(searchString)).toBeTruthy();
    });

    it('should display a message stating that no other info could be obtained', () => {
      let firstName = 'bob', lastName = 'bobman', email = 'bob@email.com';
      let name = firstName + ' ' + lastName;
      let searchString = "Boo. We couldn't get anything on this user!";
      const{ getByText } = render(<UserInfo firstName={firstName} lastName={lastName} email={email} info={null}></UserInfo>);
      expect(getByText(searchString)).toBeTruthy();
    });

  });

  // condition of component with all the user info
  describe('all the user info', () => {

    let firstName = 'bob', lastName = 'bobman', email = 'bob@email.com', 
        info={ firstName, lastName, nickName:'Bob-Man', phoneNumber:'5413301184'};
    let name = firstName + ' ' + lastName;

    const renderComponent = () => {
      let { getByText } = render(<UserInfo firstName={firstName} lastName={lastName} email={email} info={info}></UserInfo>);
      return getByText;
    };
    
    it('should not have a login button', () => {
      let getByText = renderComponent();
      expect( ()=>{ getByText(/LOGIN!/) } ).toThrow();
    });

    it('should display a greeting with name and email', () => {
      let getByText = renderComponent();

      let searchString = `Hello ${name}, logged in with email: ${email}`;
      expect(getByText(searchString)).toBeTruthy();
    });

    it('should not display a message stating that no other info could be obtained', () => {
      let getByText = renderComponent();
      let searchString = "Boo. We couldn't get anything on this user!";
      expect(() => { getByText(searchString) }).toThrow();
    });

    it('should display a message indicating that info was obtained', () => {
      let getByText = renderComponent();
      let searchString = 'It looks like we have this information:';
      expect(getByText(searchString)).toBeTruthy();
    });

  });
  
});