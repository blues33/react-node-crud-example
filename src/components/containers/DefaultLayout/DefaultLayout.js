import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
import RoleRoute from '../../../route-helpers/RoleRoute';

// sidebar nav config
import getNavigationItems from '../../../_nav';
// routes config
import routes from '../../../routes';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';
import { logout } from '../../../actions/user';

class DefaultLayout extends Component {
  render() {
    const { user } = this.props;
    const navigation = getNavigationItems(user.role);
    return (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader logout={this.props.logout} />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarNav navConfig={navigation} {...this.props} />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <Container fluid>
              <Switch>
                {routes.map((route, idx) => {
                  return route.component ? (
                    <RoleRoute
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      roles={route.roles}
                      component={route.component}
                    />
                  ) : null;
                })}
                <Redirect from="/" to="/restaurants" />
              </Switch>
            </Container>
          </main>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

export default connect(
  ({ authentication, users }) => ({
    ...authentication,
  }),
  dispatch => ({
    logout: () => dispatch(logout()),
  }),
)(DefaultLayout);
