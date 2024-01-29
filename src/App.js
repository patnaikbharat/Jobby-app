import {Switch, Route, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobDetails from './components/JobDetails'
import PreventComponent from './components/PreventComponent'
import NotFound from './components/NotFound'
import './App.css'

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <PreventComponent exact path="/" component={Home} />
    <PreventComponent exact path="/jobs" component={Jobs} />
    <PreventComponent exact path="/jobs/:id" component={JobDetails} />
    <Route exact path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
