// ? //////////////////////////////// Some Qs Left ////////////////////////////////////////////////////

const { newEnforcer } = require('casbin'); //^ An authorization library that supports access control models like ACL, RBAC, ABAC in Node.js and Browser 
const path = require('path');
// const AuthHandler = require('./handler');
const casbin = require('casbin-sequelize-adapter');
// const response = require('../../components/ResponseHandler')

let auther = {};

module.exports = async () => {
  if (auther.Enforcer) {
    return auther;
  }
  auther = new Authz();
  const a = await casbin.SequelizeAdapter.newAdapter({
    dialect: 'postgres',
    username: 'root',
    password: 'root',
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: '5432',
    logging: false,
  });
  auther.Enforcer = await newEnforcer(
    path.join(__dirname, 'rbac_model.conf'),
    a
  );
  await auther.Enforcer.loadPolicy();
  return auther;
};

class Authz {
  Enforcer;

  async AddRole(user, roleName) {
    return await this.Enforcer.addRoleForUser(user.id + '', roleName); //^ Recieves userId and the role we want to assignn to him, then does the job of assigning the role to given user
  }

  async AddPermission(sub, obj, act) {
    return await this.Enforcer.addPermissionForUser(sub, obj, act);
  }

  async GetPermissions(sub) {
    console.log(sub);
    if (sub) return await this.Enforcer.getPermissionsForUser(sub);

    return await this.Enforcer.getAllActions(); //! /////////////////////////////////////////////////////////////////////////////////////
  }

  GetEnforcer() {
    return this.Enforcer;
  }

  async GetRoles(sub) {
    console.log(sub);
    if (sub) {
      let roles = await this.Enforcer.getRolesForUser(sub);
      console.log(roles);
      return roles;
    }

    return await this.Enforcer.getAllRoles(); //! /////////////////////////////////////////////////////////////////////////////////////
  }
}
/*
export async function swapncasbin() {
    // Initialize a TypeORM adapter and use it in a Node-Casbin enforcer:
    // The adapter can not automatically create database.
    // But the adapter will automatically and use the table named "casbin_rule".
    // I think ORM should not automatically create databases.
    let conn = await getConnection()
    const a = await TypeORMAdapter.newAdapter({
        type: conn.driver.options.type,
        host: conn.driver.options.host,
        port: conn.driver.options.port,
        username: conn.driver.options.username,
        password: conn.driver.options.password,
        database: conn.driver.options.database
    });


    const e = await newEnforcer(path.join(__dirname, 'rbac_model.conf'), a);

    // Load the policy from DB.
    await e.loadPolicy();

    // Check the permission.
    // await e.enforce('alice', 'data1', 'read');

    // Modify the policy.
    // await e.addPolicy(...);
    // await e.removePolicy(...);
    await e.addRoleForUser("ali", "admin")
    let aa = await e.enforce('ali', 'data1', 'read');
    // console.log(await e.add());
    console.log(await e.getAllObjects());
    console.log(await e.addPermissionForUser("admin", "data1", "read"));


    console.log(aa);


    // Save the policy back to DB.
    await e.savePolicy();
}*/
