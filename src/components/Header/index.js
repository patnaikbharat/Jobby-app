import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import {IoMdHome} from 'react-icons/io'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="header-container">
      <Link to="/" className="link-item">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="header-web-logo"
          alt="website logo"
        />
      </Link>
      <ul className="link-container">
        <Link to="/" className="link-item">
          <li className="header-list-item">Home</li>
        </Link>
        <Link to="/jobs" className="link-item">
          <li className="header-list-item">Jobs</li>
        </Link>
        <li>
          <button
            className="logout-button"
            type="button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
      <div className="icon-container">
        <Link to="/" className="link-item">
          <IoMdHome className="react-icon" />
        </Link>
        <Link to="/jobs" className="link-item">
          <BsBriefcaseFill className="react-icon" />
        </Link>
        <FiLogOut className="react-icon" onClick={onClickLogout} />
      </div>
    </nav>
  )
}

export default withRouter(Header)
