import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', isError: false}

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userInfo = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userInfo),
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()

    if (response.ok) {
      Cookies.set('jwt_token', fetchedData.jwt_token)
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({errorMsg: fetchedData.error_msg, isError: true})
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, errorMsg, isError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-bg-container">
        <div className="login-card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="login-web-logo"
            alt="website logo"
          />
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <label className="label-text" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              className="user-input"
              id="username"
              placeholder="USERNAME"
              value={username}
              onChange={this.onChangeUsername}
            />
            <label className="label-text" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              className="user-input"
              id="password"
              placeholder="PASSWORD"
              value={password}
              onChange={this.onChangePassword}
            />
            <button type="submit" className="login-button">
              Login
            </button>
            {isError && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
