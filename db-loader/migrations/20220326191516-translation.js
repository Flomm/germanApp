"use strict";

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
  return db.createTable("translation", {
    id: {
      type: "int",
      primaryKey: true,
      autoIncrement: true,
      unique: "true",
      notNull: true,
    },
    lang: {
      type: "string",
      length: 2,
      notNull: true,
    },
    wordId: {
      type: "int",
      notNull: true,
    },
    gender: { type: "string", length: 3, notNull: false },
    translation: { type: "string", length: 70, notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable("translation");
};

exports._meta = {
  version: 1,
};
