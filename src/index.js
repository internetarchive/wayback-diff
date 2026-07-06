/* eslint-disable no-unused-vars */
import React, { StrictMode } from 'react';
/* eslint-enable no-unused-vars */

import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DiffRoute, DiffGraphRoute } from './routing.jsx';

const root = createRoot(document.getElementById('wayback-diff'));

root.render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/hello" element={<div>Hello, this is static text!</div>} />
        <Route path="/diff/*" element={<DiffRoute />} />
        <Route path="/diffgraph/*" element={<DiffGraphRoute />} />
      </Routes>
    </Router>
  </StrictMode>
);
