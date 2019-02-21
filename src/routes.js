import React from 'react';
import Loadable from 'react-loadable';

import DefaultLayout from './components/containers/DefaultLayout';

function Loading() {
  return <div>Loading...</div>;
}

const Restaurants = Loadable({
  loader: () => import('./components/views/Restaurant/List'),
  loading: Loading,
});

const Restaurant = Loadable({
  loader: () => import('./components/views/Restaurant/Restaurant'),
  loading: Loading,
});

const RestaurantForm = Loadable({
  loader: () => import('./components/views/Restaurant/RestaurantForm'),
  loading: Loading,
});

const EditRestaurantForm = Loadable({
  loader: () => import('./components/views/Restaurant/EditRestaurant'),
  loading: Loading,
});

const Users = Loadable({
  loader: () => import('./components/views/Users/Users'),
  loading: Loading,
});

const UserForm = Loadable({
  loader: () => import('./components/views/Users/UserForm'),
  loading: Loading,
});

const EditUserForm = Loadable({
  loader: () => import('./components/views/Users/EditUserForm'),
  loading: Loading,
});

const PendingReviews = Loadable({
  loader: () => import('./components/views/Reviews/List'),
  loading: Loading,
});

const Profile = Loadable({
  loader: () => import('./components/views/Users/Profile'),
  loading: Loading,
});

const Password = Loadable({
  loader: () => import('./components/views/Users/Password'),
  loading: Loading,
});

const routes = [
  { path: '/', exact: true, name: '', component: DefaultLayout },
  { path: '/restaurants', name: 'Restaurants', component: Restaurants },
  { path: '/restaurant/detail/:id', name: 'Restaurant', component: Restaurant },
  { path: '/restaurant/add', name: 'Add Restaurant', component: RestaurantForm, roles: ['admin', 'owner'] },
  { path: '/restaurant/edit/:id', name: 'Edit Restaurant', component: EditRestaurantForm, roles: ['admin', 'owner'] },
  { path: '/users', name: 'Users', component: Users, roles: ['admin'] },
  { path: '/user/new', name: 'Add User', component: UserForm, roles: ['admin'] },
  { path: '/user/edit/:id', name: 'Edit User', component: EditUserForm, roles: ['admin'] },
  { path: '/reviews-pending', name: 'Pending Reviews', component: PendingReviews, roles: ['owner'] },
  { path: '/profile', name: 'Edit User', component: Profile },
  { path: '/password', name: 'Change Password', component: Password },
];

export default routes;
