"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = countSymbols;
// https://mathiasbynens.be/notes/javascript-unicode
const regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
function countSymbols(s) {
    return s.replace(regexAstralSymbols, '_').length;
}
//# sourceMappingURL=countSymbols.js.map