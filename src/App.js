import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
import Form from './components/Composer/Composer';
import Map from './components/Map/Map';
import Preview from './components/Preview/Preview';


function App(){
  return (
    <>
    <div className="App">
      <Form />
    </div>
    </>
  );
}

export default App;
