// eslint-disable-next-line no-unused-vars
import React from 'react';
import { shallow } from '../../enzyme';
import ErrorMessage from '../errors';

describe('Error component tests', () => {

  it('renders 404 error', () => {
    const errorCode = '404';
    const url = 'url';
    const wrapper = shallow(<ErrorMessage code={errorCode} url={url}/>);

    // Expect the wrapper object to be defined
    expect(wrapper.find('.alert')).toBeDefined();
    expect(wrapper.find('.alert-warning')).toHaveLength(1);
  });

  it('renders not found Error message', () => {
    const errorCode = '404';
    const url = 'url';
    const wrapper = shallow(<ErrorMessage code={errorCode} url={url}/>);

    expect(wrapper.find('.alert-warning').text()).toEqual(`The Wayback Machine doesn't have ${url} archived.`);
  });

  it('renders generic Error message', () => {
    let rndCode = Math.floor(Math.random() * Math.floor(600));
    while (rndCode === 404) {rndCode = Math.floor(Math.random() * Math.floor(600));}
    const errorCode = `${rndCode}`;
    const url = 'url';
    const wrapper = shallow(<ErrorMessage code={errorCode} url={url}/>);

    expect(wrapper.find('.alert-warning').text()).toEqual('Communication with the Wayback Machine is not ' +
      'possible at the moment. Please try again later.');
  });
});
