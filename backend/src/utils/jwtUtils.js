"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT = (userId) => {
    return jsonwebtoken_1.default.sign({ _id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};
exports.generateJWT = generateJWT;
