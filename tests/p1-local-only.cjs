// Local regression safety boundary; loaded by NODE_OPTIONS in parent and child Node processes.
const net = require("node:net");
const tls = require("node:tls");
const fs = require("node:fs");
const { syncBuiltinESMExports } = require("node:module");
function local(host) {
  if (host && !["127.0.0.1", "localhost", "::1", "[::1]"].includes(host))
    throw new Error("P1 forbids non-loopback networking");
}
const connect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  const options = args[0];
  if (options && typeof options === "object" && !Array.isArray(options)) {
    if (!options.path) local(options.host);
  } else if (Array.isArray(options)) {
    const first = options[0];
    if (typeof first === "object") {
      if (!first.path) local(first.host);
    } else if (typeof options[1] === "string") local(options[1]);
  } else if (typeof options === "number") local(typeof args[1] === "string" ? args[1] : undefined);
  return connect.apply(this, args);
};
const tlsConnect = tls.connect;
tls.connect = function (...args) {
  const options = args.find((x) => x && typeof x === "object");
  if (options) local(options.host || options.servername);
  return tlsConnect.apply(this, args);
};
const nativeFetch = globalThis.fetch;
globalThis.fetch = function (input, options) {
  const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
  local(url.hostname);
  return nativeFetch(input, options);
};
function guardPath(path) {
  const name = String(path).split("/").pop();
  if (/^\.env(?:\.|$)/.test(name)) {
    const error = new Error("P1 forbids dotenv reads");
    error.code = "ENOENT";
    throw error;
  }
}
for (const name of ["readFile", "readFileSync", "createReadStream"]) {
  const original = fs[name];
  fs[name] = function (path, ...args) {
    guardPath(path);
    return original.call(this, path, ...args);
  };
}
const read = fs.promises.readFile;
fs.promises.readFile = async function (path, ...args) {
  guardPath(path);
  return read.call(this, path, ...args);
};
syncBuiltinESMExports();
