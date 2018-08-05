const { URL } = require("url");

import log from "./log";

export const formatUrl = async str =>
  new Promise((resolve, reject) => {
    log.debug(`URL:\tFormatting URL ${str}`);
    try {
      const url = new URL(str);
      log.debug(`URL:\tGot valid URL: ${url}`);
      resolve(url.toString());
    }
    catch (e) {
      log.debug(`URL:\t${str} is not a valid URL`);
      reject();
    }
  });
