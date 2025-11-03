import { useState } from "react"

export default function SignupPage() {
    const [usernameField, setUsernameField] = useState("");
    const [emailField, setEmailField] = useState("");
    const [passwordField, setPasswordField] = useState("");
    const [confirmField, setConfirmField] = useState("");
    const [birthdayField, setBirthdayField] = useState();
    
    const onSubmit = async () => {
        if(!usernameField || !emailField) return

        if(passwordField != confirmField) return;

        const prepareData = {
            username: usernameField,
            email: emailField,
            password: passwordField,
            rememberMe: true,
        };
        
        const response = fetch(`http://77.93.9.99:3000/api/sign-up/email`, {method: "POST", body: JSON.stringify({}), credentials: 'include'});
            
    }

    return (<div>
        <div>
            <label>Username</label>
            <input value={usernameField} onChange={(e) => {setUsernameField(e.target.value)}}></input>

            <label>Email</label>
            <input value={emailField} onChange={(e) => {setEmailField(e.target.value)}}></input>

            <label>Password</label>
            <input value={passwordField} onChange={(e) => {setPasswordField(e.target.value)}}></input>

            <label>Confirm password</label>
            <input value={confirmField} onChange={(e) => {setConfirmField(e.target.value)}}></input>

            <button onClick={onSubmit}>Sign up</button>
        </div>
    </div>)
}