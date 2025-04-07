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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.getUserPassword = exports.findUser = exports.loginUser = exports.registerUser = void 0;
const userRepository_1 = require("../repositories/userRepository");
const passwordUtils_1 = require("../utils/passwordUtils");
const jwtUtils_1 = require("../utils/jwtUtils");
const registerUser = (email, username, phoneNumber, password) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("first");
    const existingUser = yield (0, userRepository_1.findUserByEmail)(email);
    console.log("first ,", existingUser);
    if (existingUser)
        throw new Error('User already exists');
    const hashedPassword = yield (0, passwordUtils_1.hashPassword)(password);
    const newUser = yield (0, userRepository_1.createUser)({ email, username, phoneNumber, password: hashedPassword });
    console.log("newUser", newUser);
    return (0, jwtUtils_1.generateJWT)(newUser._id);
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userRepository_1.findUserByEmail)(email);
    return (0, jwtUtils_1.generateJWT)(user._id);
});
exports.loginUser = loginUser;
const findUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userRepository_1.findUserByEmail)(email);
    return user;
});
exports.findUser = findUser;
const getUserPassword = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, userRepository_1.getUser)(userId);
});
exports.getUserPassword = getUserPassword;
const resetPassword = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield (0, passwordUtils_1.hashPassword)(newPassword);
    return yield (0, userRepository_1.updateUser)(userId, { password: hashedPassword });
});
exports.resetPassword = resetPassword;
