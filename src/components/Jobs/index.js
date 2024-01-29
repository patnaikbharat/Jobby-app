/* eslint-disable jsx-a11y/control-has-associated-label */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {FaSearch, FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const constantStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileStatus: constantStatus.initial,
    profileData: {},
    jobsListStatus: constantStatus.initial,
    jobsList: [],
    employmentType: [],
    salaryRange: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobsList()
  }

  ProfileConvertPascalToCamel = data => ({
    name: data.name,
    profileImageUrl: data.profile_image_url,
    shortBio: data.short_bio,
  })

  onClickProfileRetry = () => {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({profileStatus: constantStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    if (response.ok) {
      const updatedData = this.ProfileConvertPascalToCamel(
        fetchedData.profile_details,
      )
      this.setState({
        profileData: updatedData,
        profileStatus: constantStatus.success,
      })
    } else {
      this.setState({profileStatus: constantStatus.failure})
    }
  }

  renderProfileSuccess = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-success-container">
        <img src={profileImageUrl} className="profile-image" alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderProfileFailure = () => (
    <button
      className="retry-button"
      type="button"
      onClick={this.onClickProfileRetry}
    >
      Retry
    </button>
  )

  renderProfileSwitchCase = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case constantStatus.success:
        return this.renderProfileSuccess()
      case constantStatus.inProgress:
        return this.renderLoader()
      case constantStatus.failure:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  onClickCheckBox = event => {
    const {employmentType} = this.state
    if (employmentType.includes(event.target.id)) {
      const updatedList = employmentType.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({employmentType: updatedList}, this.getJobsList)
    } else {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, event.target.id],
        }),
        this.getJobsList,
      )
    }
  }

  onClickRadio = event => {
    this.setState({salaryRange: event.target.id}, this.getJobsList)
  }

  renderFilteredList = () => (
    <div>
      <hr />
      <h1 className="filter-header">Type of Employment</h1>
      <ul className="filter-list-container">
        {employmentTypesList.map(eachType => (
          <li className="employment-list-item" key={eachType.employmentTypeId}>
            <input
              type="checkbox"
              className="check-box"
              id={eachType.employmentTypeId}
              onChange={this.onClickCheckBox}
            />
            <label className="label-text" htmlFor={eachType.employmentTypeId}>
              {eachType.label}
            </label>
          </li>
        ))}
      </ul>
      <hr />
      <h1 className="filter-header">Salary Range</h1>
      <ul className="filter-list-container">
        {salaryRangesList.map(eachRange => (
          <li className="employment-list-item" key={eachRange.salaryRangeId}>
            <input
              type="radio"
              className="radio"
              name="option"
              id={eachRange.salaryRangeId}
              onChange={this.onClickRadio}
            />
            <label className="label-text" htmlFor={eachRange.salaryRangeId}>
              {eachRange.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  JobsConvertPascalToCamel = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  onClickJobsRetry = () => {
    this.getJobsList()
  }

  getJobsList = async () => {
    const {employmentType, salaryRange, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    this.setState({jobsListStatus: constantStatus.inProgress})
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    if (response.ok) {
      const updatedData = fetchedData.jobs.map(eachJob =>
        this.JobsConvertPascalToCamel(eachJob),
      )
      this.setState({
        jobsListStatus: constantStatus.success,
        jobsList: updatedData,
      })
    } else {
      this.setState({jobsListStatus: constantStatus.failure})
    }
  }

  renderJobsSuccess = () => {
    const {jobsList} = this.state
    if (jobsList.length > 0) {
      return (
        <ul className="jobs-success-container">
          {jobsList.map(eachJob => (
            <Link to={`jobs/${eachJob.id}`} className="link-item">
              <li className="jobs-list" key={eachJob.id}>
                <div className="jobs-list-first-container">
                  <img
                    src={eachJob.companyLogoUrl}
                    className="company-logo"
                    alt="company logo"
                  />
                  <div>
                    <h1 className="title">{eachJob.title}</h1>
                    <div className="rating-container">
                      <FaStar className="star-icon" />
                      <p className="rating">{eachJob.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="jobs-list-second-container">
                  <div className="location-container">
                    <IoLocationSharp className="react-icon" />
                    <p className="jobs-second-list-text">{eachJob.location}</p>
                    <BsBriefcaseFill className="react-icon" />
                    <p className="jobs-second-list-text">
                      {eachJob.employmentType}
                    </p>
                  </div>
                  <p className="package">{eachJob.packagePerAnnum}</p>
                </div>
                <hr />
                <h1 className="description-text">Description</h1>
                <p className="description">{eachJob.jobDescription}</p>
              </li>
            </Link>
          ))}
        </ul>
      )
    }
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="jobs-failure"
          alt="no jobs"
        />
        <h1 className="jobs-failure-heading">No Jobs Found</h1>
        <p className="jobs-failure-paragraph">
          We could not find any jobs. Try other filters
        </p>
      </div>
    )
  }

  renderJobsFailure = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="jobs-failure"
        alt="failure-view"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-paragraph">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.onClickJobsRetry}
      >
        Retry
      </button>
    </>
  )

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobsList()
  }

  onEnterSearch = event => {
    if (event.key === 'Enter') {
      this.getJobsList()
    }
  }

  renderJobsSwitchCase = () => {
    const {jobsListStatus} = this.state
    switch (jobsListStatus) {
      case constantStatus.success:
        return this.renderJobsSuccess()
      case constantStatus.inProgress:
        return this.renderLoader()
      case constantStatus.failure:
        return this.renderJobsFailure()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-left-container">
            <div className="profile-container">
              {this.renderProfileSwitchCase()}
            </div>
            {this.renderFilteredList()}
          </div>
          <div className="jobs-right-container">
            <div className="search-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearch}
              />
              <button
                className="search-icon-container"
                type="button"
                onClick={this.onClickSearch}
                data-testid="searchButton"
              >
                <FaSearch className="search-icon" />
              </button>
            </div>
            <div className="jobs-list-container">
              {this.renderJobsSwitchCase()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
