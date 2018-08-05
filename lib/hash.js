const { createHash } = require("crypto");
import Emoji from "base-emoji-512";
import log from "./log";

export const getHash = async (data) =>
  new Promise((resolve, reject) => {
    log.debug(`Hash:	Generating hash for ${data}`);
    try {
      const sha = createHash("sha256");
      sha.update(data);

      const digest = sha.digest();
      const emoji = Emoji.encode(digest);

      log.debug(`Hash:	Resulting hash: ${digest}\nResulting emoji: ${emoji}`);

      resolve(emoji);
    }
    catch (e) {
      log.error(`	Hash:	Failed to generate hash: ${e}\n${e.stack}`);
      reject(e);
    }
  });

