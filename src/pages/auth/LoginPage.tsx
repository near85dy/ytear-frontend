import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { authLogin } from "../../features/auth/api/api";
import { useNotify } from "../../shared/NotificationProvider";
import { useUser } from "../../entity/user/model/selectors";

export default function LoginPage()
{
    const navigate = useNavigate();
    const notify = useNotify();
    const user = useUser();

    const [emailField, setEmailField] = useState("");
    const [passwordField, setPasswordField] = useState("");
    const [rememberMeCheck, setRememberMeCheck] = useState(false);

    useEffect(() => {
        if(user) navigate("/");
    }, [])

    const onLogin = () => {
        if(!emailField || !passwordField) return notify("Email or password field empty is failed");

        authLogin({email: emailField, password: passwordField, rememberMe: rememberMeCheck}).then((data) => {
            if(data.message)   
            {
                notify(data.message)
                return;
            }
            navigate("/");
        })
    }
    return (<div className="flex justify-center items-center h-screen w-screen" >
        <div className="flex flex-col bg-blue-700 p-12 gap-2 border-2 rounded-md">
            <div>
                <p className="text-white text-4xl">Log in into your account</p>
            </div>
            <div className="flex flex-col">
                <label className="text-white text-2xl">Email</label>
                <input className="bg-gray-300 text-xl" value={emailField} onChange={(e) => {setEmailField(e.target.value)}}/>
            </div>
            <div className="flex flex-col">
                <label className="text-white text-2xl">Password</label>
                <input type="password" className="bg-gray-300 text-xl" value={passwordField} onChange={(e) => setPasswordField(e.target.value)}/>
            </div>
            <div className="flex justify-end">
                <a href="/forgot-password" className="text-white text-lg hover:text-blue-200">Forgot a password?</a>
            </div>
            <button className="my-4 p-1 text-2xl bg-gray-300 border hover:bg-blue-200" onClick={onLogin}>Sign in</button>
            <div className="flex flex-col gap-5">
                <label className="text-white text-xl">
                    <input onClick={() => {setRememberMeCheck(!rememberMeCheck)}} type="checkbox"/>
                    Remember me
                </label>
                <a href="./signup" className="text-white text-xl px-2">
                    I don't have an account
                </a>
            </div> 
        </div>
    </div>)
}