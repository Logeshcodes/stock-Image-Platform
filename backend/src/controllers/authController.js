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
exports.resetPasswordController = exports.requestPasswordReset = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const constants_1 = require("../utils/constants");
const bcrypt_1 = __importDefault(require("bcrypt"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, phoneNumber, password } = req.body;
        console.log("auth controller : ", email, username, phoneNumber, password);
        const token = yield (0, authService_1.registerUser)(email, username, phoneNumber, password);
        res.status(201).json({ token,
            success: true,
            message: constants_1.ResponseError.SIGNUP_SUCCESS,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const token = yield (0, authService_1.loginUser)(email, password);
        res.status(200).json({ token,
            success: true,
            message: constants_1.ResponseError.ACCOUNT_LOGIN_SUCCESS,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.login = login;
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const resetToken = yield (0, authService_1.resetPasswordRequest)(email);
        res.status(200).json({ success: true, message: constants_1.ResponseError.RESET_PASSWORD });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.requestPasswordReset = requestPasswordReset;
const resetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;
        console.log("password data : ", userId, currentPassword, newPassword);
        const user = yield (0, authService_1.getUserPassword)(userId);
        const oldPassword = user === null || user === void 0 ? void 0 : user.password;
        console.log("oldPassword : ", oldPassword);
        const result = yield bcrypt_1.default.compare(currentPassword, oldPassword);
        if (result) {
            const response = yield (0, authService_1.resetPassword)(userId, newPassword);
            if (response) {
                res.status(200).json({ success: true, message: constants_1.ResponseError.RESET_PASSWORD_SUCCESS });
            }
            else {
                res.json({
                    success: false,
                    message: constants_1.ResponseError.PASSWORD_NOT_UPDATED,
                });
            }
        }
        else {
            res.json({
                success: false,
                message: constants_1.ResponseError.PASSWORD_WRONG,
            });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.resetPasswordController = resetPasswordController;
