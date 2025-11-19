import { useState } from "react"
import { authSignup } from "../../features/auth/api/api";
import { useNotify } from "../../shared/NotificationProvider";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
    const navigate = useNavigate();
    const notify = useNotify();

    const [usernameField, setUsernameField] = useState("");
    const [emailField, setEmailField] = useState("");

    const [nameField, setNameField] = useState("");
    const [surnameField, setSurameField] = useState("");

    const [passwordField, setPasswordField] = useState("");
    const [confirmField, setConfirmField] = useState("");
    const [birthdayField, setBirthdayField] = useState("2025-01-01");
    
    const onSubmit = async () => {
        if(!usernameField || !emailField) return

        if(passwordField != confirmField) return;


        const prepareData = {
            username: usernameField,
            email: emailField,
            name: nameField,
            surname: surnameField,
            birthday: birthdayField,
            password: passwordField,
            rememberMe: true,
        };
    
        console.log(prepareData);
        
        authSignup(prepareData).then((response) => {
            console.log(response)
            notify(response.message)
            if(response.ok) navigate("/");
        })
    }

    return (<div className="flex bg-red-100 justify-center items-center h-screen w-screen">
        <div className="flex flex-col gap-1 bg-gray-200 p-12">
            <label>Username</label>
            <input value={usernameField} onChange={(e) => {setUsernameField(e.target.value)}}></input>

            <label>Email</label>
            <input value={emailField} onChange={(e) => {setEmailField(e.target.value)}}></input>

            <label>Name</label>
            <input value={nameField} onChange={(e) => {setNameField(e.target.value)}}></input>

            <label>Surname</label>
            <input value={surnameField} onChange={(e) => {setSurameField(e.target.value)}}></input>

            <label>Password</label>
            <input type="password" value={passwordField} onChange={(e) => {setPasswordField(e.target.value)}}></input>

            <label>Confirm password</label>
            <input type="password" value={confirmField} onChange={(e) => {setConfirmField(e.target.value)}}></input>
            
            <div className="flex flex-row">
                <input type="date" onChange={(e) => setBirthdayField(e.target.value)}/>
            </div>

            <button onClick={onSubmit}>Sign up</button>
        </div>
    </div>)
}