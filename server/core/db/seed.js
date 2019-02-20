import User from '../../models/user';

const createAdminUser = async () => {
  const user = new User({
    email: process.env.ADMIN_EMAIL || 'adminuser@gmail.com',
    fullname: 'Admin User',
    password: process.env.ADMIN_PASSWORD || 'password',
    role: 'admin'
  });

  await user.save();
}

export default () => {
  User.findOne({ role: 'admin' })
  .then(user => {
    if (!user) {
      return createAdminUser();
    }
    return user;
  })
}