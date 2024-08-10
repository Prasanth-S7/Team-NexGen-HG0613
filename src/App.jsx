// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { Graph } from './pages/graph';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/graph' element={<Graph />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
