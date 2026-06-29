"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertConfiguration = void 0;
const configuration_1 = require("../configuration");
async function convertConfiguration(flatConfiguration, env) {
    return {
        sources: {
            paths: flatConfiguration.paths,
            defaultDialect: flatConfiguration.language,
            names: flatConfiguration.name,
            tagExpression: flatConfiguration.tags,
            order: flatConfiguration.order,
        },
        support: {
            requireModules: flatConfiguration.requireModule,
            requirePaths: flatConfiguration.require,
            importPaths: flatConfiguration.import,
        },
        runtime: {
            dryRun: flatConfiguration.dryRun,
            failFast: flatConfiguration.failFast,
            filterStacktraces: !flatConfiguration.backtrace,
            parallel: flatConfiguration.parallel,
            retry: flatConfiguration.retry,
            retryTagFilter: flatConfiguration.retryTagFilter,
            strict: flatConfiguration.strict,
            worldParameters: flatConfiguration.worldParameters,
        },
        formats: convertFormats(flatConfiguration, env),
    };
}
exports.convertConfiguration = convertConfiguration;
function convertFormats(flatConfiguration, env) {
    var _a, _b;
    const splitFormats = flatConfiguration.format.map((item) => configuration_1.OptionSplitter.split(item));
    return {
        stdout: (_b = (_a = [...splitFormats].reverse().find(([, target]) => !target)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 'progress',
        files: splitFormats
            .filter(([, target]) => !!target)
            .reduce((mapped, [type, target]) => {
            return {
                ...mapped,
                [target]: type,
            };
        }, {}),
        publish: makePublishConfig(flatConfiguration, env),
        options: flatConfiguration.formatOptions,
    };
}
function makePublishConfig(flatConfiguration, env) {
    const enabled = isPublishing(flatConfiguration, env);
    if (!enabled) {
        return false;
    }
    return {
        url: env.CUCUMBER_PUBLISH_URL,
        token: env.CUCUMBER_PUBLISH_TOKEN,
    };
}
function isPublishing(flatConfiguration, env) {
    return (flatConfiguration.publish ||
        (0, configuration_1.isTruthyString)(env.CUCUMBER_PUBLISH_ENABLED) ||
        env.CUCUMBER_PUBLISH_TOKEN !== undefined);
}
//# sourceMappingURL=convert_configuration.js.map