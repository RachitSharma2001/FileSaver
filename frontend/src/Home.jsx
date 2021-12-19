import { React, useState } from 'react';
import './Home.css';
import Box from '@mui/material/Box';
import CmdInput from './CmdInput.jsx';
import OldCmd from './OldCmd.jsx';
import _default from '@popperjs/core/lib/modifiers/flip';
function makeNewPath(path, cmd){
    return path + "> " + cmd;
}
function inDirectory(dirContent, potentialItem){
    for(let i = 0; i < dirContent.length; i++){
        if(dirContent[i] == potentialItem){
        return true;
        }
    }
    return false;
}
function getDirPath(newDir, givenDirPath){
    if(newDir.startsWith('C:')){
        // newDir is a direct path (not one in our directory)
        return newDir;
    }else if(newDir.startsWith('../') && newDir.match(/(..\/)+[A-Z,a-z,0-9,_,.,\/]+/)[0] == newDir){
        let lastSlashInd = newDir.lastIndexOf('../')+3;
        let subdir = newDir.substring(lastSlashInd);
        let numUpwards = lastSlashInd / 3;
        if(subdir == ".."){
          subdir = "";
          numUpwards++;
        }
        let givenDirSplit = givenDirPath.split('/');
        let newPrefixPath = givenDirSplit.slice(0, givenDirSplit.length - numUpwards).join('/');
        return newPrefixPath + (subdir.length != 0 ? '/' + subdir : '');
    }else if(newDir == '..'){
        return givenDirPath.substring(0, givenDirPath.lastIndexOf('/'));
    }else{
        let indexOfSlash = (newDir.indexOf('/') == -1 ? newDir.length : newDir.indexOf('/'));
        return givenDirPath + "/" + newDir;
    }
}
export default function Home(props){
    const userId = props.userId;
    const [cmdList, changeCmdList] = useState([]);
    const backend_url = "http://127.0.0.1:8000/";
    const [currDirPath, setCurrDirPath] = useState('C:');
    const [subdirList, setSubdirList] = useState(['home']);
    const [fileList, setFileList] = useState([]);
    const [fileSelectName, setFileName] = useState('');
    const [backgroundHeight, setBackgroundHeight] = useState(200);
    
    // Function called once user selects file
    const fileSelected = (event) => {
      const file = event.target.files[0];
      const form_data = new FormData();
      form_data.append('file', file);
      let insertFileUrl = backend_url + 'files/file?name='+fileSelectName + '&parent_path='+currDirPath + '&user_id=' + userId;
      // Call api endpoint that saves file to database
      fetch(insertFileUrl, {
        body: form_data,
        method: "POST"
      });
    }
    
    const handleLs = (givenDirPath, givenCmd) => {
      const waitToAdd = new Promise((resolve) => { 
        cmdList.push(makeNewPath(givenDirPath, givenCmd));
        for(let i = 0; i < fileList.length; i++){
          cmdList.push(fileList[i]);
        }
        for(let i = 0; i < subdirList.length; i++){
          cmdList.push(subdirList[i]);
        }
        changeCmdList([...cmdList]);
        resolve();
      });
      return waitToAdd;
    }
  
    const handleMakedir = (givenDirPath, givenCmd) => {
      const waitToInterpret = new Promise((resolve) => {
        let newDir = givenCmd.substring(8);
        if(newDir.length == 0){
          changeCmdList([...cmdList, makeNewPath(givenDirPath, givenCmd), "Invalid Directory Name"]);
          resolve();
        }else if(givenDirPath == 'C:'){
          changeCmdList([...cmdList, makeNewPath(givenDirPath, givenCmd), "Cannot insert anything in the root directory"]);
          resolve();
        }else{
          setSubdirList([...subdirList, newDir]);
          let newPath = givenDirPath + '/' + newDir;
          let makeDirUrl = backend_url + 'files/dir?dir_name=' + newDir + '&dir_path=' + newPath + '&parent_path=' + currDirPath + "&user_id=" + userId + "&is_home_path=0";
          fetch(makeDirUrl, {method:"POST"})
          .then(res => {
            changeCmdList([...cmdList, makeNewPath(givenDirPath, givenCmd)]);
            resolve();
          });
        }
      });
      return waitToInterpret;
    };
  
    const handleCd = (givenDirPath, givenCmd) => {
      const waitToInterpret = new Promise((resolve) => {
        let newDir = givenCmd.substring(3);
        let newDirPath = getDirPath(newDir, givenDirPath);
        let getDirUrl = backend_url + 'files/dir?user_id=' + userId + '&dir_path=' + newDirPath;
        fetch(getDirUrl).then(res => {
          if(!res.ok){
            throw res;
          }
          return res.json();
        }).then(data => {
          let newFileList = [];
          let newSubdirList = [];
          for(const fileIndex in data['files']){
            newFileList.push(data['files'][fileIndex]);
          }
          for(const dirIndex in data['subdirs']){
            newSubdirList.push(data['subdirs'][dirIndex]);
          }
          setFileList([...newFileList]);
          setSubdirList([...newSubdirList]);
          setCurrDirPath(newDirPath);
          changeCmdList([...cmdList, makeNewPath(givenDirPath, givenCmd)]);
          resolve();
        }).catch((error) => {
          let errorMessage = "Directory does not exist";
          changeCmdList([...cmdList, makeNewPath(givenDirPath, givenCmd), errorMessage]);
          resolve();
        });
      });
      return waitToInterpret;
    };
  
    const handleUpload = (givenDirPath, givenCmd) => {
      const waitToInterpret = new Promise((resolve, reject) => {
        let fileName = givenCmd.substring(7);
        if(fileName.length == 0){
          changeCmdList([...cmdList, makeNewPath(givenDirPath, givenCmd), "Invalid file name"]);
          resolve();
        }else if(givenDirPath == 'C:'){
          changeCmdList([...cmdList, makeNewPath(givenDirPath, givenCmd), "Cannot insert anything in the root directory"]);
          resolve();
        }else{
          setFileList([...fileList, fileName]);
          setFileName(fileName);
          // Click the invisible upload button that triggers file selection for user
          document.getElementById('upload').click();
          changeCmdList([...cmdList, makeNewPath(givenDirPath, givenCmd)]);
          resolve();
        }
      });
      return waitToInterpret;
    };
  
    const handleDownload = (givenDirPath, givenCmd) => {
      const waitToInterpret = new Promise((resolve, reject) => {
        let fileName = givenCmd.substring(9);
        if(inDirectory(fileList, fileName)){
          // Get binary data of file, or return error if doesn't exist
          window.location.href = backend_url + 'files/file?name=' + fileName;
          changeCmdList([...cmdList, makeNewPath(givenDirPath, givenCmd)]);
          resolve();
        }else{
          changeCmdList([...cmdList, makeNewPath(givenDirPath, givenCmd), "File does not exist in directory"]);
          resolve();
        }
      });
      return waitToInterpret;
    };
  
    /*
      Function called by CmdInput.jsx once user enters command
      Parameters:
        givenDirPath - string representing directory command was entered
        givenCmd - string representing command
      Returns:
        a promise that interprets the given command and updates the cmd list
    */
    const interpretCmd = (givenDirPath, givenCmd) => {
      if(window.innerHeight + window.scrollY > document.getElementById('box').scrollHeight){
        document.getElementById('box').style.height = backgroundHeight.toString() + "vh";
        setBackgroundHeight(backgroundHeight+50);
      }
      const waitToInterpret = new Promise((resolve) => {
        if(givenCmd == "ls"){
          handleLs(givenDirPath, givenCmd).then(result => {
            resolve();
          });
        }else if(givenCmd.startsWith("makedir ")){
          handleMakedir(givenDirPath, givenCmd).then(result => {
            resolve();
          });
        }else if(givenCmd.startsWith("cd ")){
          handleCd(givenDirPath, givenCmd).then(result => {
            resolve();
          });
        }else if(givenCmd.startsWith("upload ")){
          handleUpload(givenDirPath, givenCmd).then(result => {
            resolve();
          });
        }else if(givenCmd.startsWith("download ")){
          handleDownload(givenDirPath, givenCmd).then(result => {
            resolve();
          });
        }else{
          changeCmdList([...cmdList, makeNewPath(givenDirPath, givenCmd), "Command given does not exist"]);
          resolve();
        }
      });
      return waitToInterpret;
    }

    return (
      <div id="box" style={{backgroundColor: 'black'}}>
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            backgroundColor: 'black'
          }}
        >
          <input className="invisible" type="file" name="file" id="upload" onChange={fileSelected}/>
          {cmdList.map((cmd) => <OldCmd text={cmd}/>)}
          <CmdInput interpretCmd={interpretCmd} currDirPath={currDirPath}/>
        </Box>
      </div>
    )
}
