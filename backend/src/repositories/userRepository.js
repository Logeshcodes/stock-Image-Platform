"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.findUserByResetToken = exports.createUser = exports.getUser = exports.findUserByEmail = void 0;
const userModel_1 = require("../models/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return userModel_1.User.findOne({ email });
});
exports.findUserByEmail = findUserByEmail;
const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return userModel_1.User.findById(userId);
});
exports.getUser = getUser;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new userModel_1.User(userData);
    return user.save();
});
exports.createUser = createUser;
const findUserByResetToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded._id;
    return userModel_1.User.findById(userId);
});
exports.findUserByResetToken = findUserByResetToken;
const updateUser = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    return userModel_1.User.findByIdAndUpdate(id, updates, { new: true });
});
exports.updateUser = updateUser;
