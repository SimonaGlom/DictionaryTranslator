import React, { useState } from 'react';
import axios from 'axios'

function App() {
  const [input, setInput] = useState('american')
  const [translations, setTranslations] = useState([]);
 
  const handleReq = async () => {
    setInput()

    axios.get('http://localhost:8000/search?value=' + input)
      .then(function (response) {
        console.log(translations)
        console.log(response.data.hits)
        setTranslations(response.data.hits)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="App">
      <ul>
      {translations && translations.map((translation, index) => {
        return <li key={index}>{translation._source.value}</li>
      })}
      </ul>
      <button onClick={() => handleReq()}>Search 'american'</button>
    </div>
  );
}

export default App;
