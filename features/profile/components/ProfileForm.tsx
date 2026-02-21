'use client'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useProfile } from '@/features/profile/hooks/useProfile'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useState, useRef, useEffect } from 'react'

export default function ProfileForm() {
    const { user, mutate } = useAuth({ middleware: 'auth' })
    const { updateProfile: updateProfileAPI, updatePassword: updatePasswordAPI, isProfileLoading, isPasswordLoading, errors } = useProfile()
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Profile Form State
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const [stack, setStack] = useState<string[]>([])
    const [stackInput, setStackInput] = useState('')
    const [rateType, setRateType] = useState('hourly')
    const [minPrice, setMinPrice] = useState('')
    const [currency, setCurrency] = useState('IDR')
    const [avatar, setAvatar] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    // Password Form State
    const [currentPassword, setCurrentPassword] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    // Initialize state when user loads
    useEffect(() => {
        if (user) {
            setName(user.name || '')
            setEmail(user.email || '')
            if (user.freelancer_profile) {
                setRole(user.freelancer_profile.role || '')
                setStack(user.freelancer_profile.stack || [])
                setRateType(user.freelancer_profile.rate_type || 'hourly')
                setMinPrice(user.freelancer_profile.min_price?.toString() || '')
                setCurrency(user.freelancer_profile.currency || 'IDR')
            }
        }
    }, [user])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatar(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const handleAddStack = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const trimmedInput = stackInput.trim()
            if (trimmedInput) {
                if (!stack.includes(trimmedInput)) {
                    const newStack = [...stack, trimmedInput]
                    setStack(newStack)
                    updateProfile(undefined, { stack: newStack })
                }
                setStackInput('')
            }
        }
    }

    const removeStack = (itemToRemove: string) => {
        const newStack = stack.filter((item) => item !== itemToRemove)
        setStack(newStack)
        updateProfile(undefined, { stack: newStack })
    }

    const updateProfile = async (e?: React.FormEvent, overrideData: any = {}) => {
        if (e) e.preventDefault()

        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        if (avatar) {
            formData.append('avatar', avatar)
        }

        formData.append('role', role)
        formData.append('rate_type', rateType)
        formData.append('min_price', minPrice)
        formData.append('currency', currency)

        const stackToSave = overrideData.stack !== undefined ? overrideData.stack : stack
        formData.append('stack', JSON.stringify(stackToSave))

        await updateProfileAPI(formData, () => {
            mutate() // Refresh user data
            setAvatar(null)
        }, !!overrideData.stack) // Silent if auto-saving stack
    }

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        await updatePasswordAPI({
            current_password: currentPassword,
            password,
            password_confirmation: passwordConfirmation,
        }, () => {
            setCurrentPassword('')
            setPassword('')
            setPasswordConfirmation('')
        })
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>

            {/* Profile Information */}
            <Card title="Informasi Profil" description="Perbarui informasi profil dan detail freelancer Anda.">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        <Input
                            label="Peran (Role)"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g. Desainer Grafis"
                            error={errors.role?.[0]}
                        />

                        {/* Tech Stack */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Keahlian / Tech Stack
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {stack.map((item, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                                    >
                                        {item}
                                        <button
                                            type="button"
                                            onClick={() => removeStack(item)}
                                            className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-orange-600 hover:bg-orange-200 focus:outline-none"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <Input
                                label="" // Label handled above for layout
                                id="stack-input"
                                value={stackInput}
                                onChange={(e) => setStackInput(e.target.value)}
                                onKeyDown={handleAddStack}
                                placeholder="Type skill and press Enter"
                                error={errors.stack?.[0]}
                            />
                        </div>

                        <div>
                            <Select
                                label="Tipe Rate"
                                id="rate_type"
                                value={rateType}
                                onChange={(e) => setRateType(e.target.value)}
                                options={[
                                    { value: 'hourly', label: 'Per Jam' },
                                    { value: 'fixed', label: 'Per Proyek (Fixed)' }
                                ]}
                                error={errors.rate_type?.[0]}
                            />
                        </div>

                        <div className="flex space-x-4">
                            <div className="w-1/3">
                                <Select
                                    label="Mata Uang"
                                    id="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    options={[
                                        { value: 'IDR', label: 'IDR' },
                                        { value: 'USD', label: 'USD' }
                                    ]}
                                    error={errors.currency?.[0]}
                                />
                            </div>
                            <div className="flex-1">
                                <Input
                                    label="Harga Minimum"
                                    id="min_price"
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="0"
                                    error={errors.min_price?.[0]}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" isLoading={isProfileLoading} className="w-auto px-6">
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Update Password */}
            <Card title="Perbarui Password" description="Pastikan akun Anda menggunakan password yang panjang dan acak agar tetap aman.">
                <form onSubmit={updatePassword} className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
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
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" isLoading={isPasswordLoading} className="w-auto px-6">
                            Simpan Password
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
