import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentMockUserProfile, updateCurrentMockUserProfile } from '../utils/mockAuthStorage'

const EMPTY_PROFILE = {
  fullName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  streetAddress: '',
  apartment: '',
  city: '',
  province: '',
  postalCode: '',
  bio: '',
  avatarDataUrl: '',
}

const PROFILE_IMAGE_MAX_SIZE = 2 * 1024 * 1024

function ProfilePage() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState(EMPTY_PROFILE)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const profile = getCurrentMockUserProfile()

    if (!profile) {
      navigate('/signin')
      return
    }

    setFormValues({
      fullName: profile.fullName || '',
      email: profile.email || '',
      phoneNumber: profile.phoneNumber || '',
      dateOfBirth: profile.dateOfBirth || '',
      streetAddress: profile.streetAddress || '',
      apartment: profile.apartment || '',
      city: profile.city || '',
      province: profile.province || '',
      postalCode: profile.postalCode || '',
      bio: profile.bio || '',
      avatarDataUrl: profile.avatarDataUrl || '',
    })
  }, [navigate])

  const onChangeField = (field) => (event) => {
    const { value } = event.target
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSaving(true)

    try {
      updateCurrentMockUserProfile(formValues)
      setSuccessMessage('Profile updated successfully.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update profile right now.')
    } finally {
      setIsSaving(false)
    }
  }

  const onAvatarUpload = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    setErrorMessage('')
    setSuccessMessage('')

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please choose an image file for your profile photo.')
      return
    }

    if (file.size > PROFILE_IMAGE_MAX_SIZE) {
      setErrorMessage('Profile photo must be 2MB or smaller.')
      return
    }

    const fileReader = new FileReader()
    fileReader.onload = () => {
      const nextValue = typeof fileReader.result === 'string' ? fileReader.result : ''

      if (!nextValue) {
        setErrorMessage('Could not read that image. Please try another file.')
        return
      }

      setFormValues((current) => ({
        ...current,
        avatarDataUrl: nextValue,
      }))
    }
    fileReader.onerror = () => {
      setErrorMessage('Could not read that image. Please try another file.')
    }
    fileReader.readAsDataURL(file)
  }

  const onRemoveAvatar = () => {
    setFormValues((current) => ({ ...current, avatarDataUrl: '' }))
    setErrorMessage('')
    setSuccessMessage('')
  }

  const profileInitial = formValues.fullName?.trim()?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className="relative min-h-screen pb-20 pt-8">
      <main className="relative z-10 mx-auto max-w-[920px] px-5 lg:px-8">
        <section className="sun-card sun-card--review p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">Account Settings</p>
              <h1 className="mt-2 text-4xl font-black text-slate-800 sm:text-5xl">Edit Profile</h1>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-3xl bg-[#efe8f8] p-4 sm:p-5">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-violet-600 text-2xl font-black text-white">
              {formValues.avatarDataUrl ? (
                <img src={formValues.avatarDataUrl} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                profileInitial
              )}
            </div>

            <div className="space-y-2">
              <label className="inline-flex cursor-pointer items-center rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700">
                Upload Photo
                <input type="file" accept="image/*" onChange={onAvatarUpload} className="hidden" />
              </label>

              {formValues.avatarDataUrl && (
                <button
                  type="button"
                  onClick={onRemoveAvatar}
                  className="ml-2 rounded-full bg-[#e4dcef] px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-[#dcd1ea]"
                >
                  Remove
                </button>
              )}

              <p className="text-xs font-semibold text-slate-500">JPG, PNG, WEBP up to 2MB</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            {successMessage && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{successMessage}</p>}
            {errorMessage && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{errorMessage}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Full Name</span>
                <input
                  value={formValues.fullName}
                  onChange={onChangeField('fullName')}
                  required
                  className="w-full rounded-full bg-[#ece6f4] px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent focus:ring-violet-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Email</span>
                <input
                  value={formValues.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-full bg-[#e5dfeb] px-4 py-3 text-sm font-semibold text-slate-500 outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Phone Number</span>
                <input
                  value={formValues.phoneNumber}
                  onChange={onChangeField('phoneNumber')}
                  className="w-full rounded-full bg-[#ece6f4] px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent focus:ring-violet-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Date of Birth</span>
                <input
                  type="date"
                  value={formValues.dateOfBirth}
                  onChange={onChangeField('dateOfBirth')}
                  className="w-full rounded-full bg-[#ece6f4] px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent focus:ring-violet-400"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-700">Street Address</span>
                <input
                  value={formValues.streetAddress}
                  onChange={onChangeField('streetAddress')}
                  className="w-full rounded-full bg-[#ece6f4] px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent focus:ring-violet-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Apartment / Suite</span>
                <input
                  value={formValues.apartment}
                  onChange={onChangeField('apartment')}
                  className="w-full rounded-full bg-[#ece6f4] px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent focus:ring-violet-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">City</span>
                <input
                  value={formValues.city}
                  onChange={onChangeField('city')}
                  className="w-full rounded-full bg-[#ece6f4] px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent focus:ring-violet-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Province</span>
                <input
                  value={formValues.province}
                  onChange={onChangeField('province')}
                  className="w-full rounded-full bg-[#ece6f4] px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent focus:ring-violet-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Postal Code</span>
                <input
                  value={formValues.postalCode}
                  onChange={onChangeField('postalCode')}
                  className="w-full rounded-full bg-[#ece6f4] px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent focus:ring-violet-400"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-700">Short Bio</span>
                <textarea
                  rows={4}
                  value={formValues.bio}
                  onChange={onChangeField('bio')}
                  className="w-full resize-none rounded-3xl bg-[#ece6f4] px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent focus:ring-violet-400"
                  placeholder="Tell us a little about yourself"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-violet-600 px-6 py-3 text-sm font-black text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

export default ProfilePage
