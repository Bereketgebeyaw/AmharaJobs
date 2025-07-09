import React from 'react';
import Home from './Home';

// The Jobs page simply reuses the Home page's job listing UI
const Jobs = () => <Home onlyActive minimal />;

export default Jobs; 