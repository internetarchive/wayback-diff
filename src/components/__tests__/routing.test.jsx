// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DiffRoute, DiffGraphRoute } from '../../routing.jsx';

jest.mock('../diff-container.jsx', () => {
  return function MockDiffContainer (props) {
    return (
      <div data-testid="diff-container"
        data-url={props.url}
        data-timestamp-a={props.timestampA}
        data-timestamp-b={props.timestampB}
        data-no-timestamps={String(!!props.noTimestamps)}
      />
    );
  };
});

jest.mock('../sunburst/sunburst-container.jsx', () => {
  return function MockSunburstContainer (props) {
    return (
      <div data-testid="sunburst-container"
        data-url={props.url}
        data-timestamp={props.timestamp}
      />
    );
  };
});

function renderAtPath (path, element, routePath) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={element} />
      </Routes>
    </MemoryRouter>
  );
}

describe('DiffRoute', () => {
  it('routes two-timestamp path', () => {
    renderAtPath('/diff/20210101120000/20210201120000/http://example.com', <DiffRoute />, '/diff/*');
    const el = screen.getByTestId('diff-container');
    expect(el.dataset.url).toBe('http://example.com');
    expect(el.dataset.timestampA).toBe('20210101120000');
    expect(el.dataset.timestampB).toBe('20210201120000');
  });

  it('routes timestamp-A-only path (empty timestampB)', () => {
    renderAtPath('/diff/20210101120000//http://example.com', <DiffRoute />, '/diff/*');
    const el = screen.getByTestId('diff-container');
    expect(el.dataset.url).toBe('http://example.com');
    expect(el.dataset.timestampA).toBe('20210101120000');
    expect(el.dataset.timestampB).toBeUndefined();
  });

  it('routes timestamp-B-only path (empty timestampA)', () => {
    renderAtPath('/diff//20210201120000/http://example.com', <DiffRoute />, '/diff/*');
    const el = screen.getByTestId('diff-container');
    expect(el.dataset.url).toBe('http://example.com');
    expect(el.dataset.timestampB).toBe('20210201120000');
    expect(el.dataset.timestampA).toBeUndefined();
  });

  it('routes no-timestamp path', () => {
    renderAtPath('/diff///http://example.com', <DiffRoute />, '/diff/*');
    const el = screen.getByTestId('diff-container');
    expect(el.dataset.url).toBe('http://example.com');
    expect(el.dataset.noTimestamps).toBe('true');
  });

  it('routes fallback diff path', () => {
    renderAtPath('/diff/http://example.com', <DiffRoute />, '/diff/*');
    const el = screen.getByTestId('diff-container');
    expect(el.dataset.url).toBe('http://example.com');
  });

  it('preserves query string', () => {
    renderAtPath('/diff/20210101120000/20210201120000/http://example.com?foo=bar', <DiffRoute />, '/diff/*');
    const el = screen.getByTestId('diff-container');
    expect(el.dataset.url).toBe('http://example.com?foo=bar');
  });
});

describe('DiffGraphRoute', () => {
  it('routes timestamp + URL', () => {
    renderAtPath('/diffgraph/20210101120000/http://example.com', <DiffGraphRoute />, '/diffgraph/*');
    const el = screen.getByTestId('sunburst-container');
    expect(el.dataset.url).toBe('http://example.com');
    expect(el.dataset.timestamp).toBe('20210101120000');
  });

  it('returns null for unrecognized diffgraph path', () => {
    const { container } = renderAtPath('/diffgraph/bad-path', <DiffGraphRoute />, '/diffgraph/*');
    expect(container.firstChild).toBeNull();
  });
});
