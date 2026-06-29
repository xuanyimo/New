"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const src_1 = require("../src");
const parse_1 = __importDefault(require("./parse"));
describe('walkGherkinDocument', () => {
    it('traverses depth first', () => {
        const gherkinDocument = (0, parse_1.default)(`
      #1
      @A
      Feature: B
        #2
        Background: C

        #3
        @D
        Scenario: E
          #4
          Given F

        Scenario: G
          Given H

        #5
        Rule: I
          @J
          Scenario: K
            Given L
              | M | N |
              | O | P |

            #6
            Examples: Q

          Scenario: R
            Given S
              """
              T
              """

            Examples: U
              | V |
              | W |
`);
        const handlers = {
            comment: (comment, acc) => acc.concat(comment.text.trim()),
            dataTable: (dataTable, acc) => acc,
            docString: (docString, acc) => acc.concat(docString.content),
            tableCell: (tableCell, acc) => acc.concat(tableCell.value),
            tableRow: (tableRow, acc) => acc,
            tag: (tag, acc) => acc.concat(tag.name.substring(1)),
            feature: (feature, acc) => acc.concat(feature.name),
            background: (background, acc) => acc.concat(background.name),
            rule: (rule, acc) => acc.concat(rule.name),
            scenario: (scenario, acc) => acc.concat(scenario.name),
            examples: (examples, acc) => acc.concat(examples.name),
            step: (step, acc) => acc.concat(step.text),
        };
        const names = (0, src_1.walkGherkinDocument)(gherkinDocument, [], handlers);
        assert_1.default.deepEqual(names, '#1 A B #2 C #3 D E #4 F G H #5 I J K L M N O P #6 Q R S T U V W'.split(' '));
    });
});
//# sourceMappingURL=walkGherkinDocumentTest.js.map