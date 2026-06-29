"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamingStrategyExampleName = exports.NamingStrategyFeatureName = exports.NamingStrategyLength = void 0;
exports.namingStrategy = namingStrategy;
var NamingStrategyLength;
(function (NamingStrategyLength) {
    NamingStrategyLength["LONG"] = "LONG";
    NamingStrategyLength["SHORT"] = "SHORT";
})(NamingStrategyLength || (exports.NamingStrategyLength = NamingStrategyLength = {}));
var NamingStrategyFeatureName;
(function (NamingStrategyFeatureName) {
    NamingStrategyFeatureName["INCLUDE"] = "INCLUDE";
    NamingStrategyFeatureName["EXCLUDE"] = "EXCLUDE";
})(NamingStrategyFeatureName || (exports.NamingStrategyFeatureName = NamingStrategyFeatureName = {}));
var NamingStrategyExampleName;
(function (NamingStrategyExampleName) {
    NamingStrategyExampleName["NUMBER"] = "NUMBER";
    NamingStrategyExampleName["PICKLE"] = "PICKLE";
    NamingStrategyExampleName["NUMBER_AND_PICKLE_IF_PARAMETERIZED"] = "NUMBER_AND_PICKLE_IF_PARAMETERIZED";
})(NamingStrategyExampleName || (exports.NamingStrategyExampleName = NamingStrategyExampleName = {}));
class BuiltinNamingStrategy {
    constructor(length, featureName, exampleName) {
        this.length = length;
        this.featureName = featureName;
        this.exampleName = exampleName;
    }
    reduce(lineage, pickle) {
        var _a, _b, _c, _d, _e, _f, _g;
        const parts = [];
        if (((_a = lineage.feature) === null || _a === void 0 ? void 0 : _a.name) && this.featureName === NamingStrategyFeatureName.INCLUDE) {
            parts.push(lineage.feature.name);
        }
        if ((_b = lineage.rule) === null || _b === void 0 ? void 0 : _b.name) {
            parts.push(lineage.rule.name);
        }
        if ((_c = lineage.scenario) === null || _c === void 0 ? void 0 : _c.name) {
            parts.push(lineage.scenario.name);
        }
        else {
            parts.push(pickle.name);
        }
        if ((_d = lineage.examples) === null || _d === void 0 ? void 0 : _d.name) {
            parts.push(lineage.examples.name);
        }
        if (lineage.example) {
            const exampleNumber = [
                '#',
                ((_e = lineage.examplesIndex) !== null && _e !== void 0 ? _e : 0) + 1,
                '.',
                ((_f = lineage.exampleIndex) !== null && _f !== void 0 ? _f : 0) + 1,
            ].join('');
            switch (this.exampleName) {
                case NamingStrategyExampleName.NUMBER:
                    parts.push(exampleNumber);
                    break;
                case NamingStrategyExampleName.NUMBER_AND_PICKLE_IF_PARAMETERIZED:
                    if (((_g = lineage.scenario) === null || _g === void 0 ? void 0 : _g.name) !== pickle.name) {
                        parts.push(exampleNumber + ': ' + pickle.name);
                    }
                    else {
                        parts.push(exampleNumber);
                    }
                    break;
                case NamingStrategyExampleName.PICKLE:
                    parts.push(pickle.name);
                    break;
            }
        }
        if (this.length === NamingStrategyLength.SHORT) {
            return parts.at(-1);
        }
        return parts.filter((part) => !!part).join(' - ');
    }
}
function namingStrategy(length, featureName = NamingStrategyFeatureName.INCLUDE, exampleName = NamingStrategyExampleName.NUMBER_AND_PICKLE_IF_PARAMETERIZED) {
    return new BuiltinNamingStrategy(length, featureName, exampleName);
}
//# sourceMappingURL=Lineage.js.map