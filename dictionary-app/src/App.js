import React, { useState } from 'react';
import axios from 'axios'

function App() {
  const [input, setInput] = useState('american')
 
  const handleReq = async () => {
    setInput()

    axios.get('http://localhost:8000/search', {
      value: input
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="App">
      <button onClick={() => handleReq()} >LALA</button>
    </div>
  );
}

export default App;
