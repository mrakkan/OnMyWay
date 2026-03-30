function AppFooter() {
  return (
    <footer className="border-t border-[#ddd6e7] bg-[#f3eff7] px-5 py-5 text-xs text-slate-500 lg:px-8">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xl font-black text-violet-700">OnMyWay</p>
          <p className="mt-1">© 2026 OnMyWay. Your safety is our sanctuary.</p>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <button type="button" className="hover:text-violet-700">Privacy Policy</button>
          <button type="button" className="hover:text-violet-700">Terms of Service</button>
          <button type="button" className="hover:text-violet-700">Accessibility Statement</button>
          <button type="button" className="hover:text-violet-700">Contact Us</button>
        </div>
      </div>
    </footer>
  )
}

export default AppFooter
