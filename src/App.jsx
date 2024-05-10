import {useEffect, useState} from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import forge from 'node-forge';
import canonicalize from 'canonicalize';
import fastaParser from 'fasta-js';
import React from 'react';
// const products = [
//   { name: 'Cabbage', id: 1 },
//   { name: 'Garlic', id: 2 },
//   { name: 'Apple', id: 3 },
// ];

// HEY! don't use var! use let!

var options = {
  'definition': 'id',
  'delimiter': '>'
};

var fp = new fastaParser(options);
const products = [];

function trunc512_digest(seq, offset=24) {
  var md = forge.md.sha512.create();
  md.update(seq)
  var bytes = md.digest().getBytes();
  bytes = bytes.slice(0, offset);
  bytes = forge.util.bytesToHex(bytes);
  return bytes
}

function seqcol_digest(csc) {
  var csc2 = {}
  for (var key in csc) {
    csc2[key] = trunc512_digest(canonicalize(csc[key]))
  }
  return trunc512_digest(canonicalize(csc2))
}

console.log(trunc512_digest("TCGA"))
var demo = {
  "lengths": [
    8,
    4,
    4
  ],
  "names": [
    "chrX",
    "chr1",
    "chr2"
  ],
  "sequences": [
    "5f63cfaa3ef61f88c9635fb9d18ec945",
    "31fc6ca291a32fb9df82b85e5f077e31",
    "92c6a56c9e9459d8a42b96f7884710bc"
  ],
  "names_lengths": [
    "2914fff9858465fd1facf69b776c3380",
    "71083cf3401cf5a0fa604dfec95c611c",
    "843410ce56006323efe493f96e90b05d"
  ]
}
var sequenceData = `>gi|123456|Sequence A
ATCGATCGATCG
>gi|567890|Sequence B
CATCATCATGGG`

console.log(seqcol_digest(demo))
console.log(fp.parse(sequenceData));

// const listItems = products.map(product =>
//   <li key={product.id}>
//     {product.title}
//   </li>
// );

function renderListItems(params) {
  console.log("Rendering list items...", params["myListItems"])
  if (params["myListItems"]["sequences"] == undefined) {
    return <li>no sequences</li>
  }
  console.log("Found sequences...")
  return params["myListItems"]["sequences"].map(listItem => {
    return (
      <tr>
        <td key={listItem.name}>{listItem.name}</td>
        <td>{listItem.length}</td>
        <td>{listItem.sequence}</td>
      </tr>
    );
  });
}

function MyListToShow(myListItems) {
  console.log(myListItems)
    return (
      <>
      <table>
        <tr>
          <th>Sequence name</th>
          <th>Length</th>
          <th>Sequence digest</th>
        </tr>
      {renderListItems(myListItems)}
      </table>
      </>
    )
}

class SequenceCollection {
  constructor(digest) {
    console.log(`Creating sequence collection... {digest}`)
    this.digest = digest;
  }


  getCollection() {
    fetch (server.api + "collection/" + this.digest)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return data;
      })  
  }
}

const sequenceCollection = new SequenceCollection("asdf");



function MyTextbox() {
  return (
    <>
    <input type="file" id="myFile" name="filename" />
    </>
  )
}

let server = {
  api: "https://seqcolapi.databio.org/",
}

const getData = async () => {
  // const resp = await fetch('http://127.0.0.1:8100/collection/59319772d1bcf2e0dd4b8a296f2d9682?collated=false');  # local dev
  const resp = await fetch('https://seqcolapi.databio.org/collection/MFxJDHkVdTBlPvUFRbYWDZYxmycvHSRp?collated=false');
  const json = await resp.json();
  // return products
  return json
}



class FileInput extends React.Component {
  constructor(props) {
    super(props)
    this.uploadFile = this.uploadFile.bind(this);
  }
  
  uploadFile(event) {
      let file = event.target.files[0];
      console.log(file);
      
      if (file) {
        let data = new FormData();
        data.append('file', file);
        // axios.post('/files', data)...

        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function() {
          console.log(reader.result);
        };
      }
  }
  
  render() {
    return <span>
      <input type="file"
      name="myFile"
      onChange={this.uploadFile} />
    </span>
  }
}


function parseFasta() { 
  var fastaFile = document.getElementById("myTextarea").value;
  // read in file content



  var parsed = fp.parse(fasta);
  console.log(parsed);
  var result = document.getElementById("result");
  result.innerHTML = seqcol_digest(parsed);
}

let userName = "Nathan Sheffield"

let count = 0;

const addOne = () => {
  console.log("Adding one...", count)
  count++;
}

const minusOne = () => {
  console.log("Minus one...")
  count--;  
}

const resetCount = () => {
  console.log("resetting")
  count = 0;
}

let visibility = true;



function VisibilityToggle() {
  const [visibility, setVisibility] = useState(true)

  const toggleVisibility = () => {
    console.log("toggle")
    setVisibility(!visibility)
  }
  return (<div> asdf
  <button onClick={toggleVisibility}>{visibility ? "Show details" : "Hide details"}</button>
  { visibility && <p id="memo">details here</p> }
  </div>)
  };



const templateTwo = (
  <div>
    <h2>Count: {count}</h2>
    <button onClick={addOne}>+1</button>
    <button onClick={resetCount}>Reset one</button>
    <button onClick={minusOne}>-1</button>
  </div>
);

function App() {
  const [count, setCount] = useState(0)
  const [myListItems, setMyListItems] = useState([])

  function handleClick() {
    getData().then((data) => {
      setMyListItems(data);
      console.log(data);
      console.log(myListItems)
    });
  }

  return (
    <>
    <VisibilityToggle/>
      <button onClick={handleClick}>
        Load data
      </button>
      <ul><MyListToShow myListItems={myListItems} /></ul>
    <br />
      <MyTextbox />
      <br />
      <button onClick={parseFasta}>
        Compute seqcol identifier
      </button>
      <FileInput />
      <div className="card" id="result"></div>
    </>
  )
}

export default App
