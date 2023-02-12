import './calculator.css';
import React, { useState } from 'react';

function adjustAmount(type, years, rate, amount) {
  //validate parameters

  let finalAmount = Number(amount);
  for (let i = 0; i < years; i++) {
    if (type === 'discount') {
      finalAmount = finalAmount / (1 + rate);
    }

    if (type === 'add') {
      finalAmount = finalAmount * (1 + rate);
    }
  }
  return Number(finalAmount).toFixed(2);
}

// 2D array
function yearlyData(rowCount, earningIncreateRate, cashDiscountRate, currentEarning) {

  const yearlyRows = [];
  let totalEarning = 0;
  let totalDiscountedEarning = 0;

  for (let i = 1; i < Number(rowCount) + 1; i++) {

    const singleYear = [];

    const newEarning = adjustAmount('add', i, Number(earningIncreateRate), Number(currentEarning));
    const newDiscountedEarning = adjustAmount('discount', i, Number(cashDiscountRate), Number(newEarning));

    singleYear.push(i);
    singleYear.push(Number(newEarning).toFixed(2));
    singleYear.push(Number(newDiscountedEarning).toFixed(2));

    totalEarning += Number(newEarning);
    totalDiscountedEarning += Number(newDiscountedEarning);

    yearlyRows.push(singleYear);
  }

  return { yearlyRows: yearlyRows, totalEarning: totalEarning.toFixed(2), totalDiscountedEarning: totalDiscountedEarning.toFixed(2) };
}


function buildYearlyDataTable(yearlyData) {

  const table = [];

  table.push(<thead>
    <tr>
      <th>Year</th>
      <th>Earnings</th>
      <th>Discounted earnings</th>
    </tr>
  </thead>)

  for (let i = 0; i < Number(yearlyData.yearlyRows.length); i++) {

    table.push(<tr>
      <td>{yearlyData.yearlyRows[i][0]} </td>
      <td>{yearlyData.yearlyRows[i][1]}</td>
      <td>{yearlyData.yearlyRows[i][2]}</td>
    </tr>)
  }

  table.push(<tr>
    <td>total </td>
    <td>{yearlyData.totalEarning}</td>
    <td>{yearlyData.totalDiscountedEarning}</td>
  </tr>)

  return table;
}


function Calculator(props) {

  const [parameters, setParameter] = useState({
    holdingPeriod: 0,
    currentCash: 0,
    currentEarning: 0,
    earningIncreateRate: 0,
    cashDiscountRate: 0,
    terminalValue: 0,
    safetyMarginRate: 0,
  });

  const handleChange = (e) => {
    console.log(e.target.name, parameters);
    let newParameters = {};
    newParameters[e.target.name] = e.target.value;
    setParameter(prevParams => {
      return { ...prevParams, ...newParameters }
    });
  }

  const data = yearlyData(
    Number(parameters.holdingPeriod),
    Number(parameters.earningIncreateRate)/100,
    Number(parameters.cashDiscountRate)/100,
    Number(parameters.currentEarning)
  );

  const table = buildYearlyDataTable(data);

  const discountedTerminalValue = adjustAmount('discount', parameters.holdingPeriod, Number(parameters.cashDiscountRate)/100, Number(parameters.terminalValue));

  const intrinsicValue = (Number(parameters.currentCash) +
    Number(data.totalDiscountedEarning) +
    Number(discountedTerminalValue)
  ) * (1 - Number(parameters.safetyMarginRate)/100);

  return (
    <section>
      <div>
        <h1>Intrinsic Value Calculator</h1>
      </div>
      <div className='content'>
        <div>
          <span>Holding Period: </span>
          <input type="number" name="holdingPeriod" onChange={handleChange} value={parameters.holdingPeriod} ></input>
          <span>years</span>
        </div>

        <div>
          <span>Current year earnings: </span>
          <input type="number" name="currentEarning" onChange={handleChange} value={parameters.currentEarning}></input>
        </div>

        <div>
          <span>Earning increase rate: </span>
          <input type="number" name="earningIncreateRate" onChange={handleChange} value={parameters.earningIncreateRate}></input>
          <span>%</span>
        </div>

        <div>
          <span>Cash discount rate: </span>
          <input type="number" name="cashDiscountRate" onChange={handleChange} value={parameters.cashDiscountRate}></input>
          <span>%</span>
        </div>

        <div>
          <table className='table'>
            {table}
          </table>
        </div>

        <div>
          <span>Current cash and equivalents: </span>
          <input type="number" name="currentCash" onChange={handleChange} value={parameters.currentCash}></input>
        </div>

        <div>
          <span>Terminal value: </span>
          <input type="number" name="terminalValue" onChange={handleChange} value={parameters.terminalValue}></input>
        </div>

        <div>
          <span>Discounted terminal value: {discountedTerminalValue}</span>
        </div>

        <div>
          <span>Safety Margin rate: </span>
          <input type="number" name="safetyMarginRate" onChange={handleChange} value={parameters.safetyMarginRate}></input>
          <span>%</span>
        </div>

        <div>
          <div>Current cash and equivalents</div>
          <div>+ All discounted earnings</div>
          <div>+ Discounted terminal value</div>
          <div> = Intrinsic Value: {intrinsicValue}</div>
          <p></p>
        </div>
      </div>

    </section>
  );
}

export default Calculator;