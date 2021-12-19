import React from 'react';
import './Cmd.css';

// React component for all of the old commands -> just shows their text and a new line
export default function OldCmd(props) {
    return (
        <div>
            <label class="Text">{props.text}</label>
            <br/>
        </div>
    )
}