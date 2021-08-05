import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import './App.css';


//render City Component
function City(props) {
  return (
      <div className="card modified-margin">
        <h4 className="card-header">{props.data.City}, {props.data.State}</h4>
        <div className="card-body">
        <ul className="card-text">
          <li>State: {props.data.State}</li>
          <li>Location: ({props.data.Lat}, {props.data.Long})</li>
          <li>Population(estimated): {props.data.EstimatedPopulation}</li>
          <li>Total Wages: {props.data.TotalWages}</li>
        </ul>
        </div>
      </div>
  );
}
//Don't put fetch call in render bc need to update the state which results in endless loop
//onChange is the way we listen to event and handle the event
function ZipSearchField(props) { //render function for the component
  return (
    <div className="zipcode">
      Zip Code:
      <input type="text" onChange={props.zipChange} value={props.zipValue}/>
    </div>
    //this onChange will update the user input on console
  );
}

//*
//Try to update the functionity that whenever user enters in letter, provides warning/didn't allow user to type

class App extends Component {

  state={
    userInputValue: "",
    results: [], //we initialize with array since this API is going to return array of data
  }
  //App function that get and update the zipcode, so where the city component could have the access to the state
  handleZipChange(event) {
    this.setState({
      userInputValue: event.target.value //now in this function, this is update the state value
    })

    console.log(event.target.value);
     
    if (event.target.value.length === 5){
    //this is where the fetch been placed
    fetch('http://ctp-zip-api.herokuapp.com/zip/'+ event.target.value)
      .then(res => res.json())
      .then(jsonData => {
        this.setState({
          results: jsonData //update the results as the jsonData that target from user input zipcode
        });
      })
      .catch(err => this.setState({ results: [] }));
    } else { 
      this.setState({
        results: [],
      })
    }

  }

  render() {
    //this should not been placed in the state/fetch
    //since this call will be in the wait stage to be called, but render is infinite loop
    console.log(this.state.results);

    return (
        <div className="App">
          <div className="App-header"> 
            <h2>Zip Code Search</h2>
          </div>
        
          <div className="container">
            <div className="row">
              <div className="col align-self-center modified-margin">
                <ZipSearchField zipChange={(e) => this.handleZipChange(e)} zipValue = {this.state.userInputValue}/>
                <div>
                  {this.state.results.map((item) => {
                      return <City data = {item}/>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default App;
