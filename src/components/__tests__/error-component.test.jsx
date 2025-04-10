// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../errors';

describe('Error component tests', function () {
  it('renders 404 error', function () {
    const url = 'http://example.com';
    render(<ErrorMessage code='404' url={url}/>);
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toBe(`The Wayback Machine has not archived ${url}.`);
  });

  it('renders generic Error message', function () {
    render(<ErrorMessage code='503' url='http://foo.com'/>);
    expect(screen.getByRole('alert').textContent).toBe(
      'We are sorry but there is a problem comparing these captures. Please try two different ones.'
    );
  });
});
