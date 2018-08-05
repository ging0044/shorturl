import babel from "rollup-plugin-babel";
import babelrc from "babelrc-rollup";
import resolve from "rollup-plugin-node-resolve"

let pkg = require("./package.json");
let external = Object.keys(pkg.dependencies);

let plugins = [
  resolve(),
  babel(babelrc()),
];

export default {
  entry: "lib/index.js",
  plugins: plugins,
  external: external,
  targets: [
    {
      dest: pkg.main,
      format: "cjs",
      sourceMap: true
    }
  ]
};
