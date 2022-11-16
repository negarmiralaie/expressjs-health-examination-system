'use strict';
const rbac = require('../../components/auth/rbac');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let auther = await rbac();
    /*************************Seed Obj_Act */
    let perm = [
      ['dashboard', 'create'],
      ['dashboard', 'read'],
      ['dashboard', 'update'],
      ['dashboard', 'delete'],

      ['manage-users', 'create'],
      ['manage-users', 'read'],
      ['manage-users', 'update'],
      ['manage-users', 'delete'],

      ['factories', 'create'],
      ['factories', 'read'],
      ['factories', 'update'],
      ['factories', 'delete'],

      ['personnels', 'create'],
      ['personnels', 'read'],
      ['personnels', 'update'],
      ['personnels', 'delete'],

      ['my-personnels', 'create'],
      ['my-personnels', 'read'],
      ['my-personnels', 'update'],
      ['my-personnels', 'delete'],

      ['cases', 'create'],
      ['cases', 'read'],
      ['cases', 'update'],
      ['cases', 'delete'],

      ['my-cases', 'create'],
      ['my-cases', 'read'],
      ['my-cases', 'update'],
      ['my-cases', 'delete'],

      ['suggestions', 'create'],
      ['suggestions', 'read'],
      ['suggestions', 'update'],
      ['suggestions', 'delete'],

      ['reports', 'create'],
      ['reports', 'read'],
      ['reports', 'update'],
      ['reports', 'delete'],

      ['users-activity', 'create'],
      ['users-activity', 'read'],
      ['users-activity', 'update'],
      ['users-activity', 'delete'],

      ['settings', 'create'],
      ['settings', 'read'],
      ['settings', 'update'],
      ['settings', 'delete'],

      ['edit-profile', 'create'],
      ['edit-profile', 'read'],
      ['edit-profile', 'update'],
      ['edit-profile', 'delete'],
    ];

    perm.forEach(async (p) => {
      // console.log('p', p)
      await auther.AddPermission('ادمین', p[0], p[1]);
    });

    /**************************Seed CRUD */
    let acts = ['read', 'create', 'update', 'delete'];
    let permissions = [
      'dashboard',
      'manage-users',
      'factories',
      'personnels',
      'my-personnels',
      'cases',
      'my-cases',
      'suggestions',
      'reports',
      'users-activity',
      'settings',
      'edit-profile',
    ];

    permissions.forEach((e) => {
      // console.log('e', e)
      acts.forEach(async (a) => {
        // console.log('a', a)
        await auther.AddPermission('ادمین', e, a);
      });
    });

    await auther.AddRole({ id: '1' }, 'ادمین');


    //////////////////////////// * NOW ADD 'ثبات' ////////////////////////////////////////

    perm = [
      ['personnels', 'create'],
      ['personnels', 'read'],
      ['personnels', 'update'],
      ['personnels', 'delete'],

      ['my-personnels', 'create'],
      ['my-personnels', 'read'],
      ['my-personnels', 'update'],
      ['my-personnels', 'delete'],

      ['cases', 'create'],
      ['cases', 'read'],
      ['cases', 'update'],
      ['cases', 'delete'],

      ['my-cases', 'create'],
      ['my-cases', 'read'],
      ['my-cases', 'update'],
      ['my-cases', 'delete'],

      ['edit-profile', 'create'],
      ['edit-profile', 'read'],
      ['edit-profile', 'update'],
      ['edit-profile', 'delete'],
    ];

    perm.forEach(async (p) => {
      // console.log('p', p)
      await auther.AddPermission('ثبات', p[0], p[1]);
    });

    /**************************Seed CRUD */
    acts = ['read', 'create', 'update', 'delete'];
    permissions = [
      'personnels',
      'my-personnels',
      'cases',
      'my-cases',
      'edit-profile',
    ];

    permissions.forEach((e) => {
      // console.log('e', e)
      acts.forEach(async (a) => {
        // console.log('a', a)
        await auther.AddPermission('ثبات', e, a);
      });
    });

    await auther.AddRole({ id: '2' }, 'ثبات');


    //////////////////////////// * NOW ADD 'مدیرکل' ////////////////////////////////////////

    perm = [
      ['dashboard', 'create'],
      ['dashboard', 'read'],
      ['dashboard', 'update'],
      ['dashboard', 'delete'],

      ['manage-users', 'create'],
      ['manage-users', 'read'],
      ['manage-users', 'update'],
      ['manage-users', 'delete'],

      ['factories', 'create'],
      ['factories', 'read'],
      ['factories', 'update'],
      ['factories', 'delete'],

      ['personnels', 'create'],
      ['personnels', 'read'],
      ['personnels', 'update'],
      ['personnels', 'delete'],

      ['my-personnels', 'create'],
      ['my-personnels', 'read'],
      ['my-personnels', 'update'],
      ['my-personnels', 'delete'],

      ['cases', 'create'],
      ['cases', 'read'],
      ['cases', 'update'],
      ['cases', 'delete'],

      ['my-cases', 'create'],
      ['my-cases', 'read'],
      ['my-cases', 'update'],
      ['my-cases', 'delete'],

      // ['suggestions', 'create'],
      ['suggestions', 'read'],
      ['suggestions', 'update'],
      ['suggestions', 'delete'],

      ['reports', 'create'],
      ['reports', 'read'],
      ['reports', 'update'],
      ['reports', 'delete'],

      ['users-activity', 'create'],
      ['users-activity', 'read'],
      ['users-activity', 'update'],
      ['users-activity', 'delete'],

      ['settings', 'create'],
      ['settings', 'read'],
      ['settings', 'update'],
      ['settings', 'delete'],

      ['edit-profile', 'create'],
      ['edit-profile', 'read'],
      ['edit-profile', 'update'],
      ['edit-profile', 'delete'],
    ];

    perm.forEach(async (p) => {
      // console.log('p', p)
      await auther.AddPermission('مدیرکل', p[0], p[1]);
    });

    /**************************Seed CRUD */
    acts = ['read', 'create', 'update', 'delete'];
    permissions = [
      'dashboard',
      'manage-users',
      'factories',
      'personnels',
      'my-personnels',
      'cases',
      'my-cases',
      'suggestions',
      'reports',
      'users-activity',
      'settings',
      'edit-profile',
    ];

    permissions.forEach((e) => {
      // console.log('e', e)
      acts.forEach(async (a) => {
        // console.log('a', a)
        await auther.AddPermission('مدیرکل', e, a);
      });
    });

    await auther.AddRole({ id: '3' }, 'مدیرکل');


    //////////////////////////// * NOW ADD 'مشتری' ////////////////////////////////////////

    perm = [
      ['personnels', 'create'],
      // ['personnels', 'read'],
      // ['personnels', 'update'],
      // ['personnels', 'delete'],

      ['my-personnels', 'create'],
      ['my-personnels', 'read'],
      ['my-personnels', 'update'],
      ['my-personnels', 'delete'],

      ['my-cases', 'create'],
      ['my-cases', 'read'],
      ['my-cases', 'update'],
      ['my-cases', 'delete'],

      ['suggestions', 'create'],
      // ['suggestions', 'read'],
      // ['suggestions', 'update'],
      // ['suggestions', 'delete'],

      ['reports', 'create'],
      ['reports', 'read'],
      ['reports', 'update'],
      ['reports', 'delete'],

      ['edit-profile', 'create'],
      ['edit-profile', 'read'],
      ['edit-profile', 'update'],
      ['edit-profile', 'delete'],
    ];

    perm.forEach(async (p) => {
      // console.log('p', p)
      await auther.AddPermission('مشتری', p[0], p[1]);
    });

    /**************************Seed CRUD */
    acts = ['read', 'create', 'update', 'delete'];
    permissions = [
      'personnels',
      'my-personnels',
      'my-cases',
      'suggestions',
      'reports',
      'edit-profile',
    ];

    permissions.forEach((e) => {
      // console.log('e', e)
      acts.forEach(async (a) => {
        // console.log('a', a)
        await auther.AddPermission('مشتری', e, a);
      });
    });

    await auther.AddRole({ id: '4' }, 'مشتری');


    //////////////////////////// * NOW ADD 'ارتباطات' ////////////////////////////////////////


  perm = [
      ['suggestions', 'create'],
      ['suggestions', 'read'],
      ['suggestions', 'update'],
      ['suggestions', 'delete'],

      ['edit-profile', 'create'],
      ['edit-profile', 'read'],
      ['edit-profile', 'update'],
      ['edit-profile', 'delete'],
    ];

    perm.forEach(async (p) => {
      // console.log('p', p)
      await auther.AddPermission('ارتباطات', p[0], p[1]);
    });

    /**************************Seed CRUD */
    acts = ['read', 'create', 'update', 'delete'];
    permissions = [
      'suggestions',
      'edit-profile',
    ];

    permissions.forEach((e) => {
      // console.log('e', e)
      acts.forEach(async (a) => {
        // console.log('a', a)
        await auther.AddPermission('ارتباطات', e, a);
      });
    });

    await auther.AddRole({ id: '5' }, 'ارتباطات');


    return;
    // await queryInterface.bulkInsert('Companies', {}, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     *
     */
    // return await queryInterface.bulkDelete('casbin_rule', null, {});
  },
};
