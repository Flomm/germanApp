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
  return db.createTable('statistics', {
    userId: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    numOfStartedGames: { type: 'int', notNull: true, defaultValue: 0 },
    numOfFinishedGames: { type: 'int', notNull: true, defaultValue: 0 },
    numOfCorrectAnswers: { type: 'int', notNull: true, defaultValue: 0 },
    numOfIncorrectAnswers: { type: 'int', notNull: true, defaultValue: 0 },
  });
};

exports.down = function (db) {
  return db.dropTable('statistics');
};

exports._meta = {
  version: 1,
};
