// copied from babel: https://github.com/babel/babel/blob/088846a3479375a51d71084cb4fd70ef8fa21d29/src/babel/helpers/code-frame.js
import jsTokens    from "js-tokens";
import esutils     from "esutils";
import chalk       from "chalk";
import lineNumbers from "line-numbers";
import repeating   from "repeating";
import SourceCode  from './source-code';

var debug = require('debug')('castborg:CodeFrame');


var defs = {
  string:     chalk.red,
  punctuator: chalk.bold,
  curly:      chalk.green,
  parens:     chalk.blue.bold,
  square:     chalk.yellow,
  keyword:    chalk.cyan,
  number:     chalk.magenta,
  regex:      chalk.magenta,
  comment:    chalk.grey,
  invalid:    chalk.inverse
};

const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

function getTokenType(match) {
  var token = jsTokens.matchToToken(match);
  if (token.type === "name" && esutils.keyword.isReservedWordES6(token.value)) {
    return "keyword";
  }

  if (token.type === "punctuator") {
    switch (token.value) {
      case "{":
      case "}":
        return "curly";
      case "(":
      case ")":
        return "parens";
      case "[":
      case "]":
        return "square";
    }
  }

  return token.type;
}

function highlight(text) {
  if (!text) {
    return;
  }
  return text.replace(jsTokens, function (...args) {
    var type = getTokenType(args);
    var colorize = defs[type];
    if (colorize) {
      return args[0].split(NEWLINE).map(str => colorize(str)).join("\n");
    } else {
      return args[0];
    }
  });
}

var codeFrame = function (lines, lineNumber, colNumber) {
  colNumber = Math.max(colNumber, 0);

  if (chalk.supportsColor) {
    lines = highlight(lines);
  }

  if (!lines) {
    return;
  }

  lines = lines.split(NEWLINE);

  var start = Math.max(lineNumber - 3, 0);
  var end   = Math.min(lines.length, lineNumber + 3);

  if (!lineNumber && !colNumber) {
    start = 0;
    end = lines.length;
  }

  return lineNumbers(lines.slice(start, end), {
    start: start + 1,
    before: "  ",
    after: " | ",
    transform(params) {
      if (params.number !== lineNumber) {
        return;
      }
      if (colNumber) {
        // jscs:disable maximumLineLength
        params.line += `\n${params.before}${repeating(" ", params.width)}${params.after}${repeating(" ", colNumber - 1)}^`;
        // jscs:enable maximumLineLength
      }
      params.before = params.before.replace(/^./, ">");
    }
  }).join("\n");
};

export function hightLightCode(name, obj) {
  if (!name) {
    obj = name;
    name = 'code';
  }

  // from code
  var code = '';
  if (typeof obj === 'string') {
    code = obj;
  } else if (obj instanceof SourceCode) {
    // from source-code
    code = obj.code;
  } else if (typeof obj === 'object') {
    // from AST (we hope)
    try {
      var source_code = new SourceCode({ ast: obj });
      code = source_code.code;
    } catch (e) {
      debug('\nError hightLightCode - name: "' + name + '"');
      debug(e.message);
      debug(hightLightAST('AST ERROR: ' + name, obj, 2));
      debug('');
      return 'Error hightLightCode ^^^';
    }
  }

  return chalk.gray('\n-- [' + chalk.bold(name) + '] --- ') + '\n' +
    codeFrame(code) + '\n' +
    chalk.gray('-- [/' + chalk.bold(name) + '] --\n');
}

export function hightLightAST(name, ast, depth) {
  var util = require('util');

  // no name, so its an ast. call hightLightAST(ast, depth);
  if (!depth) {
    depth = ast;
    ast = name;
    name = 'AST';
  }

  return chalk.gray('\n-- [' + chalk.bold(name) + '] --- ') + '\n' +
    util.inspect(ast, {
      showHidden: false,
      depth: depth || 1,
      colors: true
    }) + '\n' +
    chalk.gray('-- [/' + chalk.bold(name) + '] --\n');
}

export default hightLightCode;
