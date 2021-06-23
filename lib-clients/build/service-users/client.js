"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersClient = void 0;
const lib_rpc_1 = require("lib-rpc");
class UsersClient extends lib_rpc_1.RedisClient {
    constructor(config) {
        super('serviceUsers', config);
    }
}
exports.UsersClient = UsersClient;
