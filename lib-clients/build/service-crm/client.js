"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmClient = void 0;
const lib_rpc_1 = require("lib-rpc");
class CrmClient extends lib_rpc_1.RedisClient {
    constructor(config) {
        super("crm", config);
    }
}
exports.CrmClient = CrmClient;
