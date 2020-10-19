import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

function App() {
  const [input, setInput] = useState('')
  const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200']
  }); 

  const handleReq = async () => {
    setInput()

    try {
      const response = await client.search({
        index: 'dictionary',
        type: '_doc',
        body: {
          query: {
            match: {
              value: "american"
            } 
          }
        }
      });
      console.log(response)
    } catch (error) {
      console.trace(error.message)
    }
  }

  return (
    <div className="App">
      <button onClick={() => handleReq()} >LALA</button>
    </div>
  );
}

export default App;
