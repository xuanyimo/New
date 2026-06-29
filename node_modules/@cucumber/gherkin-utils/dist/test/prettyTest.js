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
const gherkin_1 = require("@cucumber/gherkin");
const assert_1 = __importDefault(require("assert"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pretty_1 = __importStar(require("../src/pretty"));
const parse_1 = __importDefault(require("./parse"));
const featuresPath = path_1.default.resolve(__dirname, '../node_modules/@cucumber/compatibility-kit/features');
describe('pretty', () => {
    it('renders an empty file', () => {
        checkGherkinToAstToMarkdownToAstToGherkin('');
    });
    it('renders the language header if it is not "en"', () => {
        checkGherkinToAstToGherkin(`# language: no
Egenskap: hallo
`);
    });
    it('renders a feature with empty scenarios', () => {
        checkGherkinToAstToMarkdownToAstToGherkin(`Feature: hello

  Scenario: one

  Scenario: Two
`);
    });
    it('renders a feature with two scenarios', () => {
        checkGherkinToAstToMarkdownToAstToGherkin(`Feature: hello

  Scenario: one
    Given hello

  Scenario: two
    Given world
`);
    });
    it('renders a feature with two scenarios in a rule', () => {
        checkGherkinToAstToMarkdownToAstToGherkin(`Feature: hello

  Rule: ok

    Scenario: one
      Given hello

    Scenario: two
      Given world
`);
    });
    it('renders a feature with background and scenario', () => {
        checkGherkinToAstToMarkdownToAstToGherkin(`Feature: hello

  Background: bbb
    Given hello

  Scenario: two
    Given world
`);
    });
    it('renders a rule with background and scenario', () => {
        checkGherkinToAstToMarkdownToAstToGherkin(`Feature: hello

  Rule: machin

    Background: bbb
      Given hello

    Scenario: two
      Given world
`);
    });
    it('renders tags when set', () => {
        checkGherkinToAstToMarkdownToAstToGherkin(`@featureTag
Feature: hello

  Rule: machin

    Background: bbb
      Given hello

    @scenarioTag @secondTag
    Scenario: two
      Given world
`);
    });
    it('renders examples tables', () => {
        checkGherkinToAstToMarkdownToAstToGherkin(`Feature: hello

  Scenario: one
    Given a a <text> and a <number>

    Examples: some data
      | text | number |
      | a    |      1 |
      | ab   |     10 |
      | abc  |    100 |
`);
    });
    it('renders data tables', () => {
        checkGherkinToAstToMarkdownToAstToGherkin(`Feature: hello

  Scenario: one
    Given a data table:
      | text | numbers |
      | a    |       1 |
      | ab   |      10 |
      | abc  |     100 |
`);
    });
    it('renders tables with cjk characters', () => {
        checkGherkinToAstToMarkdownToAstToGherkin(`Feature: hello

  Scenario: one
    Given a data table:
      | 路     | numbers |
      | 路     |       1 |
      | 路步   |      10 |
      | 路步路 |     100 |
`);
    });
    describe('DocString', () => {
        it('is rendered with type', () => {
            checkGherkinToAstToMarkdownToAstToGherkin(`Feature: hello

  Scenario: one
    Given a doc string:
      \`\`\`json
      {
        "foo": "bar"
      }
      \`\`\`
`);
        });
        it('escapes DocString separators', () => {
            checkGherkinToAstToMarkdownToAstToGherkin(`Feature: hello

  Scenario: one
    Given a doc string:
      \`\`\`
      2
      \`\`
      3
      \\\`\\\`\\\`
      4
      \\\`\\\`\\\`\`
      5
      \\\`\\\`\\\`\`\`
      \`\`\`
`);
        });
    });
    it('renders comments', () => {
        checkGherkinToAstToGherkin(`# one
# two
Feature: hello
  # three
  # four

  Scenario: one
    # five
    # six
    Given a doc string:
      """
      a
      \\"\\"\\"
      b
      """
`);
    });
    it('renders just comments', () => {
        checkGherkinToAstToGherkin(`# one
# two
`);
    });
    it('renders block comments', () => {
        checkGherkinToAstToGherkin(`Feature: block comments

  Background: Archimedes
    Given a lever long enough
    And a fulcrum on which to place it
  # Scenario: move the world
  #   When I apply force to the lever
  #   Then I shall move the world

  Scenario: nice cup of tea
    When I brew some tea
    Then I should have a cozy time
`);
    });
    it('renders trailing comments', () => {
        checkGherkinToAstToGherkin(`# one
Feature: hello

  Scenario: one
    # one
    Given a doc string:
      """
      a
      \\"\\"\\"
      b
      """
      # two
  # three
# four
`);
    });
    it('renders descriptions when set', () => {
        checkGherkinToAstToGherkin(`Feature: hello
  So this is a feature

  Rule: machin
    The first rule of the feature states things

    Background: bbb
      We can have some explications for the background

      Given hello

    Scenario: two
      This scenario will do things, maybe

      Given world
`);
    });
    it('renders titles without trailing whitespace', () => {
        checkGherkinToAstToGherkin(`Feature:

  Rule:

    Background:
    Scenario Outlines:

      Examples:
`);
    });
    const featureFiles = fast_glob_1.default.sync(`${featuresPath}/**/*.feature`);
    for (const featureFile of featureFiles) {
        const relativePath = path_1.default.relative(__dirname, featureFile);
        it(`renders ${relativePath}`, () => {
            var _a;
            const gherkinSource = fs_1.default.readFileSync(featureFile, 'utf-8');
            const gherkinDocument = (0, parse_1.default)(gherkinSource, new gherkin_1.GherkinClassicTokenMatcher());
            const formattedGherkinSource = (0, pretty_1.default)(gherkinDocument, 'gherkin');
            const language = ((_a = gherkinDocument.feature) === null || _a === void 0 ? void 0 : _a.language) || 'en';
            const newGherkinDocument = checkGherkinToAstToGherkin(formattedGherkinSource, language);
            (0, assert_1.default)(newGherkinDocument);
            // TODO: comments
            if (gherkinDocument.comments.length === 0) {
                assert_1.default.deepStrictEqual(neutralize(newGherkinDocument), neutralize(gherkinDocument));
            }
        });
    }
    describe('escapeCell', () => {
        it('escapes nothing', () => {
            assert_1.default.strictEqual((0, pretty_1.escapeCell)('hello'), 'hello');
        });
        it('escapes newline', () => {
            assert_1.default.strictEqual((0, pretty_1.escapeCell)('\n'), '\\n');
        });
        it('escapes pipe', () => {
            assert_1.default.strictEqual((0, pretty_1.escapeCell)('|'), '\\|');
        });
        it('escapes backslash', () => {
            assert_1.default.strictEqual((0, pretty_1.escapeCell)('\\'), '\\\\');
        });
    });
});
function checkGherkinToAstToMarkdownToAstToGherkin(gherkinSource) {
    const gherkinDocument = (0, parse_1.default)(gherkinSource, new gherkin_1.GherkinClassicTokenMatcher());
    // console.log({gherkinDocument})
    const markdownSource = (0, pretty_1.default)(gherkinDocument, 'markdown');
    // console.log(`<Markdown>${markdownSource}</Markdown>`)
    const markdownGherkinDocument = (0, parse_1.default)(markdownSource, new gherkin_1.GherkinInMarkdownTokenMatcher());
    // console.log({markdownGherkinDocument})
    const newGherkinSource = (0, pretty_1.default)(markdownGherkinDocument, 'gherkin');
    // console.log(`<Gherkin>${newGherkinSource}</Gherkin>`)
    assert_1.default.strictEqual(newGherkinSource, gherkinSource);
}
function checkGherkinToAstToGherkin(gherkinSource, language = 'en') {
    const gherkinDocument = (0, parse_1.default)(gherkinSource, new gherkin_1.GherkinClassicTokenMatcher(language));
    const newGherkinSource = (0, pretty_1.default)(gherkinDocument, 'gherkin');
    // console.log(`<Gherkin>${newGherkinSource}</Gherkin>`)
    assert_1.default.strictEqual(newGherkinSource, gherkinSource);
    return gherkinDocument;
}
function neutralize(gherkinDocument) {
    const json = JSON.stringify(gherkinDocument, (key, value) => {
        if ('id' === key) {
            return 'id';
        }
        else if (['column', 'line'].includes(key)) {
            return '0';
        }
        else {
            return value;
        }
    }, 2);
    return JSON.parse(json);
}
//# sourceMappingURL=prettyTest.js.map