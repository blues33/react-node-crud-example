const getNavigationItems = (role) => {
  let navItems = [{
    name: 'Restaurants',
    url: '/restaurants',
    icon: 'icon-grid'
  }];
  if (role === 'admin') {
    navItems.push({
      name: 'Users',
      url: '/users',
      icon: 'icon-people',
    });
  } else if (role === 'owner') {
    navItems.push({
      name: 'Pending Reviews',
      url: '/reviews-pending',
      icon: 'icon-menu',
    });
  }
  navItems.push({
    name: 'Profile',
    url: '/profile',
    icon: 'cui-user',
  });
  navItems.push({
    name: 'Password',
    url: '/password',
    icon: 'cui-cog',
  });

  return {
    items: navItems,
  };
};

export default getNavigationItems;
