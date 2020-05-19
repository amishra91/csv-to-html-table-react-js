import React, { Component, Fragment } from 'react';
import ReactFileReader from 'react-file-reader';
import Papa from 'papaparse';

import './App.css';

class App extends Component {

  state = {
    csvData: null,
    minValIndex: null,
    maxValIndex: null
  }

  componentDidMount() {
    this.tableContainer.addEventListener('scroll', this.loadMore);
  }

  handleFiles = files => {
    if(files[0].name.split('.').pop() !== 'csv') {
      alert('Please upload a valid CSV file');
      return;
    }
    let reader = new FileReader();
    const parseConfig = {
      delimiter: "",
      newline: "",
      quoteChar: '"',
      escapeChar: '"',
      header: true,
      transformHeader: undefined,
      dynamicTyping: false,
      preview: 0,
      encoding: "",
      worker: false,
      comments: false,
      step: undefined,
      complete: undefined,
      error: undefined,
      download: false,
      skipEmptyLines: true,
      chunk: undefined,
      fastMode: undefined,
      beforeFirstChunk: undefined,
      withCredentials: undefined,
      transform: undefined,
      delimitersToGuess: [",", "\t", "|", ";", Papa.RECORD_SEP, Papa.UNIT_SEP]
    };
    reader.onload = () => {
      const fileIn = reader.result;
      const fileParsed = fileIn.replace(/(00\/00\/0000)/g, "");
      const csvData = Papa.parse(fileParsed, parseConfig);
      const csvFileHeaders = Object.keys(csvData.data[0]);

      if((csvFileHeaders[0] == "" && csvFileHeaders.length == 1) || (csvFileHeaders.length == 0)) {
        alert('No headers found. Please upload a csv file with headers');
        return;
      }
      this.setState({
        csvData: csvData.data,
        minValIndex: 1,
        maxValIndex: 50
      });
    }
    reader.readAsText(files[0]);
  }

  loadMore = () => {
    if(this.state.maxValIndex >= this.state.csvData.length) {
      return;
    }
    if(this.tableContainer.scrollTop >= 1024) {
      this.setState({
        maxValIndex: this.state.maxValIndex + 50
      });
    }
  };
  

  render() {
    let tableToDisplay = <p className="upload-file">Please upload a CSV file.</p>

    if(this.state.csvData) {
      tableToDisplay = <table className="table">
                        <thead>
                          <tr>
                            {
                              Object.keys(this.state.csvData[0]).map(header => {
                                return (
                                  <th key={header}>{header}</th>
                                )
                              })
                            }
                          </tr>
                        </thead>
                        <tbody>
                            {
                              this.state.csvData.slice(this.state.minValIndex, this.state.maxValIndex).map((something, index) => {
                                return(
                                <tr key={index}>
                                  {
                                    Object.keys(something).map((anotherKey, index) => {
                                      return(
                                        <td key={index}>
                                          {something[anotherKey]}
                                        </td>
                                      )
                                    })
                                  }
                                </tr>
                                )
                              })
                            }
                        </tbody>
                      </table>
    }
    
    return (
      <Fragment>
        <div className="table-container">
          <ReactFileReader handleFiles={this.handleFiles}>
            <button className='btn'>Upload CSV</button>
          </ReactFileReader>
        </div>

        <div className="table-container" ref={tableContainer => (this.tableContainer = tableContainer)}>
          {tableToDisplay}
        </div>
      </Fragment>
    );
  }
}

export default App;
