
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface User {
    id: number
    name: string
    email: string
    avatar?: string
    email_verified_at: string
    created_at: string
    updated_at: string
}

interface AuthProps {
    middleware?: 'auth' | 'guest'
    redirectIfAuthenticated?: string
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: AuthProps = {}) => {
    const router = useRouter()

    const { data: user, error, mutate } = useSWR<User>('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
                router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const register = async ({ setErrors, ...props }: { setErrors: (e: any) => void;[key: string]: any }) => {
        await csrf()

        setErrors([])

        axios
            .post('/api/register', props)
            .then((res) => {
                // Response is wrapped in { data: { ... } } by ResponseTrait
                const token = res.data.data?.token || res.data.token
                if (token) {
                    localStorage.setItem('token', token)
                }
                mutate()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const login = async ({ setErrors, setStatus, ...props }: { setErrors: (e: any) => void; setStatus?: (s: any) => void;[key: string]: any }) => {
        await csrf()

        setErrors([])
        if (setStatus) setStatus(null)

        axios
            .post('/api/login', props)
            .then((res) => {
                const token = res.data.data?.token || res.data.token
                if (token) {
                    localStorage.setItem('token', token)
                }
                mutate()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const logout = useCallback(async () => {
        if (!error) {
            await axios.post('/api/logout').then(() => {
                localStorage.removeItem('token')
                // Remove cookies as requested
                Cookies.remove('laravel_session')
                Cookies.remove('XSRF-TOKEN')
                mutate()
            })
        }

        window.location.pathname = '/login'
    }, [error, mutate])



    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated || '/dashboard')
        if (middleware === 'auth' && error) logout()
    }, [user, error, middleware, redirectIfAuthenticated, router, logout])

    return {
        user,
        register,
        login,
        logout,
    }
}
