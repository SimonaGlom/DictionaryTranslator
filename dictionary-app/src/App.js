import React, { useState } from 'react';
import axios from 'axios'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [translations, setTranslations] = useState({});
  const [searchLanguage, setSearchLanguage] = useState('en')
  const [isSearch, setIsSearch] = useState(false)
  const [complete, setComplete] = useState([]);
 
  //odoslanie requestu po stlačení tlačidla hľadať
  const handleReq = async (item) => {
    axios.get('http://localhost:8000/search?query=' + item + '&lang=' + searchLanguage)
      .then(function (response) {
        setTranslations(response.data)
        setComplete([])
        setIsSearch(true)
      })
      .catch(function (error) {
        console.log(error);
      });  
  }

  //odoslanie requestu po písaní do inputu -> nápoveda
  const handleOnChange = async (e) => {
    setInput(e.target.value); 
    setIsSearch(false);
    setTranslations([])
    axios.get('http://localhost:8000/autocomplete?query=' + input + '&lang=' + searchLanguage)
      .then(function (response) {

        setComplete([...new Set(response.data)])
      })
      .catch(function (error) {
        console.log(error);
      }); 
  }

  // na zobrazenie dvoch zvyšných nevybratých jazykov
  const getUnchosenLanguages = () => {
    const langs = ['sk', 'en', 'de']

    return langs.filter((lan) => lan !== searchLanguage)
  }

  // na zobrazenie prekladov k jazyku, pri ktorm sa majú zobraziť
  const getTranslation = (lang) => {
    return [...new Set(translations[lang])] || []
  }

  // zmena jazyka , v ktorom zadávam slovo
  const handleCheckboxes = (val) => {
    setSearchLanguage(val)
    setTranslations([])
    setComplete([])
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
        <input name="search" placeholder="hľadaný výraz" value={input} onChange={(e) => { handleOnChange(e) }}/>
        </div>
        <button onClick={() => handleReq(input)}>HĽADAŤ</button>
        <div className="autocomplete">
          {complete.length ? 
            <>
              <h4>Mali ste na mysli?</h4>
              {complete.map((item) => {
                return <button className="button-autocomplete" onClick={() => { setInput(item); setComplete([]); handleReq(item) }}>{item}</button>
              })}
            </> : <></>}
        </div>
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
