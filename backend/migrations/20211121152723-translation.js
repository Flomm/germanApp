'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('translation', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unique: 'true',
      notNull: true,
    },
    germanId: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'germanId',
        table: 'ger',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT',
        },
        mapping: {
          germanId: 'id',
        },
      },
    },
    hungarianId: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'hungarianId',
        table: 'hun',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT',
        },
        mapping: {
          hungarianId: 'id',
        },
      },
    },
  });
};

exports.down = function(db) {
  return db.dropTable('translation');
};

exports._meta = {
  "version": 1
};
