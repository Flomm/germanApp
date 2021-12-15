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
  return db.createTable('hu', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unique: 'true',
      notNull: true,
    },
    word: { type: 'string', length: 70, notNull: true, unique: 'true' },
    isDeleted: {
      type: 'boolean',
      notNull: true,
      unique: 'true',
      defaultValue: false,
    },
  });
};

exports.down = function (db) {
  return db.dropTable('hu');
};

exports._meta = {
  version: 1,
};
