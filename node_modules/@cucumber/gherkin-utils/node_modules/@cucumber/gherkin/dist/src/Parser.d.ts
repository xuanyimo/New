import * as messages from '@cucumber/messages';
import ITokenMatcher from './ITokenMatcher';
import GherkinLine from './GherkinLine';
import IToken, { Item } from './IToken';
import { IAstBuilder } from './IAstBuilder';
export declare class Token implements IToken<TokenType> {
    readonly line: GherkinLine;
    readonly location: messages.Location;
    isEof: boolean;
    matchedText?: string;
    matchedType: TokenType;
    matchedItems: readonly Item[];
    matchedKeyword: string;
    matchedIndent: number;
    matchedGherkinDialect: string;
    matchedKeywordType: messages.StepKeywordType;
    constructor(line: GherkinLine, location: messages.Location);
    getTokenValue(): string;
    detach(): void;
}
export declare enum TokenType {
    None = 0,
    EOF = 1,
    Empty = 2,
    Comment = 3,
    TagLine = 4,
    FeatureLine = 5,
    RuleLine = 6,
    BackgroundLine = 7,
    ScenarioLine = 8,
    ExamplesLine = 9,
    StepLine = 10,
    DocStringSeparator = 11,
    TableRow = 12,
    Language = 13,
    Other = 14
}
export declare enum RuleType {
    None = 0,
    _EOF = 1,// #EOF
    _Empty = 2,// #Empty
    _Comment = 3,// #Comment
    _TagLine = 4,// #TagLine
    _FeatureLine = 5,// #FeatureLine
    _RuleLine = 6,// #RuleLine
    _BackgroundLine = 7,// #BackgroundLine
    _ScenarioLine = 8,// #ScenarioLine
    _ExamplesLine = 9,// #ExamplesLine
    _StepLine = 10,// #StepLine
    _DocStringSeparator = 11,// #DocStringSeparator
    _TableRow = 12,// #TableRow
    _Language = 13,// #Language
    _Other = 14,// #Other
    GherkinDocument = 15,// GherkinDocument! := Feature?
    Feature = 16,// Feature! := FeatureHeader Background? ScenarioDefinition* Rule*
    FeatureHeader = 17,// FeatureHeader! := #Language? Tags? #FeatureLine DescriptionHelper
    Rule = 18,// Rule! := RuleHeader Background? ScenarioDefinition*
    RuleHeader = 19,// RuleHeader! := Tags? #RuleLine DescriptionHelper
    Background = 20,// Background! := #BackgroundLine DescriptionHelper Step*
    ScenarioDefinition = 21,// ScenarioDefinition! [#Empty|#Comment|#TagLine->#ScenarioLine] := Tags? Scenario
    Scenario = 22,// Scenario! := #ScenarioLine DescriptionHelper Step* ExamplesDefinition*
    ExamplesDefinition = 23,// ExamplesDefinition! [#Empty|#Comment|#TagLine->#ExamplesLine] := Tags? Examples
    Examples = 24,// Examples! := #ExamplesLine DescriptionHelper ExamplesTable?
    ExamplesTable = 25,// ExamplesTable! := #TableRow #TableRow*
    Step = 26,// Step! := #StepLine StepArg?
    StepArg = 27,// StepArg := (DataTable | DocString)
    DataTable = 28,// DataTable! := #TableRow+
    DocString = 29,// DocString! := #DocStringSeparator #Other* #DocStringSeparator
    Tags = 30,// Tags! := #TagLine+
    DescriptionHelper = 31,// DescriptionHelper := #Empty* Description?
    Description = 32
}
export default class Parser<AstNode> {
    private readonly builder;
    private readonly tokenMatcher;
    stopAtFirstError: boolean;
    private context;
    constructor(builder: IAstBuilder<AstNode, TokenType, RuleType>, tokenMatcher: ITokenMatcher<TokenType>);
    parse(gherkinSource: string): messages.GherkinDocument;
    private addError;
    private startRule;
    private endRule;
    private build;
    private getResult;
    private handleAstError;
    private handleExternalError;
    private readToken;
    private matchToken;
    private matchTokenAt_0;
    private matchTokenAt_1;
    private matchTokenAt_2;
    private matchTokenAt_3;
    private matchTokenAt_4;
    private matchTokenAt_5;
    private matchTokenAt_6;
    private matchTokenAt_7;
    private matchTokenAt_8;
    private matchTokenAt_9;
    private matchTokenAt_10;
    private matchTokenAt_11;
    private matchTokenAt_12;
    private matchTokenAt_13;
    private matchTokenAt_14;
    private matchTokenAt_15;
    private matchTokenAt_16;
    private matchTokenAt_17;
    private matchTokenAt_18;
    private matchTokenAt_19;
    private matchTokenAt_20;
    private matchTokenAt_21;
    private matchTokenAt_22;
    private matchTokenAt_23;
    private matchTokenAt_24;
    private matchTokenAt_25;
    private matchTokenAt_26;
    private matchTokenAt_27;
    private matchTokenAt_28;
    private matchTokenAt_29;
    private matchTokenAt_30;
    private matchTokenAt_31;
    private matchTokenAt_32;
    private matchTokenAt_33;
    private matchTokenAt_35;
    private matchTokenAt_36;
    private matchTokenAt_37;
    private matchTokenAt_38;
    private matchTokenAt_39;
    private matchTokenAt_40;
    private matchTokenAt_41;
    private matchTokenAt_42;
    private match_EOF;
    private match_Empty;
    private match_Comment;
    private match_TagLine;
    private match_FeatureLine;
    private match_RuleLine;
    private match_BackgroundLine;
    private match_ScenarioLine;
    private match_ExamplesLine;
    private match_StepLine;
    private match_DocStringSeparator;
    private match_TableRow;
    private match_Language;
    private match_Other;
    private lookahead_0;
    private lookahead_1;
}
//# sourceMappingURL=Parser.d.ts.map