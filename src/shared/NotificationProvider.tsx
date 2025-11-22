import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

const NotificationContext = createContext((msg: string) => {console.log(msg)});

export function NotificationProvider({children}: {children: ReactNode})
{
    const [message, setMessage] = useState("");

    const notify = useCallback((msg: string) => {
        setMessage(msg)

        setTimeout(() => setMessage(""), 3000)
    }, [])

    return (
        <NotificationContext.Provider value={notify}>
            {children}
            {message ? 
            <div className="fixed top-2 left-auto md:top-auto md:bottom-2 md:left-2 bg-red-700 px-10 rounded-md z-50">
                <div>
                    <p className="text-white text-lg">{message}</p>
                </div>
            </div> : <></>}
        </NotificationContext.Provider>
    )
}

export const useNotify = () => useContext(NotificationContext);