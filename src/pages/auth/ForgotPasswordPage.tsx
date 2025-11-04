import { useState } from "react"

enum RecoveryPasswordState {
    Email,
    CodeVerification,
    NewPassword,
}

export default function ForgotPasswordPage()
{
    const [recoveryState, setRecoveryState] = useState<RecoveryPasswordState>(RecoveryPasswordState.Email);


    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col">
                <div>
                    <a href="/login">Back</a>
                </div>
                <div className="flex flex-col">
                    <label>Email</label>
                    <input/>
                </div>
                <button>Send code</button>
            </div>
            <p>Forgot password</p>
        </div>
    )
}