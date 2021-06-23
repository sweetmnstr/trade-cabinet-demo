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
exports.UsersPaymentsBitcoinProvider = void 0;
const client_1 = require("../client");
const common_1 = require("@nestjs/common");
let UsersPaymentsBitcoinProvider = class UsersPaymentsBitcoinProvider {
    constructor(client) {
        this.client = client;
    }
    api(path, params) {
        return this.client.request(`payments.${path}`, params);
    }
    getAllBitcoinWallets() {
        return this.api('getAllBitcoinWallets');
    }
    getBitcoinWalletById(body) {
        return this.api('getBitcoinWalletById');
    }
    createBitcoinWallet(partner) {
        return this.api('createBitcoinWallet');
    }
    deleteBitcoinWallet(body) {
        return this.api('deleteBitcoinWallet');
    }
    createBitcoinTransaction(body) {
        return this.api('createBitcoinTransaction', body);
    }
};
UsersPaymentsBitcoinProvider = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [client_1.UsersClient])
], UsersPaymentsBitcoinProvider);
exports.UsersPaymentsBitcoinProvider = UsersPaymentsBitcoinProvider;
