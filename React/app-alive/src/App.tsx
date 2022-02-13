import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axiosConfig from './utils/axiosConfig';

function App() {
  const [infomacoes, setInformacoes] = React.useState('');
  const info = async (): Promise<void> => {
    try {
      const response = await axiosConfig.get(`${"https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=demo"}/lista-revendas`);
      console.log(response)
      setInformacoes(response.data)
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(()=>{
    info()
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {infomacoes}
      </header>
    </div>
  );
}

export default App;
