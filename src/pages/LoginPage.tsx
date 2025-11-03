import { useState } from "react"

export default function LoginPage()
{
    const [emailField, setEmailField] = useState("");
    const [passwordField, setPasswordField] = useState("");
    const [rememberMeCheck, setRememberMeCheck] = useState(false);

    const onLogin = async () => {
        if(!emailField && !passwordField) return;

        console.log(JSON.stringify({
            email: emailField,
            password: passwordField,
            callbackURL: "",
            rememberMe: rememberMeCheck,
        }));
        const response = await fetch(`http://localhost:3000/api/auth/sign-in/email`, {headers: {"Content-Type": "application/json"}, method: "POST", body: JSON.stringify({
            email: emailField,
            password: passwordField,
            callbackURL: "",
            rememberMe: rememberMeCheck,
        })});

    }

    
    return (<div className="flex justify-center items-center h-screen w-screen bg-black" >
        <div className="flex flex-col bg-gray-700 p-16">
            <div>
                <p className="text-white text-3xl">Log in into your account</p>
            </div>
            <label className="text-white">Email</label>
            <input className="bg-gray-300 p-1" value={emailField} onChange={(e) => {setEmailField(e.target.value)}}/>
            <label className="text-white">Password</label>
            <input className="bg-gray-300 p-1" value={passwordField} onChange={(e) => setPasswordField(e.target.value)}/>
            <button className="my-4 p-1" onClick={onLogin}>Sign in</button>
            <div>
                <label className="text-white">
                    <input onClick={() => {setRememberMeCheck(!rememberMeCheck)}} type="checkbox"/>
                    Remember me
                </label>
            </div>
        </div>    
    </div>)
}