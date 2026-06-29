"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = void 0;
exports.statusOrdinal = statusOrdinal;
const messages_1 = require("@cucumber/messages");
function statusOrdinal(status) {
    return [
        messages_1.TestStepResultStatus.UNKNOWN,
        messages_1.TestStepResultStatus.PASSED,
        messages_1.TestStepResultStatus.SKIPPED,
        messages_1.TestStepResultStatus.PENDING,
        messages_1.TestStepResultStatus.UNDEFINED,
        messages_1.TestStepResultStatus.AMBIGUOUS,
        messages_1.TestStepResultStatus.FAILED,
    ].indexOf(status);
}
exports.assert = {
    ok(target, message) {
        if (!target) {
            throw new Error(message);
        }
    },
};
//# sourceMappingURL=helpers.js.map