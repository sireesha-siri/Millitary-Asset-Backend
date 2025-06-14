require('./setup/createUsersTable');
require('./setup/createRolesTable');
require('./setup/createUserRolesTable');
require('./setup/createDashboardtables')

setTimeout(() => {
  require('./seed/seedRoles');
  require('./seed/seedUsers');
  setTimeout(() => {
    require('./seed/seedUserRoles');
    require('./seed/seedDashboardtables');
  }, 500); // Wait a bit to ensure users/roles are inserted
}, 500);
