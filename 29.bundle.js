(self["webpackJsonp"] = self["webpackJsonp"] || []).push([[29],{

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/less/less.js":
/*!************************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/less/less.js ***!
  \************************************************************************/
/*! exports provided: conf, language */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"conf\", function() { return conf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"language\", function() { return language; });\n/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\nvar conf = {\n    wordPattern: /(#?-?\\d*\\.\\d\\w*%?)|([@#!.:]?[\\w-?]+%?)|[@#!.]/g,\n    comments: {\n        blockComment: ['/*', '*/'],\n        lineComment: '//'\n    },\n    brackets: [\n        ['{', '}'],\n        ['[', ']'],\n        ['(', ')']\n    ],\n    autoClosingPairs: [\n        { open: '{', close: '}', notIn: ['string', 'comment'] },\n        { open: '[', close: ']', notIn: ['string', 'comment'] },\n        { open: '(', close: ')', notIn: ['string', 'comment'] },\n        { open: '\"', close: '\"', notIn: ['string', 'comment'] },\n        { open: \"'\", close: \"'\", notIn: ['string', 'comment'] }\n    ],\n    surroundingPairs: [\n        { open: '{', close: '}' },\n        { open: '[', close: ']' },\n        { open: '(', close: ')' },\n        { open: '\"', close: '\"' },\n        { open: \"'\", close: \"'\" }\n    ],\n    folding: {\n        markers: {\n            start: new RegExp('^\\\\s*\\\\/\\\\*\\\\s*#region\\\\b\\\\s*(.*?)\\\\s*\\\\*\\\\/'),\n            end: new RegExp('^\\\\s*\\\\/\\\\*\\\\s*#endregion\\\\b.*\\\\*\\\\/')\n        }\n    }\n};\nvar language = {\n    defaultToken: '',\n    tokenPostfix: '.less',\n    identifier: '-?-?([a-zA-Z]|(\\\\\\\\(([0-9a-fA-F]{1,6}\\\\s?)|[^[0-9a-fA-F])))([\\\\w\\\\-]|(\\\\\\\\(([0-9a-fA-F]{1,6}\\\\s?)|[^[0-9a-fA-F])))*',\n    identifierPlus: '-?-?([a-zA-Z:.]|(\\\\\\\\(([0-9a-fA-F]{1,6}\\\\s?)|[^[0-9a-fA-F])))([\\\\w\\\\-:.]|(\\\\\\\\(([0-9a-fA-F]{1,6}\\\\s?)|[^[0-9a-fA-F])))*',\n    brackets: [\n        { open: '{', close: '}', token: 'delimiter.curly' },\n        { open: '[', close: ']', token: 'delimiter.bracket' },\n        { open: '(', close: ')', token: 'delimiter.parenthesis' },\n        { open: '<', close: '>', token: 'delimiter.angle' }\n    ],\n    tokenizer: {\n        root: [\n            { include: '@nestedJSBegin' },\n            ['[ \\\\t\\\\r\\\\n]+', ''],\n            { include: '@comments' },\n            { include: '@keyword' },\n            { include: '@strings' },\n            { include: '@numbers' },\n            ['[*_]?[a-zA-Z\\\\-\\\\s]+(?=:.*(;|(\\\\\\\\$)))', 'attribute.name', '@attribute'],\n            ['url(\\\\-prefix)?\\\\(', { token: 'tag', next: '@urldeclaration' }],\n            ['[{}()\\\\[\\\\]]', '@brackets'],\n            ['[,:;]', 'delimiter'],\n            ['#@identifierPlus', 'tag.id'],\n            ['&', 'tag'],\n            ['\\\\.@identifierPlus(?=\\\\()', 'tag.class', '@attribute'],\n            ['\\\\.@identifierPlus', 'tag.class'],\n            ['@identifierPlus', 'tag'],\n            { include: '@operators' },\n            ['@(@identifier(?=[:,\\\\)]))', 'variable', '@attribute'],\n            ['@(@identifier)', 'variable'],\n            ['@', 'key', '@atRules']\n        ],\n        nestedJSBegin: [\n            ['``', 'delimiter.backtick'],\n            [\n                '`',\n                {\n                    token: 'delimiter.backtick',\n                    next: '@nestedJSEnd',\n                    nextEmbedded: 'text/javascript'\n                }\n            ]\n        ],\n        nestedJSEnd: [\n            [\n                '`',\n                {\n                    token: 'delimiter.backtick',\n                    next: '@pop',\n                    nextEmbedded: '@pop'\n                }\n            ]\n        ],\n        operators: [['[<>=\\\\+\\\\-\\\\*\\\\/\\\\^\\\\|\\\\~]', 'operator']],\n        keyword: [\n            [\n                '(@[\\\\s]*import|![\\\\s]*important|true|false|when|iscolor|isnumber|isstring|iskeyword|isurl|ispixel|ispercentage|isem|hue|saturation|lightness|alpha|lighten|darken|saturate|desaturate|fadein|fadeout|fade|spin|mix|round|ceil|floor|percentage)\\\\b',\n                'keyword'\n            ]\n        ],\n        urldeclaration: [\n            { include: '@strings' },\n            ['[^)\\r\\n]+', 'string'],\n            ['\\\\)', { token: 'tag', next: '@pop' }]\n        ],\n        attribute: [\n            { include: '@nestedJSBegin' },\n            { include: '@comments' },\n            { include: '@strings' },\n            { include: '@numbers' },\n            { include: '@keyword' },\n            ['[a-zA-Z\\\\-]+(?=\\\\()', 'attribute.value', '@attribute'],\n            ['>', 'operator', '@pop'],\n            ['@identifier', 'attribute.value'],\n            { include: '@operators' },\n            ['@(@identifier)', 'variable'],\n            ['[)\\\\}]', '@brackets', '@pop'],\n            ['[{}()\\\\[\\\\]>]', '@brackets'],\n            ['[;]', 'delimiter', '@pop'],\n            ['[,=:]', 'delimiter'],\n            ['\\\\s', ''],\n            ['.', 'attribute.value']\n        ],\n        comments: [\n            ['\\\\/\\\\*', 'comment', '@comment'],\n            ['\\\\/\\\\/+.*', 'comment']\n        ],\n        comment: [\n            ['\\\\*\\\\/', 'comment', '@pop'],\n            ['.', 'comment']\n        ],\n        numbers: [\n            [\n                '(\\\\d*\\\\.)?\\\\d+([eE][\\\\-+]?\\\\d+)?',\n                { token: 'attribute.value.number', next: '@units' }\n            ],\n            ['#[0-9a-fA-F_]+(?!\\\\w)', 'attribute.value.hex']\n        ],\n        units: [\n            [\n                '(em|ex|ch|rem|vmin|vmax|vw|vh|vm|cm|mm|in|px|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|%)?',\n                'attribute.value.unit',\n                '@pop'\n            ]\n        ],\n        strings: [\n            ['~?\"', { token: 'string.delimiter', next: '@stringsEndDoubleQuote' }],\n            [\"~?'\", { token: 'string.delimiter', next: '@stringsEndQuote' }]\n        ],\n        stringsEndDoubleQuote: [\n            ['\\\\\\\\\"', 'string'],\n            ['\"', { token: 'string.delimiter', next: '@popall' }],\n            ['.', 'string']\n        ],\n        stringsEndQuote: [\n            [\"\\\\\\\\'\", 'string'],\n            [\"'\", { token: 'string.delimiter', next: '@popall' }],\n            ['.', 'string']\n        ],\n        atRules: [\n            { include: '@comments' },\n            { include: '@strings' },\n            ['[()]', 'delimiter'],\n            ['[\\\\{;]', 'delimiter', '@pop'],\n            ['.', 'key']\n        ]\n    }\n};\n\n\n//# sourceURL=webpack:///./node_modules/monaco-editor/esm/vs/basic-languages/less/less.js?");

/***/ })

}]);