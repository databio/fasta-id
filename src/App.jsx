import {useEffect, useState} from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import forge from 'node-forge';

// const products = [
//   { name: 'Cabbage', id: 1 },
//   { name: 'Garlic', id: 2 },
//   { name: 'Apple', id: 3 },
// ];

const products = [];

function trunc512_digest(seq, offset=24) {
  var md = forge.md.sha512.create();
  md.update(seq)
  var bytes = md.digest().getBytes();
  bytes = bytes.slice(0, offset);
  bytes = forge.util.bytesToHex(bytes);
  return bytes
}

console.log(trunc512_digest("TCGA"))

// const listItems = products.map(product =>
//   <li key={product.id}>
//     {product.title}
//   </li>
// );

function renderListItems(listItems) {
  return listItems["myListItems"].map(listItem => {
    return (
      <li key={listItem.name}>
        {listItem.sequence}
      </li>
    );
  });
}

function MyListToShow(myListItems) {
  console.log(myListItems)
    return (
      <>
      <ul>{renderListItems(myListItems)}</ul>
      </>
    )
}

const getData = async () => {
  // const resp = await fetch('http://127.0.0.1:8100/collection/59319772d1bcf2e0dd4b8a296f2d9682?format=collated');  # local dev
  const resp = await fetch('https://seqcolapi.databio.org/collection/59319772d1bcf2e0dd4b8a296f2d9682?format=collated');
  const json = await resp.json();
  // return products
  return json
}

function App() {
  const [count, setCount] = useState(0)
  const [myListItems, setMyListItems] = useState(products)

  function handleClick() {
    getData().then((data) => {
      setMyListItems(data);
      console.log(data);
      console.log(myListItems)
    });
  }



  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <ul><MyListToShow myListItems={myListItems} /></ul>
      <button onClick={handleClick}>
        Load data
      </button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
