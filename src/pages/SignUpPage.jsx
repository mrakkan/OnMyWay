import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BackgroundGradientAnimation from '../components/BackgroundGradientAnimation'
import { registerMockUser } from '../utils/mockAuthStorage'

function SignUpPage() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    streetAddress: '',
    apartment: '',
    city: '',
    province: 'กรุงเทพมหานคร',
    postalCode: '',
    acceptTerms: false,
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (field) => (event) => {
    const isCheckbox = event.target.type === 'checkbox'
    const value = isCheckbox ? event.target.checked : event.target.value
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!formValues.acceptTerms) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy before creating your account.')
      return
    }

    if (formValues.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    if (formValues.password !== formValues.confirmPassword) {
      setErrorMessage('Password and confirmation do not match.')
      return
    }

    try {
      registerMockUser({
        fullName: formValues.fullName,
        dateOfBirth: formValues.dateOfBirth,
        phoneNumber: formValues.phoneNumber,
        email: formValues.email,
        password: formValues.password,
        streetAddress: formValues.streetAddress,
        apartment: formValues.apartment,
        city: formValues.city,
        province: formValues.province,
        postalCode: formValues.postalCode,
      })

      setSuccessMessage('Account created! Redirecting you to sign in...')

      window.setTimeout(() => {
        navigate('/signin', {
          state: {
            signupSuccess: true,
            email: formValues.email.trim().toLowerCase(),
          },
        })
      }, 700)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create account. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen text-slate-800">
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(243, 239, 247)"
        gradientBackgroundEnd="rgb(111, 76, 224)"
        firstColor="122, 90, 248"
        secondColor="147, 51, 234"
        thirdColor="196, 181, 253"
        fourthColor="129, 140, 248"
        fifthColor="168, 85, 247"
        pointerColor="124, 58, 237"
        size="88%"
        blendingValue="hard-light"
        className="pointer-events-none z-0"
        interactive
      />

      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 text-violet-700">
          <span className="text-2xl font-bold tracking-tight">OnMyWay</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-600">Already a member?</span>
          <Link
            to="/signin"
            className="rounded-full border border-violet-200 px-5 py-2.5 font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            Sign In
          </Link>
        </div>
      </div>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-10 px-8 pb-12 pt-4 lg:grid-cols-[1fr_1.2fr]">
        <section className="pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Welcome to the Family</p>
          <h1 className="mt-4 text-6xl font-black leading-[0.95] text-slate-800">
            Join our
            <br />
            <span className="text-black-600">Caring</span>
            <br />
            <span className="text-black-600">Community</span>
          </h1>
          <p className="mt-6 max-w-md text-2xl">
            Experience a new standard of mobility designed with dignity, safety, and comfort at its heart.
          </p>
        </section>

        <section className="rounded-[2rem] border border-[#e9e2f0] bg-[#f2edf7] p-8 shadow-[0_18px_45px_-35px_rgba(76,49,134,0.5)]">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {successMessage && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</p>}
            {errorMessage && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</p>}

            <div>
              <h2 className="mb-5 flex items-center gap-3 text-3xl font-black text-slate-800">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">1</span>
                Personal Identity
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Full Name</span>
                  <input value={formValues.fullName} onChange={handleChange('fullName')} required className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="e.g. Itsaree tamchareon" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Date of Birth</span>
                  <input value={formValues.dateOfBirth} onChange={handleChange('dateOfBirth')} required type="date" className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</span>
                  <input value={formValues.phoneNumber} onChange={handleChange('phoneNumber')} required className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="065-999157" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Email Address</span>
                  <input value={formValues.email} onChange={handleChange('email')} required type="email" className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="seaman@example.com" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                  <input value={formValues.password} onChange={handleChange('password')} required type="password" className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="At least 6 characters" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Confirm Password</span>
                  <input value={formValues.confirmPassword} onChange={handleChange('confirmPassword')} required type="password" className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="Re-enter password" />
                </label>
              </div>
            </div>

            <div>
              <h2 className="mb-5 flex items-center gap-3 text-3xl font-black text-slate-800">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">2</span>
                Residential Details
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Street Address</span>
                  <input value={formValues.streetAddress} onChange={handleChange('streetAddress')} required className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="123 Serenity Lane" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Apartment / Suite</span>
                  <input value={formValues.apartment} onChange={handleChange('apartment')} className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="Apt 4B (Optional)" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">City</span>
                  <input value={formValues.city} onChange={handleChange('city')} required className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="บางพลี" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">State / Province (จังหวัด)</span>
                  <select value={formValues.province} onChange={handleChange('province')} className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base text-slate-700 focus:outline-none">
                    <option>กรุงเทพมหานคร</option>
                    <option>เชียงใหม่</option>
                    <option>ขอนแก่น</option>
                    <option>ชลบุรี</option>
                    <option>ภูเก็ต</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Postal Code</span>
                  <input value={formValues.postalCode} onChange={handleChange('postalCode')} required className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="999157" />
                </label>
              </div>
            </div>

            <div className="rounded-3xl bg-[#e8dff3] p-5 text-sm text-slate-600">
              <label className="flex items-start gap-3">
                <input checked={formValues.acceptTerms} onChange={handleChange('acceptTerms')} type="checkbox" className="mt-0.5 h-4 w-4 rounded border-violet-300" />
                <span>
                  I agree to the <span className="font-semibold text-violet-700">Terms of Service</span> and{' '}
                  <span className="font-semibold text-violet-700">Privacy Policy</span>. I understand that my data is protected under HIPAA-grade security standards.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-violet-500 py-4 text-2xl font-bold text-white shadow-[0_14px_30px_-20px_rgba(91,57,168,0.8)] transition hover:bg-violet-600"
            >
              Create Account →
            </button>

            <p className="text-center text-sm text-slate-600">
              Need help? <span className="font-semibold text-violet-700">Call our support center</span> at 9999
            </p>
          </form>
        </section>
      </main>


    </div>
  )
}

export default SignUpPage
