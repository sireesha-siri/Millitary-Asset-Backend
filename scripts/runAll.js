require('./setup/createUsersTable');
require('./setup/createRolesTable');
require('./setup/createUserRolesTable');

setTimeout(() => {
  require('./seed/seedRoles');
  require('./seed/seedUsers');
  setTimeout(() => {
    require('./seed/seedUserRoles');
  }, 500); // Wait a bit to ensure users/roles are inserted
}, 500);
