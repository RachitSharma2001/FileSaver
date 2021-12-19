import { React, useState } from 'react';
import './Cmd.css';
/* React component for the current command user enters */
export default function CmdInput(props){
  const { interpretCmd, currDirPath, clearCmdInput } = props;
  const [cmdString, setCmdString] = useState("");
  
  // Function called when user types new text.
  const changedText = (event) => {
    // Set text shown to new text
    setCmdString(event.target.value);
  }

  // Function called when user clicks enter keyboard button
  const cmdEntered = (event) => {
    // prevent page from reloading (it empties the screen otherwise)
    event.preventDefault();
    // Call parent function addToCmd, wait for it to finish
    interpretCmd(currDirPath, cmdString).then(result => {
        // Reset user text (otherwise on next line the previous line user entered is still existent)
        event.target.reset();
    })
  }
  
  // Render html => we make sure to autofocus cursor on this input
  return (
    <form onSubmit={cmdEntered}>
        <label style={{color: 'green', fontSize: "20px"}}>{currDirPath}&gt;&nbsp;</label>
        <input className="CmdText" autoFocus onChange={changedText}/>
    </form>
  );
}