"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorProvider = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../client");
let OperatorProvider = class OperatorProvider {
    constructor(client) {
        this.client = client;
    }
    api(path, params) {
        return this.client.request(`operator.${path}`, params);
    }
    updatePassword(body) {
        return this.api('updatePassword', body);
    }
    updateTransactionStatus(body) {
        return this.api('updateTransactionStatus', body);
    }
    getAllPartners() {
        return this.api('getAllPartners');
    }
    getPartner(body) {
        return this.api('getPartner', body);
    }
    getClientsTransaction(body) {
        return this.api('getClientsTransaction', body);
    }
    addClientsAccount(body) {
        return this.api('addClientsAccount', body);
    }
    getAllTransactions() {
        return this.api('getAllTransactions');
    }
    getTransactionStatusById(body) {
        return this.api('getTransactionStatusById', body);
    }
    getBalance(body) {
        return this.api('getBalance', body);
    }
    addBalance(body) {
        return this.api('addBalance', body);
    }
};
OperatorProvider = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [client_1.UsersClient])
], OperatorProvider);
exports.OperatorProvider = OperatorProvider;
