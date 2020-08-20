/* eslint-disable */
/**
 * 这是 iceworks/lib/command/init/ejsRenderDir 编译后的文件
 * 由于引入整个 iceworks-cli 的代价比较大， 所以直接使用了这个文件
 * https://github.com/ice-lab/iceworks-cli/blob/master/packages/iceworks-cli/src/command/init/ejsRenderDir.ts
 */

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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var glob = require("glob");
var ejs = require("ejs");
var fse = require("fs-extra");
function default_1(dir, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    glob('**', {
                        cwd: dir,
                        ignore: ['node_modules/**'],
                        nodir: true,
                        dot: true,
                    }, function (err, files) {
                        if (err) {
                            return reject(err);
                        }
                        Promise.all(files.map(function (file) {
                            var filepath = path.join(dir, file);
                            return renderFile(filepath, options);
                        })).then(function () {
                            resolve();
                        }).catch(function (err) {
                            reject(err);
                        });
                    });
                })];
        });
    });
}
exports.default = default_1;
;
function renderFile(filepath, options) {
    var filename = path.basename(filepath);
    return new Promise(function (resolve, reject) {
        ejs.renderFile(filepath, options, function (err, result) {
            if (err) {
                return reject(err);
            }
            if (/\.ejs$/.test(filepath)) {
                filename = filename.replace(/\.ejs$/, '');
                fse.removeSync(filepath);
            }
            var newFilepath = path.join(filepath, '../', filename);
            fse.writeFileSync(newFilepath, result);
            resolve(newFilepath);
        });
    });
}
//# sourceMappingURL=ejsRenderDir.js.map