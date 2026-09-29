import { Route, Routes, Link, NavLink } from 'react-router-dom'
import ScrollToTop from './utilities/ScrollToTop'
import Home from './templates/Home'
import Posts from './templates/Posts'
import Post from './templates/Post'

function App() {

  return (
    <>
      <ScrollToTop />
      <header id="masthead" className="site-header">
        <div className="site-branding">
          <p className="site-title">Mindset Headless</p>
        </div>
        <nav className="site-navigation">
          <ul>
            <li><NavLink to='/' end>Home</NavLink></li>
            <li><NavLink to='/blog'>Blog</NavLink></li>
          </ul>
        </nav>
      </header>
      <main id="main">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/blog' element={<Posts />} />
          <Route path='/blog/:slug' element={<Post />} />
        </Routes>
      </main>
      <footer>
        <nav className="site-navigation">
          <ul>
            <li><Link to='/'>Home</Link></li>
          </ul>
        </nav>
        <p className="copyright">Created by <a href="https://wp.bcitwebdeveloper.ca/" target="_blank" rel="noopener noreferrer">FWD</a>.</p>
      </footer>
    </>
  )
}

export default App
