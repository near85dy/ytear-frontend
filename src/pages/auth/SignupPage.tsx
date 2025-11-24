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
    const [birthdayField, setBirthdayField] = useState("2007-01-01");
    
    const onSubmit = async () => {
        if(!usernameField || !emailField) return notify("Some fields is empty");

        if(passwordField != confirmField || !passwordField) return notify("Password not confirmed");

        const prepareData = {
            username: usernameField,
            email: emailField,
            name: nameField,
            surname: surnameField,
            birthday: birthdayField,
            password: passwordField,
            rememberMe: true,
        };
            
        authSignup(prepareData).then((response) => {
            response.json().then((json) => {
                notify(json.message)
            })
            if(response.ok) navigate("/");
        })
    }

    const inputFieldStyles = "bg-gray-200 text-lg border-none";

    return (
    <>
        <div className="flex bg-indigo-900 justify-center items-center h-screen w-screen focus:border-none">  
            <div className="flex flex-col gap-1 bg-white p-12">
                <label>Username</label>
                <input className={inputFieldStyles} value={usernameField} onChange={(e) => {setUsernameField(e.target.value)}}></input>

                <label>Email</label>
                <input className={inputFieldStyles} value={emailField} onChange={(e) => {setEmailField(e.target.value)}}></input>

                <label>Name</label>
                <input className={inputFieldStyles} value={nameField} onChange={(e) => {setNameField(e.target.value)}}></input>

                <label>Surname</label>
                <input className={inputFieldStyles} value={surnameField} onChange={(e) => {setSurameField(e.target.value)}}></input>

                <label>Password</label>
                <input className={inputFieldStyles} type="password" value={passwordField} onChange={(e) => {setPasswordField(e.target.value)}}></input>

                <label>Confirm password</label>
                <input className={inputFieldStyles} type="password" value={confirmField} onChange={(e) => {setConfirmField(e.target.value)}}></input>
                
                {/* <div className="flex flex-row">
                    <input type='text' placeholder="Day"/>
                    <input type='text' placeholder="Mounth"/>
                    <input type='text' placeholder="Year"/>
                </div> */}

                <div className="flex flex-row">
                    <input type="date" onChange={(e) => setBirthdayField(e.target.value)}/>
                </div>
                <hr className="w-full my-4" />

                <button className="p-3 bg-blue-600 border-none text-white" onClick={onSubmit}>Sign up</button>
            </div>
        </div>
        <style>
            {`
            label { 
                font-size: 1.25rem;
                line-height: 1.75rem;
            }
        `}
        </style>
    </>)
}