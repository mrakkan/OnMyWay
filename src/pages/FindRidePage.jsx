import { memo, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import drivers from '../data/drivers.json'

const PRICE_MIN = 0
const PRICE_MAX = 50

const AVAILABILITY_LEVEL = {
  today: 1,
  tomorrow: 2,
  week: 3,
}

const DRIVER_AVAILABILITY_BY_ID = {
  'margaret-wilson': 'today',
  'robert-chen': 'tomorrow',
  'elena-rodriguez': 'today',
  'arthur-sterling': 'week',
}

const DriverCard = memo(function DriverCard({ driver }) {
  return (
    <article className="rounded-[2rem] border border-[#e7e0ef] bg-[#ede8f3] p-5 shadow-[0_10px_24px_-18px_rgba(70,52,115,0.55)]">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${driver.avatarTone} text-2xl font-bold text-slate-700`}
        >
          {driver.avatarLabel}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-2xl font-black leading-tight text-slate-800 sm:text-3xl">{driver.name}</h3>
            <div className="text-right">
              <p className="text-3xl font-black leading-none text-violet-600 sm:text-4xl">${driver.price}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">per hour</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
            <span className="text-violet-600">★★★★★</span>
            <span className="font-semibold">{driver.rating}</span>
            <span className="font-semibold">({driver.rides} rides)</span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600">{driver.bio}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link
          to={`/driver/${driver.id}`}
          className="rounded-full bg-violet-600 px-6 py-3 text-lg font-bold text-white transition hover:bg-violet-700"
        >
          Select Driver
        </Link>
      </div>
    </article>
  )
})

const DriverResults = memo(function DriverResults({ driverList }) {
  return (
    <div className="mt-6">
      <AnimatePresence mode="wait">
        {!driverList.length ? (
          <motion.div
            key="empty-drivers"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="rounded-[2rem] border border-dashed border-[#d6cce2] bg-[#f3eef8] p-8 text-center"
          >
            <p className="text-lg font-bold text-slate-700">No drivers matched your filters</p>
            <p className="mt-2 text-sm text-slate-600">Try widening your price range or lowering the minimum rating.</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid gap-5 xl:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {driverList.map((driver) => (
                <motion.div
                  key={driver.id}
                  layout
                  initial={{ opacity: 0, y: 14, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.985 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <DriverCard driver={driver} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

function FindRidePage() {
  const [priceRange, setPriceRange] = useState({ min: 10, max: 25 })
  const [minRating, setMinRating] = useState(4)
  const [availability, setAvailability] = useState('week')
  const [sortBy, setSortBy] = useState('top-rated')

  const filteredDrivers = useMemo(() => {
    const nextDrivers = drivers.filter((driver) => {
      if (driver.price < priceRange.min || driver.price > priceRange.max) {
        return false
      }

      if (driver.rating < minRating) {
        return false
      }

      const driverAvailability = DRIVER_AVAILABILITY_BY_ID[driver.id] ?? 'week'
      if (AVAILABILITY_LEVEL[driverAvailability] > AVAILABILITY_LEVEL[availability]) {
        return false
      }

      return true
    })

    const sortedDrivers = [...nextDrivers]
    if (sortBy === 'price-low') {
      sortedDrivers.sort((left, right) => left.price - right.price)
    } else if (sortBy === 'price-high') {
      sortedDrivers.sort((left, right) => right.price - left.price)
    } else if (sortBy === 'most-rides') {
      sortedDrivers.sort((left, right) => right.rides - left.rides)
    } else {
      sortedDrivers.sort((left, right) => {
        if (right.rating === left.rating) {
          return right.rides - left.rides
        }

        return right.rating - left.rating
      })
    }

    return sortedDrivers
  }, [availability, minRating, priceRange.max, priceRange.min, sortBy])

  const handleMinPriceChange = (event) => {
    const nextMin = Number(event.target.value)
    setPriceRange((currentRange) => ({
      ...currentRange,
      min: Math.min(nextMin, currentRange.max),
    }))
  }

  const handleMaxPriceChange = (event) => {
    const nextMax = Number(event.target.value)
    setPriceRange((currentRange) => ({
      ...currentRange,
      max: Math.max(nextMax, currentRange.min),
    }))
  }

  const handleResetFilters = () => {
    setPriceRange({ min: 10, max: 25 })
    setMinRating(4)
    setAvailability('week')
    setSortBy('top-rated')
  }

  return (
    <div className="text-slate-800">
      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-7 lg:grid-cols-[17rem_1fr] lg:px-8">
        <aside className="h-fit rounded-[2rem] border border-[#e6dfef] bg-[#ece7f1] p-5 shadow-[0_10px_24px_-18px_rgba(70,52,115,0.55)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-violet-700">Filter Options</h2>
            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded-full bg-[#dfd7e8] px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-slate-700 transition hover:bg-[#d7cde4]"
            >
              Reset
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Price Range (Per Hour)</p>
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={priceRange.min}
                onChange={handleMinPriceChange}
                className="mt-3 w-full accent-violet-600"
              />
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={priceRange.max}
                onChange={handleMaxPriceChange}
                className="mt-2 w-full accent-violet-600"
              />
              <div className="mt-2 flex justify-between text-sm font-semibold text-slate-700">
                <span>${priceRange.min}</span>
                <span>${priceRange.max}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Minimum Rating</p>
              <div className="mt-4 space-y-3 text-slate-700">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="radio"
                    name="rating"
                    className="h-4 w-4 accent-violet-600"
                    checked={minRating === 5}
                    onChange={() => setMinRating(5)}
                  />
                  <span>5 ★</span>
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="radio"
                    name="rating"
                    className="h-4 w-4 accent-violet-600"
                    checked={minRating === 4}
                    onChange={() => setMinRating(4)}
                  />
                  <span>4+ ★</span>
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="radio"
                    name="rating"
                    className="h-4 w-4 accent-violet-600"
                    checked={minRating === 3}
                    onChange={() => setMinRating(3)}
                  />
                  <span>3+ ★</span>
                </label>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Availability</p>
              <select
                value={availability}
                onChange={(event) => setAvailability(event.target.value)}
                className="mt-3 w-full rounded-full bg-[#e5dfeb] px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none"
              >
                <option value="today">Available Today</option>
                <option value="tomorrow">Available Tomorrow</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>
        </aside>

        <section>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="max-w-3xl text-4xl font-black leading-[0.98] text-slate-800 sm:text-5xl lg:text-6xl lg:leading-[0.94]">
                Find a Friendly Driver
                <br />
                for Your Next
                <br />
                Appointment
              </h1>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={filteredDrivers.length}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="mt-3 text-base font-medium text-slate-600 sm:text-xl lg:text-3xl"
                >
                  {filteredDrivers.length} verified volunteer drivers available near you
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="rounded-full bg-[#e6e0ec] px-5 py-3 text-sm font-bold text-slate-600">
              <label className="flex items-center gap-2">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="rounded-full bg-transparent text-violet-700 focus:outline-none"
                >
                  <option value="top-rated">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="most-rides">Most Rides</option>
                </select>
              </label>
            </div>
          </div>

          <DriverResults driverList={filteredDrivers} />
        </section>
      </main>
    </div>
  )
}

export default FindRidePage
