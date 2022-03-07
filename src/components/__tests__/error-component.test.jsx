// eslint-disable-next-line no-unused-vars
import React from 'react';
import { shallow } from '../../enzyme';
import ErrorMessage from '../errors';

describe('Error component tests', function () {
  it('renders 404 error', function () {
    const errorCode = '404';
    const url = 'url';
    const wrapper = shallow(<ErrorMessage code={errorCode} url={url}/>);

    // Expect the wrapper object to be defined
    expect(wrapper.find('.alert')).toBeDefined();
    expect(wrapper.find('.alert-warning')).toHaveLength(1);
  });

  it('renders not found Error message', function () {
    const errorCode = '404';
    const url = 'url';
    const wrapper = shallow(<ErrorMessage code={errorCode} url={url}/>);

    expect(wrapper.find('.alert-warning').text()).toEqual(
      `The Wayback Machine has not archived ${url}.`
    );
  });

  it('renders generic Error message', function () {
    let rndCode = Math.floor(Math.random() * Math.floor(600));
    while (rndCode === 404) { rndCode = Math.floor(Math.random() * Math.floor(600)); }
    const errorCode = `${rndCode}`;
    const url = 'url';
    const wrapper = shallow(<ErrorMessage code={errorCode} url={url}/>);

    expect(wrapper.find('.alert-warning').text()).toEqual(
      'We are sorry but there is a problem comparing these captures. Please try two different ones.'
    );
  });
});
