"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.GherkinInMarkdownTokenMatcher = exports.GherkinClassicTokenMatcher = exports.Errors = exports.TokenScanner = exports.AstBuilder = exports.Parser = exports.dialects = exports.makeSourceEnvelope = exports.generateMessages = void 0;
const generateMessages_1 = __importDefault(require("./generateMessages"));
exports.generateMessages = generateMessages_1.default;
const makeSourceEnvelope_1 = __importDefault(require("./makeSourceEnvelope"));
exports.makeSourceEnvelope = makeSourceEnvelope_1.default;
const Parser_1 = __importDefault(require("./Parser"));
exports.Parser = Parser_1.default;
const AstBuilder_1 = __importDefault(require("./AstBuilder"));
exports.AstBuilder = AstBuilder_1.default;
const TokenScanner_1 = __importDefault(require("./TokenScanner"));
exports.TokenScanner = TokenScanner_1.default;
const Errors = __importStar(require("./Errors"));
exports.Errors = Errors;
const compile_1 = __importDefault(require("./pickles/compile"));
exports.compile = compile_1.default;
const gherkin_languages_json_1 = __importDefault(require("./gherkin-languages.json"));
const GherkinClassicTokenMatcher_1 = __importDefault(require("./GherkinClassicTokenMatcher"));
exports.GherkinClassicTokenMatcher = GherkinClassicTokenMatcher_1.default;
const GherkinInMarkdownTokenMatcher_1 = __importDefault(require("./GherkinInMarkdownTokenMatcher"));
exports.GherkinInMarkdownTokenMatcher = GherkinInMarkdownTokenMatcher_1.default;
const dialects = gherkin_languages_json_1.default;
exports.dialects = dialects;
//# sourceMappingURL=index.js.map