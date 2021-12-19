import React from "react";

export default function Help(props){
    return (
        <div>
            <p><br/>&nbsp;&nbsp; The given terminal is acts like any Unix-based system, but with much more restrictions. </p>
            <h3>&nbsp; Available commands </h3>
            <p>&nbsp;&nbsp; <b>ls</b> - list contents of current directory </p>
            <p>&nbsp;&nbsp; <b>cd [new directory]</b> - change directory (Ex: cd [sub directory name], cd [full path to new directory], cd [partial path to new directory]) </p> 
            <p>&nbsp;&nbsp; <b>makedir</b> - create a directory </p>
            <p>&nbsp;&nbsp; <b>upload [file name]</b> - will prompt you to select a file to upload, which will be available on this system with the name you gave it</p>
            <p>&nbsp;&nbsp; <b>download [file name]</b>- downloads the file, if its in the current directory </p>
        </div>
    );
}