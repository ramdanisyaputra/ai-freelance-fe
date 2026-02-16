import axios from '@/lib/axios'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const useProfile = () => {
    const [isProfileLoading, setIsProfileLoading] = useState(false)
    const [isPasswordLoading, setIsPasswordLoading] = useState(false)
    const [errors, setErrors] = useState<any>({})

    const updateProfile = async (formData: FormData, onSuccess?: () => void, silent: boolean = false) => {
        if (!silent) setIsProfileLoading(true)
        setErrors({})

        try {
            await axios.post('/api/profile/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            if (!silent) toast.success('Profil berhasil diperbarui')
            if (onSuccess) onSuccess()
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                toast.error('Gagal memperbarui profil')
                setErrors({ general: ['Something went wrong. Please try again.'] })
            }
        } finally {
            if (!silent) setIsProfileLoading(false)
        }
    }

    const updatePassword = async (data: any, onSuccess?: () => void) => {
        setIsPasswordLoading(true)
        setErrors({})

        try {
            await axios.put('/api/password/update', data)
            toast.success('Password berhasil diperbarui')
            if (onSuccess) onSuccess()
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                toast.error('Gagal memperbarui password')
                setErrors({ general: ['Something went wrong. Please try again.'] })
            }
        } finally {
            setIsPasswordLoading(false)
        }
    }

    return {
        updateProfile,
        updatePassword,
        isProfileLoading,
        isPasswordLoading,
        errors,
        setErrors
    }
}
