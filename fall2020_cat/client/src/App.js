import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Admin from './components/admin/Admin';
import ProfileBar from './components/layout/ProfileBar';
import Assessment from "./components/assessment/Assessment";
import AddContent from "./components/AddContent/AddContent";
import ContactUs from "./components/contactus/ContactUs";
import TrainingVideos from './components/trainingvideos/TrainingVideos';
import TrainingVideoView from './components/trainingvideoview/TrainingVideoView';


import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Userdashboard from './components/user-dashboard/Userdashboard';
import PageNotFound from './components/PageNotFound404';
import HomeTestpage from './components/auth/HomeTestpage';
import PrivateScreen from './components/auth/PrivateScreen';
import PrivateRoute from './components/routing/PrivateRoute';
import Presentor from './components/presentor/Presentor';
import FinishedModule from './components/finishedmodule/FinishedModule';
import MyProfile from './components/myprofile/MyProfile';
import AdminUsers from './components/adminusers/AdminUsers';

//$*import {GlobalProvider} from './context/GlobalState';
import {AuthProvider} from './context/AuthProvider';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51Id8XzHvDUJI12673y4VfjLLdr8SXtTfH0jVhmojbBFpQIZzUomI2cyIX7mdoqE7l7wJEo0pw3jzDoecPt9gUpmS00AwtcFwrV");






const App = () => {
  return (

    <AuthProvider>
    
      <Router>
        <div className='main-grid-layout'>
          <ProfileBar />
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path='/traininginfo' component={TrainingVideos} />
            <Route exact path='/traininginfo/:trainingVideoId' component={TrainingVideoView} />

            <Route exact path="/contactus" component={ContactUs} />
            <Route exact path="/login" component={Login} /> 
            <Route exact path="/forgotpassword" component={ForgotPassword} />
            <Route exact path="/resetpassword/:resetToken" component={ResetPassword} />
            <Route exact path="/hometestpage" component={HomeTestpage} /> {/**This route is used for testing can be removed */}
            <Route exact path="/assessment" component={Assessment} />
            
            <PrivateRoute exact path="/privatescreen" component={PrivateScreen} redirLink='/' />
            <PrivateRoute exact path="/userdashboard" component={Userdashboard} />
            <PrivateRoute exact path="/presentor" component={Presentor} />
            <PrivateRoute exact path="/finishedmodule" component={FinishedModule} />
            <PrivateRoute exact path="/myprofile" component={MyProfile} />
            <PrivateRoute exact path="/adminusers" component={AdminUsers} />

            <Elements stripe={ stripePromise} >
              <Route exact path="/register" component={Register} />
            </Elements>

            {/**These route is were never implemented */}
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/addcontent" component={AddContent} />

            <Route component={PageNotFound}/>

          </Switch>
          
        </div>
      </Router>
    
    </AuthProvider>
  );
}

export default App;
