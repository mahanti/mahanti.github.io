import Link from "next/link"
import { useRouter } from "next/router"

const Layout = ({ children }) => {
  const router = useRouter()
  
  // Show full header on home page, minimal on others
  const isHomePage = router.pathname === '/'
  
  return (
    <div className="grid page-content">
      {/* Static Header with Navigation */}
      <header id="nav" className="static-header">
        <div className="col-8 row">
          <div className="header-top">
            <Link href="/" className="logo-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="site-logo">
                <rect width="24" height="24" rx="6" fill="var(--surface-10)" opacity="0.4"/>
                <g opacity="0.6">
                  <path d="M18.1304 14.798L14.8701 9.34082M12.2914 14.798L9.03112 9.34082L5.86968 14.798" stroke="var(--text-base)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg>
            </Link>
          </div>
          <div className="header-home-content">
            <Link href="/" id="name" className="title">Arjun Mahanti</Link>
            <span className="subtitle hideable">A multidisciplinary designer building delightful solutions to complex problems.</span>
            <nav className="header-nav" style={{ marginTop: '16px' }}>
              <Link href="/work" className={`button-link ${router.pathname.startsWith('/work') ? 'active' : ''}`}>Work</Link>
              <Link href="/products" className={`button-link ${router.pathname.startsWith('/products') ? 'active' : ''}`}>Products</Link>
              <Link href="/photos" className={`button-link ${router.pathname.startsWith('/photos') ? 'active' : ''}`}>Photos</Link>
              <Link href="/about" className={`button-link ${router.pathname === '/about' ? 'active' : ''}`}>About</Link>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Page Content */}
      <main className="page-content-area">
        {children}
      </main>
      
      {/* Footer */}
      <footer>
        <div className="col-8 row">
          <span className="subtitle">© 2024 Arjun Mahanti</span>
        </div>
      </footer>
    </div>
  )
}

export default Layout
