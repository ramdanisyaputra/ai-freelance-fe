'use client'

import { useAuth } from '@/hooks/auth'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useState, useRef } from 'react'
import axios from '@/lib/axios'

export default function Profile() {
    const { user, mutate } = useAuth({ middleware: 'auth' })
    const [status, setStatus] = useState<string | null>(null)
    const [errors, setErrors] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Profile Form State
    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [avatar, setAvatar] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    // Password Form State
    const [currentPassword, setCurrentPassword] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatar(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})
        setStatus(null)

        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        if (avatar) {
            formData.append('avatar', avatar)
        }

        try {
            await axios.post('/api/profile/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            mutate() // Refresh user data
            setStatus('profile-updated')
            setAvatar(null)
            // Keep preview or update it based on response? user data refresh should handle it
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                setErrors({ general: ['Something went wrong. Please try again.'] })
            }
        } finally {
            setLoading(false)
        }
    }

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})
        setStatus(null)

        try {
            await axios.put('/api/password/update', {
                current_password: currentPassword,
                password,
                password_confirmation: passwordConfirmation,
            })
            setStatus('password-updated')
            setCurrentPassword('')
            setPassword('')
            setPasswordConfirmation('')
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                setErrors({ general: ['Something went wrong. Please try again.'] })
            }
        } finally {
            setLoading(false)
        }
    }

    // Initialize state when user loads
    if (user && !name) {
        setName(user.name)
        setEmail(user.email)
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>

            {/* Profile Information */}
            <Card title="Informasi Profil" description="Perbarui informasi profil dan alamat email akun Anda.">
                <form onSubmit={updateProfile} className="mt-6 space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center space-x-6">
                        <div className="shrink-0">
                            {avatarPreview ? (
                                <img
                                    className="h-16 w-16 object-cover rounded-full border border-gray-200"
                                    src={avatarPreview}
                                    alt="Current profile photo"
                                />
                            ) : user?.avatar ? (
                                <img
                                    className="h-16 w-16 object-cover rounded-full border border-gray-200"
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${user.avatar}`}
                                    alt="Current profile photo"
                                />
                            ) : (
                                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center text-[#FE5B00] text-xl font-bold border border-orange-200">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <label className="block">
                            <span className="sr-only">Choose profile photo</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-orange-50 file:text-[#FE5B00]
                                hover:file:bg-orange-100 transition-colors cursor-pointer
                              "
                                accept="image/*"
                            />
                        </label>
                    </div>

                    <Input
                        label="Nama"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        error={errors.name?.[0]}
                    />

                    <Input
                        label="Email"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        error={errors.email?.[0]}
                    />

                    {status === 'profile-updated' && (
                        <p className="text-sm text-green-600">TERSAVE.</p>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" isLoading={loading} className="w-auto px-6">
                            Simpan
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Update Password */}
            <Card title="Perbarui Password" description="Pastikan akun Anda menggunakan password yang panjang dan acak agar tetap aman.">
                <form onSubmit={updatePassword} className="mt-6 space-y-6">
                    <Input
                        label="Password Saat Ini"
                        type="password"
                        id="current_password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        error={errors.current_password?.[0]}
                    />

                    <Input
                        label="Password Baru"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        error={errors.password?.[0]}
                    />

                    <Input
                        label="Konfirmasi Password"
                        type="password"
                        id="password_confirmation"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                    />

                    {status === 'password-updated' && (
                        <p className="text-sm text-green-600">TERSAVE.</p>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" isLoading={loading} className="w-auto px-6">
                            Simpan
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
