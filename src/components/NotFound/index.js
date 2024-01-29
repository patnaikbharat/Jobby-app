import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      className="jobs-failure"
      alt="not found"
    />
    <h1 className="jobs-failure-heading">Page Not Found</h1>
    <p className="jobs-failure-paragraph">
      We are sorry, the page you requested could not be found
    </p>
  </div>
)

export default NotFound
