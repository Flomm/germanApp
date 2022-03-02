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
  return db.createTable('user', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unique: 'true',
      notNull: true,
    },
    name: { type: 'string', length: 45, notNull: true },
    email: { type: 'string', unique: 'true', length: 45, notNull: true },
    password: { type: 'string', length: 60, notNull: true },
    verificationCode: { type: 'int', notNull: true },
    isVerified: { type: 'int', notNull: true, defaultValue: 0 },
    roleId: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'roleId',
        table: 'role',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT',
        },
        mapping: {
          roleId: 'roleId',
        },
      },
    },
    passwordRecoveryCode: {
      type: 'int',
      notNull: true,
    },
  });
};

exports.down = function (db) {
  return db.dropTable('user');
};

exports._meta = {
  version: 1,
};
