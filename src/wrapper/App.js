import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import ReduxToastr from 'react-redux-toastr';

// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import React Bootstrap Table
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
// Import React Confirm Alert Style
import 'react-confirm-alert/src/react-confirm-alert.css';
// Import React Redux Toastr Style
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
// Import React Datepicker Style
import 'react-datepicker/dist/react-datepicker.css';
// Import React Slider Style
import 'rc-slider/assets/index.css';
// Import Main styles for this application
import '../global/scss/style.css';

// Containers
import { DefaultLayout } from '../components/containers';
// Pages
import {
  Login, Page404, Page500, Register,
} from '../components/views/Pages';

import GuestRoute from '../route-helpers/GuestRoute';
import PrivateRoute from '../route-helpers/PrivateRoute';

const App = () => (
  <Fragment>
    <Switch>
      <GuestRoute exact path="/login" name="Login Page" component={Login} />
      <GuestRoute exact path="/register" name="Register Page" component={Register} />
      <Route exact path="/404" name="Page 404" component={Page404} />
      <Route exact path="/500" name="Page 500" component={Page500} />
      <PrivateRoute path="/" name="Home" component={DefaultLayout} />
    </Switch>
    <ReduxToastr
      timeOut={3000}
      newestOnTop={false}
      preventDuplicates
      position="top-right"
      transitionIn="bounceIn"
      transitionOut="bounceOut"
      progressBar
    />
  </Fragment>
);

export default App;
