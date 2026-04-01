const USERS_KEY = 'onmyway:mock-auth-users'
const CURRENT_USER_KEY = 'onmyway:mock-auth-current-user'
const PROFILE_UPDATED_EVENT = 'onmyway:profile-updated'

function canUseStorage() {
  return typeof window !== 'undefined' && window.sessionStorage
}

function readUsers() {
  if (!canUseStorage()) {
    return []
  }

  try {
    const rawValue = window.sessionStorage.getItem(USERS_KEY)

    if (!rawValue) {
      return []
    }

    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUsers(users) {
  if (!canUseStorage()) {
    return
  }

  window.sessionStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function notifyProfileUpdated() {
  if (!canUseStorage()) {
    return
  }

  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT))
}

export function registerMockUser(payload) {
  const users = readUsers()
  const normalizedEmail = normalizeEmail(payload.email)

  if (!normalizedEmail) {
    throw new Error('Please provide a valid email address.')
  }

  const existingUser = users.find((user) => user.email === normalizedEmail)

  if (existingUser) {
    throw new Error('This email is already registered. Please sign in instead.')
  }

  const nextUser = {
    id: `user-${Date.now()}`,
    fullName: payload.fullName?.trim() || '',
    phoneNumber: payload.phoneNumber?.trim() || '',
    dateOfBirth: payload.dateOfBirth || '',
    streetAddress: payload.streetAddress?.trim() || '',
    apartment: payload.apartment?.trim() || '',
    city: payload.city?.trim() || '',
    province: payload.province || '',
    postalCode: payload.postalCode?.trim() || '',
    avatarDataUrl: payload.avatarDataUrl || '',
    email: normalizedEmail,
    password: payload.password,
    createdAt: Date.now(),
  }

  writeUsers([nextUser, ...users])
  return nextUser
}

export function loginMockUser(email, password) {
  const users = readUsers()
  const normalizedEmail = normalizeEmail(email)

  const foundUser = users.find((user) => user.email === normalizedEmail)

  if (!foundUser) {
    throw new Error('No account found for this email. Please sign up first.')
  }

  if (foundUser.password !== password) {
    throw new Error('Incorrect password. Please try again.')
  }

  const safeUser = {
    id: foundUser.id,
    fullName: foundUser.fullName,
    email: foundUser.email,
  }

  if (canUseStorage()) {
    window.sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser))
  }

  return safeUser
}

export function getCurrentMockUser() {
  if (!canUseStorage()) {
    return null
  }

  try {
    const rawValue = window.sessionStorage.getItem(CURRENT_USER_KEY)
    return rawValue ? JSON.parse(rawValue) : null
  } catch {
    return null
  }
}

function toSafeProfile(user) {
  return {
    id: user.id,
    fullName: user.fullName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    dateOfBirth: user.dateOfBirth || '',
    streetAddress: user.streetAddress || '',
    apartment: user.apartment || '',
    city: user.city || '',
    province: user.province || '',
    postalCode: user.postalCode || '',
    bio: user.bio || '',
    avatarDataUrl: user.avatarDataUrl || '',
  }
}

export function getCurrentMockUserProfile() {
  const currentUser = getCurrentMockUser()

  if (!currentUser) {
    return null
  }

  const users = readUsers()
  const foundUser = users.find((user) => user.id === currentUser.id || user.email === currentUser.email)

  if (!foundUser) {
    return {
      id: currentUser.id,
      fullName: currentUser.fullName || '',
      email: currentUser.email || '',
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
  }

  return toSafeProfile(foundUser)
}

export function updateCurrentMockUserProfile(updates) {
  const currentUser = getCurrentMockUser()

  if (!currentUser) {
    throw new Error('You need to sign in before editing your profile.')
  }

  const users = readUsers()
  let updatedProfile = null

  const nextUsers = users.map((user) => {
    if (user.id !== currentUser.id && user.email !== currentUser.email) {
      return user
    }

    const nextUser = {
      ...user,
      fullName: updates.fullName?.trim() || user.fullName || '',
      phoneNumber: updates.phoneNumber?.trim() || '',
      dateOfBirth: updates.dateOfBirth || '',
      streetAddress: updates.streetAddress?.trim() || '',
      apartment: updates.apartment?.trim() || '',
      city: updates.city?.trim() || '',
      province: updates.province || '',
      postalCode: updates.postalCode?.trim() || '',
      bio: updates.bio?.trim() || '',
      avatarDataUrl: typeof updates.avatarDataUrl === 'string' ? updates.avatarDataUrl : user.avatarDataUrl || '',
      updatedAt: Date.now(),
    }

    updatedProfile = toSafeProfile(nextUser)
    return nextUser
  })

  if (!updatedProfile) {
    throw new Error('Unable to locate your profile. Please sign in again.')
  }

  writeUsers(nextUsers)

  const nextCurrentUser = {
    id: updatedProfile.id,
    fullName: updatedProfile.fullName,
    email: updatedProfile.email,
  }

  if (canUseStorage()) {
    window.sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextCurrentUser))
  }

  notifyProfileUpdated()

  return updatedProfile
}
