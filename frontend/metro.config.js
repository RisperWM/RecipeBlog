const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// 1. Watch the workspace root so we can see /shared
config.watchFolders = [workspaceRoot];

// 2. FORCE Metro to resolve all modules ONLY from the frontend's node_modules
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];

// 3. This is the "Magic" part: If two versions of a library (like react-native)
// are found, always pick the one in the frontend folder.
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => {
      return path.join(projectRoot, "node_modules", name);
    },
  },
);

module.exports = config;
