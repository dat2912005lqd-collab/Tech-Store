import React, {
    createContext,
    useContext,
    useState, 
    ReactNode
} from "react";

interface Notification {
    message: string;
    type:"success"| "error"| "warning";
}

const NotificationContext =
createContext<any>(null);

export function NotificationProvider({children}: {
    children: React.ReactNode
}) {
    const [
        notification,setNotification
    ] = useState<Notification | null>(null );
    const show = (
        message: string,
        type: "success"| "error"| "warning"
    ) => {
        setNotification({
            message,type
        });
    };
    return (
        <NotificationContext.Provider
            value={{
                notification,show
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}
export const useNotificationContext = () =>
    useContext( NotificationContext);