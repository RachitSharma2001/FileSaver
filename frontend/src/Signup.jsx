import { React, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {withRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { contains } from 'jquery';

export default function SignUp(props) {
    
    // React hook variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signupSuccess, setUserSignedUp] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);
    // Given Server Side Url
    const givenUrl = props.url;

    const checkUser = (userUrl) => {
        const waitToCheck = new Promise((resolve) => {
            fetch(userUrl, {method: "GET"}).then(res => res.json()).then(data => {
                resolve(data['user_exists']);
            });
        });
        return waitToCheck;
    }

    const contains = (password, character) => {
        return password.indexOf(character) !== -1;
    }

    const containsSpecial = (password) => {
        const specialChars = "!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?";
        for(let i = 0; i < specialChars.length; i++){
            if(contains(password, specialChars[i])) return true;
        }
        return false;
    }

    const containsUpper = (password) => {
        const upperChars = "QWERTYUIOPASDFGHJKLZXCVBNM";
        for(let i = 0; i < 26; i++){
            if(contains(password, upperChars[i])) return true;
        }
        return false;
    }

    const passCheck = (password) => {
        // Regex to check for upper case & special characters
        return password.length >= 10 && containsUpper(password) && containsSpecial(password);
    };

    // Function for checking if user exists and if so, creating the user
    const createUser = () => {
        if(!passCheck(password)){
            console.log(password + " is not good");
            setPasswordErr(true);
            setUserSignedUp(false); 
            setEmailExists(false);
            return;
        }
        let userUrl = givenUrl + "files/user?email=" + email + "&password=" + password;
        checkUser(userUrl).then(userExists => {
            console.log("Check user exist: " + userExists);
            if(!userExists){
                fetch(userUrl, {method: "POST"}).then(res => res.json()).then(data => {
                    let userId = data['id']
                    let createDirUrl = givenUrl + "files/dir?parent_path=C:&dir_name=home&dir_path=C:/home&is_home_path=1&user_id=" + userId;
                    fetch(createDirUrl, {method: "POST"}).then(res => {
                        console.log("Created with user id: " + userId);
                        setUserSignedUp(true); 
                        setEmailExists(false);
                        setPasswordErr(false);
                    });
                });
            }else{
                setEmailExists(true);
                setUserSignedUp(false);
                setPasswordErr(false);
            }
        });
    }

    // Function called when user types changes into email field
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    // Function called when user types changes into password field
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    return (
        <Form>
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <Form.Group className="mb-3" controlId="formBasicEmail" style={{width: "500px", marginTop:"30px", marginLeft: "100px", marginRight: "100px"}}>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={handleEmailChange}/>
                <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>
            </div>

            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <Form.Group className="mb-3" controlId="formBasicPassword" style={{width: "500px", marginTop:"30px", marginLeft: "100px", marginRight: "100px"}}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={handlePasswordChange} />
            </Form.Group>
            </div>

            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            {signupSuccess && <p> You have successfully signed up! Now go and log in. </p>}
            </div>

            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            {emailExists && <p> Email already exists! </p>}
            </div>

            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            {passwordErr && <p> Password must be at least 10 characters and contain an upper case and special character </p>}
            </div>
            
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <Button onClick={createUser} style={{marginTop:"30px", marginLeft: "100px", marginRight: "10px"}}> Create Account </Button>
            </div>
            
        </Form>
    );
}