import React, { useEffect, useState } from "react"

interface Currency {
  code: string;
  currency: string;
  mid: number;
}

function App() {
  const [amountFrom, setAmountFrom] = useState<number>(0);
  const [currencyFrom, setCurrencyFrom] = useState<string>();
  const [currencyTo, setCurrencyTo] = useState<string>();
  const [currencyData, setCurrencyData] = useState<Currency[]>([]);

  async function fetchCurrencyData() {
    const url = "https://api.nbp.pl/api/exchangerates/tables/a/?format=json";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      const currencyData = json[0]?.rates
      setCurrencyData([...currencyData, {code:'PLN', currency: 'polski złoty', mid: 1}]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  useEffect(() => {
    fetchCurrencyData();
  }, []); 

  function calculateAmountTo() {
    const currencyFromMid = currencyData.find(currency => currency.code === currencyFrom)?.mid;
    const currencyToMid = currencyData.find(currency => currency.code === currencyTo)?.mid;
    if (!currencyFromMid || !currencyToMid) return 0;
    return (amountFrom * currencyFromMid) / currencyToMid;
  }


  return (
    <div className='content'>
      <div className="topbar">
        <div className="container">
          <ul>
            <a href=''><li>My currency</li></a>
            <a href=''> <li>Exhange </li></a>
            <a href=''> <li>Favorites</li></a>
          </ul>
        </div>
      </div>
      <div className="container">
        <h1>Exchange</h1>

        <div className="form">
          <div className="form-dropdown__left" >
            <label htmlFor="currencyFrom">Currency from:
              <select id="currencyFrom" value={currencyFrom} onChange={(e) => setCurrencyFrom(e.target.value)}>
                {currencyData.map((curr: Currency) =>  <option key={curr.code} value={curr.code}>{curr.currency}</option>)}
                
              </select>
            </label>

          </div>
          <div className="form-dropdown__right">
            <label htmlFor="currencyTo">Currency to:
              <select id="currencyTo" value={currencyTo} onChange={(e) => setCurrencyTo(e.target.value)}>
              {currencyData.map((curr: Currency) =>  <option key={curr.code} value={curr.code}>{curr.currency}</option>)}
              </select>
            </label>

          </div>

          <div className="form-amount">
            <label htmlFor='amount'>Amount
              <span><input type="number" placeholder="" id="amount" min="0" value={amountFrom} onChange={(e) => { setAmountFrom(parseFloat(e.target.value)) }} /> {currencyFrom}</span> 
            </label>
          </div>

          <div className="form-total">
            <label>Conversion
            <div className="form-total__amount"><span>{calculateAmountTo() ? calculateAmountTo() : 0} {currencyTo}</span> <span><a href=""><i />Favorite</a></span></div>
            </label>
           
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
