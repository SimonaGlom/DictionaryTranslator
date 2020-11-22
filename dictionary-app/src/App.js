import React, { useState } from 'react';
import axios from 'axios'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [translations, setTranslations] = useState({});
  const [searchLanguage, setSearchLanguage] = useState('en')
  const [isSearch, setIsSearch] = useState(false)
 
  const handleReq = async () => {
    axios.get('http://localhost:8000/search?query=' + input + '&lang=' + searchLanguage)
      .then(function (response) {
        setTranslations(response.data)
        setIsSearch(true)
      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('http://localhost:8000/search?query=' + input + '&lang=' + searchLanguage)
      .then(function (response) {
        setTranslations(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const getUnchosenLanguages = () => {
    const langs = ['sk', 'en', 'de']

    return langs.filter((lan) => lan !== searchLanguage)
  }

  const getTranslation = (lang) => {
    console.log(translations[lang])
    return translations[lang] || []
  }

  const handleCheckboxes = (val) => {
    setSearchLanguage(val)
    setTranslations({})
    setInput('')
    setIsSearch(false)
  }
  return (
    <div className="app">
        <h1>EN-SK-DE Dictionary</h1>
        <div>
          <button className={(searchLanguage === 'sk' ? "choose-language chosen-language" : "choose-language")} onClick={() => handleCheckboxes('sk')}>SK</button>
          <button className={(searchLanguage === 'en' ? "choose-language chosen-language" : "choose-language")} onClick={() => handleCheckboxes('en')}>EN</button>
          <button className={(searchLanguage === 'de' ? "choose-language chosen-language" : "choose-language")} onClick={() => handleCheckboxes('de')}>DE</button>
        </div>
        <div>
        <input name="search" placeholder="hľadaný výraz" value={input} onChange={(e) => { setInput(e.target.value); setIsSearch(false) }}/>
        </div>
        <button onClick={() => handleReq()} onEnter={() => handleReq()}>HĽADAŤ</button>
        <div className="translations">
          <div>            
          {getUnchosenLanguages().map((item, index) => {
            return <div className="translation" key={index}>
              <h2>{item.toUpperCase()}</h2>
              {getTranslation(item).length ? 
              <>
                  {getTranslation(item)[0]}
                  {(getTranslation(item).length > 1) ? <h4 className="the-same-translation">Podobné výsledky:</h4> : <></>}
                  {getTranslation(item).map((translation, index) => {
                    return index ? <p>{translation}</p> : <></>
                  })}</> : isSearch && <>Slovo nebolo nájdené</>
              }
            </div>
          })}
          </div>
        </div>
    </div>
  );
}

export default App;
