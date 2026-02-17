import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
    interface Window {
        Pusher: typeof Pusher
        Echo: any
    }
}

let echoInstance: any = null

export const initializeEcho = (token: string) => {
    if (echoInstance) {
        return echoInstance
    }

    try {
        window.Pusher = Pusher

        // Suppress Pusher connection error logs in development
        Pusher.logToConsole = false

        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'app-key',
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
            wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8080'),
            wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8080'),
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http') === 'https',
            enabledTransports: ['ws', 'wss'],
            authEndpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        })

        // Handle connection errors gracefully
        echoInstance.connector.pusher.connection.bind('error', () => {
            console.warn('[Echo] WebSocket connection failed. Reverb server may not be running.')
        })

        window.Echo = echoInstance
    } catch (error) {
        console.warn('[Echo] Failed to initialize:', error)
        // Return a no-op echo instance to prevent crashes
        echoInstance = {
            private: () => ({
                listen: () => ({}),
                stopListening: () => ({}),
            }),
            leave: () => { },
            disconnect: () => { },
        }
    }

    return echoInstance
}

export const getEcho = () => {
    return echoInstance
}

export const disconnectEcho = () => {
    if (echoInstance) {
        try {
            echoInstance.disconnect()
        } catch {
            // ignore disconnect errors
        }
        echoInstance = null
    }
}
