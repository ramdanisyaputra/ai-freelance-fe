import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
    },
    withCredentials: true,
    withXSRFToken: true
})

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
        // console.log('Attaching API Token:', token.substring(0, 10) + '...')
    }
    return config
})

export default axios
