// UTIL FOR TS-NODE
process.env.TS = true;
process.env.TS_NODE_FILES = 'true';
if (!process.env.TS_NODE_PROJECT) process.env.TS_NODE_PROJECT = 'tsconfig.build.json';
process.env.TS_NODE_CACHE_DIRECTORY = '.ts-node';
require('ts-node/dist/bin').main();
