const kvs = { "\u{1f34f}": "https://google.com/?q=thisestsratsrat" };

function get(key, cb) {
  const value = kvs[key] || null;
  cb(undefined, value);
}

function set(key, value, expiry, cb) {
  kvs[key] = value;
  cb();
}

export default {
  createClient() {
    return { get, set, on: () => {} };
  }
}
