"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pretty;
exports.escapeCell = escapeCell;
const walkGherkinDocument_1 = require("./walkGherkinDocument");
function pretty(gherkinDocument, syntax = 'gherkin') {
    let scenarioLevel = 1;
    return (0, walkGherkinDocument_1.walkGherkinDocument)(gherkinDocument, '', {
        comment(comment, content) {
            return content.concat(comment.text).concat('\n');
        },
        feature(feature, content) {
            return content
                .concat(prettyLanguageHeader(feature.language))
                .concat(prettyKeywordContainer(feature, syntax, 0));
        },
        rule(rule, content) {
            scenarioLevel = 2;
            return content.concat(prettyKeywordContainer(rule, syntax, 1));
        },
        background(background, content) {
            return content.concat(prettyKeywordContainer(background, syntax, scenarioLevel));
        },
        scenario(scenario, content) {
            return content.concat(prettyKeywordContainer(scenario, syntax, scenarioLevel));
        },
        examples(examples, content) {
            const tableRows = examples.tableHeader ? [examples.tableHeader, ...examples.tableBody] : [];
            return content
                .concat(prettyKeywordContainer(examples, syntax, scenarioLevel + 1))
                .concat(prettyTableRows(tableRows, syntax, scenarioLevel + 2));
        },
        step(step, content) {
            return content
                .concat(stepPrefix(scenarioLevel + 1, syntax))
                .concat(step.keyword)
                .concat(step.text)
                .concat('\n');
        },
        dataTable(dataTable, content) {
            const level = syntax === 'markdown' ? 1 : scenarioLevel + 2;
            return content.concat(prettyTableRows(dataTable.rows || [], syntax, level));
        },
        docString(docString, content) {
            const delimiter = makeDocStringDelimiter(syntax, docString);
            const level = syntax === 'markdown' ? 1 : scenarioLevel + 2;
            const indent = spaces(level);
            let docStringContent = docString.content.replace(/^/gm, indent);
            if (syntax === 'gherkin') {
                if (docString.delimiter === '"""') {
                    docStringContent = docStringContent.replace(/"""/gm, '\\"\\"\\"');
                }
                else {
                    docStringContent = docStringContent.replace(/```/gm, '\\`\\`\\`');
                }
            }
            return content
                .concat(indent)
                .concat(delimiter)
                .concat(docString.mediaType || '')
                .concat('\n')
                .concat(docStringContent)
                .concat('\n')
                .concat(indent)
                .concat(delimiter)
                .concat('\n');
        },
    });
}
function prettyLanguageHeader(language) {
    return language === 'en' ? '' : `# language: ${language}\n`;
}
function semiColumnName(name) {
    return name == null || name.length == 0 ? ':' : ': ' + name;
}
function prettyKeywordContainer(stepContainer, syntax, level) {
    const tags = 'tags' in stepContainer ? stepContainer.tags : [];
    const stepCount = 'steps' in stepContainer ? stepContainer.steps.length : 0;
    const description = prettyDescription(stepContainer.description, syntax);
    return ''
        .concat(level === 0 ? '' : '\n')
        .concat(prettyTags(tags, syntax, level))
        .concat(keywordPrefix(level, syntax))
        .concat(stepContainer.keyword)
        .concat(semiColumnName(stepContainer.name))
        .concat('\n')
        .concat(description)
        .concat(description && stepCount > 0 ? '\n' : '');
}
function prettyDescription(description, syntax) {
    if (!description)
        return '';
    if (syntax === 'gherkin')
        return description + '\n';
    else
        return description.replace(/^\s*/gm, '') + '\n';
}
function prettyTags(tags, syntax, level) {
    if (tags === undefined || tags.length == 0) {
        return '';
    }
    const prefix = syntax === 'gherkin' ? spaces(level) : '';
    const tagQuote = syntax === 'gherkin' ? '' : '`';
    return prefix + tags.map((tag) => `${tagQuote}${tag.name}${tagQuote}`).join(' ') + '\n';
}
function keywordPrefix(level, syntax) {
    if (syntax === 'markdown') {
        return new Array(level + 2).join('#') + ' ';
    }
    else {
        return spaces(level);
    }
}
function stepPrefix(level, syntax) {
    if (syntax === 'markdown') {
        return '* ';
    }
    else {
        return new Array(level + 1).join('  ');
    }
}
function spaces(level) {
    return new Array(level + 1).join('  ');
}
function makeDocStringDelimiter(syntax, docString) {
    if (syntax === 'gherkin') {
        return docString.delimiter.substring(0, 3);
    }
    // The length of the fenced code block delimiter is three backticks when the content inside doesn't have backticks.
    // If the content inside has three or more backticks, the number of backticks in the delimiter must be at least one more
    // https://github.github.com/gfm/#fenced-code-blocks
    const threeOrMoreBackticks = /(```+)/g;
    let maxContentBackTickCount = 2;
    let match;
    do {
        match = threeOrMoreBackticks.exec(docString.content);
        if (match) {
            maxContentBackTickCount = Math.max(maxContentBackTickCount, match[1].length);
        }
    } while (match);
    // Return a delimiter with one more backtick than the max number of backticks in the contents (3 ny default)
    return new Array(maxContentBackTickCount + 2).join('`');
}
function prettyTableRows(tableRows, syntax, level) {
    if (tableRows.length === 0)
        return '';
    const maxWidths = new Array(tableRows[0].cells.length).fill(0);
    tableRows.forEach((tableRow) => {
        tableRow.cells.forEach((tableCell, j) => {
            maxWidths[j] = Math.max(maxWidths[j], getStringWidth(escapeCell(tableCell.value)));
        });
    });
    let n = 0;
    let s = '';
    for (const row of tableRows) {
        s += prettyTableRow(row, level, maxWidths, syntax);
        if (n === 0 && syntax === 'markdown') {
            const separatorRow = {
                location: row.location,
                id: row.id + '-separator',
                cells: row.cells.map((cell, j) => ({
                    location: cell.location,
                    value: new Array(maxWidths[j] + 1).join('-'),
                })),
            };
            s += prettyTableRow(separatorRow, level, maxWidths, syntax);
        }
        n++;
    }
    return s;
}
function prettyTableRow(row, level, maxWidths, syntax) {
    const actualLevel = syntax === 'markdown' ? 1 : level;
    return `${spaces(actualLevel)}| ${row.cells
        .map((cell, j) => {
        const escapedCellValue = escapeCell(cell.value);
        const spaceCount = maxWidths[j] - getStringWidth(escapedCellValue);
        const spaces = new Array(spaceCount + 1).join(' ');
        return isNumeric(escapedCellValue) ? spaces + escapedCellValue : escapedCellValue + spaces;
    })
        .join(' | ')} |\n`;
}
function getStringWidth(str) {
    let width = 0;
    for (const character of str) {
        width += isCJKorFullWidth(character) ? 2 : 1;
    }
    return width;
}
function isCJKorFullWidth(character) {
    const pattern = /[\u3000-\u9fff\uac00-\ud7af\uff01-\uff60]/;
    return pattern.test(character);
}
function escapeCell(s) {
    let e = '';
    const characters = s.split('');
    for (const c of characters) {
        switch (c) {
            case '\\':
                e += '\\\\';
                break;
            case '\n':
                e += '\\n';
                break;
            case '|':
                e += '\\|';
                break;
            default:
                e += c;
        }
    }
    return e;
}
function isNumeric(s) {
    return !isNaN(parseFloat(s));
}
//# sourceMappingURL=pretty.js.map