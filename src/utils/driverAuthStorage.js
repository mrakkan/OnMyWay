const DRIVER_USERS_KEY = 'users'
const DRIVER_CURRENT_USER_KEY = 'currentUser'

export const APPROVED_DRIVER_MOCK_ACCOUNTS = [
  {
    fullName: 'Niran Chaiwat',
    dob: '1990-06-14',
    phone: '0891234567',
    nationalId: '1103701234567',
    email: 'driver.approved@onmyway.dev',
    password: 'Driver@1234',
    careBackground: ['On My Way Training', 'CPR Certified'],
    otherCertifications: 'Basic elder-care certificate',
    vehicleModel: 'Toyota Veloz',
    vehicleYear: '2022',
    driverApprovalStatus: 'approved',
  },
]

function readDrivers() {
  try {
    const rawValue = window.localStorage.getItem(DRIVER_USERS_KEY)
    const parsed = rawValue ? JSON.parse(rawValue) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeDrivers(drivers) {
  window.localStorage.setItem(DRIVER_USERS_KEY, JSON.stringify(drivers))
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

export function seedApprovedDriverMockAccounts() {
  const drivers = readDrivers()
  const mapByEmail = new Map()

  drivers.forEach((driver) => {
    const normalizedEmail = normalizeEmail(driver?.email)
    if (!normalizedEmail) return
    mapByEmail.set(normalizedEmail, { ...driver, email: normalizedEmail })
  })

  APPROVED_DRIVER_MOCK_ACCOUNTS.forEach((mockAccount) => {
    const normalizedEmail = normalizeEmail(mockAccount.email)
    mapByEmail.set(normalizedEmail, {
      ...mockAccount,
      email: normalizedEmail,
      driverApprovalStatus: 'approved',
    })
  })

  writeDrivers(Array.from(mapByEmail.values()))
}

export function loginDriverUser(email, password) {
  seedApprovedDriverMockAccounts()

  const normalizedEmail = normalizeEmail(email)
  const drivers = readDrivers()
  const foundDriver = drivers.find((driver) => normalizeEmail(driver.email) === normalizedEmail)

  if (!foundDriver) {
    throw new Error('Email not found')
  }

  if (foundDriver.password !== password) {
    throw new Error('Email or password is incorrect')
  }

  const safeDriver = {
    ...foundDriver,
    email: normalizedEmail,
  }

  window.localStorage.setItem(DRIVER_CURRENT_USER_KEY, JSON.stringify(safeDriver))
  return safeDriver
}
