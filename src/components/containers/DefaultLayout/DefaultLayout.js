import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import RoleRoute from '../../../route-helpers/RoleRoute';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from "@coreui/react";
// sidebar nav config
import getNavigationItems from "../../../_nav";
// routes config
import routes from "../../../routes";
import DefaultAside from "./DefaultAside";
import DefaultFooter from "./DefaultFooter";
import DefaultHeader from "./DefaultHeader";
import { logout } from "../../../actions/user";

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
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={navigation} {...this.props} />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} />
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
          <AppAside fixed hidden>
            <DefaultAside />
          </AppAside>
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
