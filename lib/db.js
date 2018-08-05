import substring from "unicode-substring";
import log from "./log";

const { promisify } = require("util");

const EXPIRY = 60 * 60 * 24 * 90;

let db;

let getAsync;
let setAsync;

export const init = async (dbdep) =>
  new Promise(async (resolve, reject) => {
    log.debug("DB:\tCreating db client");
    db = dbdep.createClient({
      host: "redisurl"
    });

    db.on("error", (err) => {
      log.error(`	DB:	Failed to initialize DB: ${err}\n${err.stack}`);
      reject(err);
    });
    db.on("ready", () => {
      log.info("\tDB:\tDB is ready");
      resolve();
    });

    getAsync = promisify(db.get).bind(db);
    setAsync = promisify(db.set).bind(db);
  });

export const lookup = async (key) => {
  log.debug(`DB:\tLooking up key ${key}`);
  return await getAsync(key)
    .catch(err => log.error(`\tDB:\tFailed to GET from redis: ${err}\n${err.stack}`));
};

export const insert = async (key, value) => {
  log.debug(`DB:\tInserting ${value} into DB at ${key}`);
  let len = key.length;

  for (let i = 1; i <= len; i++) {
    const currentKey = substring(key, 0, i);
    const currentValue = await getAsync(currentKey);
    if (!currentValue || currentValue === value) {
      setAsync(currentKey, value, "EX", EXPIRY)
        .catch(err => log.error(`\tDB:\tFailed to SET value in redis: ${err}\n${err.stack}`));
      log.debug(`DB:\tInserted ${value} at ${currentKey}`);
      return currentKey;
    }
  }
};

