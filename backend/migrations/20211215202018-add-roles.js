'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  const promises = [];
  promises.push(db.insert('role', { roleId: 1, name: 'Admin' }));
  promises.push(db.insert('role', { roleId: 2, name: 'Consumer' }));

  return Promise.all(promises);
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
