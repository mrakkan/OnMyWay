const USERS_KEY = 'onmyway:mock-auth-users'
const CURRENT_USER_KEY = 'onmyway:mock-auth-current-user'

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
