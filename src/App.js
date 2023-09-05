import React, { Component, useState } from "react";
import SpeechToText from './SpeechToText';
import ModalDialog, { MODAL_STATES } from './ModalDialog';
import Completion from "./Completion";

const App = () => {

  const [modal_state, setModalState] = useState({ state: "" });
  const [relatives, setRelatives] = useState([]);

  function handleAdd(e) {
    setModalState({ state: "addRelatives" });
  }

  function generateQuery(e) {
    setModalState({ state: "generateQuery" });
  }

  const handleNewRelative = (newRelative) => {
    setRelatives((prevRelatives) => [...prevRelatives, newRelative]);
  };

  let updateModalState = (obj, newState, args) => {
    if (obj === MODAL_STATES.CLOSED) {
      if (args && args.ignore) {
        console.log("ignored")
      } else {
        setModalState({ state: newState });
      }
    }
  }
  return (
    <>

      {(modal_state.state == "addRelatives") &&
        <ModalDialog onModalStateChange={(obj, args) => updateModalState(obj, "", args)} title={"Search for Relative"} show={() => true}>
          <SpeechToText onNewRelative={handleNewRelative} />
        </ModalDialog>}
      {(modal_state.state == "generateQuery") &&
        <ModalDialog onModalStateChange={(obj, args) => updateModalState(obj, "", args)} title={"Generate an SQL Query"} show={() => true}>
          <Completion />
        </ModalDialog>}
      <div style={{ height: '90%', maxHeight: '100%', padding: '20px' }}>

        <div style={{ height: 'calc(100% - 50px)', padding: '0px' }}>
          <div>
            <div className="ribbon-white"></div>
            <div className="ribbon-grey"></div>
            <div className="header">
              <h1>Relatives</h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <button className='actionButton' onClick={handleAdd}>Add Relative</button>
              <button className='actionButton' onClick={generateQuery}>Voice Filter</button>
            </div>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Middle Name</th>
                  <th>Last Name</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Date of Birth</th>
                </tr>
              </thead>
              <tbody>
                {relatives.map((relative, index) => (
                  <tr className='displayTable' key={index} style={{ textAlign: "center" }}>
                    <td>{relative.firstName}</td>
                    <td>{relative.middleName}</td>
                    <td>{relative.lastName}</td>
                    <td>{relative.city}</td>
                    <td>{relative.state}</td>
                    <td>{relative.DateOfBirth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>

  );
}

export default App;