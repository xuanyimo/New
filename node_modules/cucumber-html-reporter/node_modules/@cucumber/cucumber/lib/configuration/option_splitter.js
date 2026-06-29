"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionSplitter = void 0;
exports.OptionSplitter = {
    split(option) {
        option = option.replace(/"/g, '');
        const parts = option.split(/((?:file){0}):(?!\\|\/\/)/);
        const result = parts.reduce((memo, part, i) => {
            if (partNeedsRecombined(i)) {
                memo.push(parts.slice(i, i + 2).join(''));
            }
            return memo;
        }, []);
        if (result.length === 1) {
            result.push('');
        }
        return result;
    },
};
function partNeedsRecombined(i) {
    return i % 2 === 0;
}
//# sourceMappingURL=option_splitter.js.map