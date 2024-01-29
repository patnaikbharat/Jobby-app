import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class JobDetails extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    jobData: [],
    similarJobsData: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  convertPascalToCamel = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
    title: data.title,
  })

  convertPascalToCamelSimilarJobs = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedJobData = [fetchedData.job_details].map(eachItem =>
        this.convertPascalToCamel(eachItem),
      )
      const updatedSimilarJobsData = fetchedData.similar_jobs.map(eachJob =>
        this.convertPascalToCamelSimilarJobs(eachJob),
      )
      this.setState({
        apiStatus: apiStatusConstant.success,
        jobData: updatedJobData,
        similarJobsData: updatedSimilarJobsData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderSuccess = () => {
    const {jobData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobData[0]

    return (
      <>
        <div className="success-job-details-container">
          <div className="jobs-list-first-container">
            <img
              src={companyLogoUrl}
              className="company-logo"
              alt="job details company logo"
            />
            <div>
              <h1 className="title">{title}</h1>
              <div className="rating-container">
                <FaStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="jobs-list-second-container">
            <div className="location-container">
              <IoLocationSharp className="react-icon" />
              <p className="jobs-second-list-text">{location}</p>
              <BsBriefcaseFill className="react-icon" />
              <p className="jobs-second-list-text">{employmentType}</p>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="description-container">
            <h1 className="card-header-text">Description</h1>
            <a href={companyWebsiteUrl} className="anchor-tag">
              Visit <FaExternalLinkAlt className="visit-icon" />
            </a>
          </div>
          <p className="description">{jobDescription}</p>
          <h1 className="card-header-text margin">Skills</h1>
          <ul className="skills-container">
            {skills.map(eachSkill => (
              <li className="skill-container" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  className="skill-image"
                  alt={eachSkill.name}
                />
                <p className="skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="card-header-text margin">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="description">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              className="life-at-company-image"
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="card-header-text margin alignment">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobsData.map(eachJob => (
            <li className="similar-job-container" key={eachJob.id}>
              <div className="jobs-list-first-container">
                <img
                  src={eachJob.companyLogoUrl}
                  className="company-logo"
                  alt="similar job company logo"
                />
                <div>
                  <h1 className="title">{eachJob.title}</h1>
                  <div className="rating-container">
                    <FaStar className="star-icon" />
                    <p className="rating">{eachJob.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="description-text">Description</h1>
              <p className="description">{eachJob.jobDescription}</p>
              <div className="location-container">
                <IoLocationSharp className="react-icon" />
                <p className="jobs-second-list-text">{location}</p>
                <BsBriefcaseFill className="react-icon" />
                <p className="jobs-second-list-text">{employmentType}</p>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  onClickJobdetailsRetry = () => {
    this.getJobDetails()
  }

  renderFailure = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="jobs-failure"
        alt="failure view"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-paragraph">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.onClickJobdetailsRetry}
      >
        Retry
      </button>
    </>
  )

  renderSwitchCase = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderSuccess()
      case apiStatusConstant.inProgress:
        return this.renderLoader()
      case apiStatusConstant.failure:
        return this.renderFailure()
      default:
        return <p>A</p>
    }
  }

  render() {
    console.log('a')
    return (
      <>
        <Header />
        <div className="job-detail-container">{this.renderSwitchCase()}</div>
      </>
    )
  }
}

export default JobDetails
