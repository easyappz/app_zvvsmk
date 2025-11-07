import React from 'react';
import './App.css';
import Calculator from './components/Calculator';

function App() {
  return (
    <div className="App" data-easytag="id1-src/App.js">
      <main className="container" data-easytag="id2-src/App.js">
        <h1 data-easytag="id3-src/App.js">Калькулятор</h1>
        <Calculator />
      </main>
    </div>
  );
}

export default App;
