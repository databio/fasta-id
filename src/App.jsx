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

function MyTextbox() {
  return (
    <>
    <input type="file" id="myFile" name="filename" />
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
      <ul><MyListToShow myListItems={myListItems} /></ul>
      <button onClick={handleClick}>
        Load data
      </button>
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
