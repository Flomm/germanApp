'use strict';

var dbm;
var type;
var seed;

exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('role', {
    roleId: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    name: { type: 'string', notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable('role');
};

exports._meta = {
  version: 1,
};
