'use strict';

const {parseSync} = require('@babel/core');
const t = require('@babel/types');
const upstream = require('@react-native/metro-babel-transformer');
const crypto = require('crypto');
const fs = require('fs');

let traverse = require('@babel/traverse');
if (typeof traverse === 'object' && traverse.default) {
  traverse = traverse.default;
}

const SAFE_HELPER = `
function _interopRequireWildcard(e, t) {
  if (!t && e && e.__esModule) {
    return e;
  }
  if (e === null || typeof e !== "object" && typeof e !== "function") {
    var empty = {};
    empty["default"] = e;
    return empty;
  }
  var n = {};
  for (var k in e) {
    if (k !== "default" && Object.prototype.hasOwnProperty.call(e, k)) {
      n[k] = e[k];
    }
  }
  n["default"] = e;
  return n;
}
`;

const safeHelperAst = parseSync(SAFE_HELPER, {
  filename: 'interop-safe.js',
  babelrc: false,
  configFile: false,
  ast: true,
  sourceType: 'script',
}).program.body[0];

function rewriteAst(ast) {
  traverse(ast, {
    FunctionDeclaration(path) {
      if (path.node.id && path.node.id.name === '_interopRequireWildcard') {
        path.replaceWith(t.cloneNode(safeHelperAst, true));
        path.skip();
      }
    },
    FunctionExpression(path) {
      if (path.node.id && path.node.id.name === '_interopRequireWildcard') {
        const expr = t.functionExpression(
          t.identifier('_interopRequireWildcard'),
          t.cloneNode(safeHelperAst.params, true),
          t.cloneNode(safeHelperAst.body, true),
          false,
          false,
        );
        path.replaceWith(expr);
        path.skip();
      }
    },
    MemberExpression(path) {
      const obj = path.node.object;
      if (
        obj.type === 'ObjectExpression' &&
        obj.properties.length === 0 &&
        !path.node.computed &&
        path.node.property.type === 'Identifier' &&
        path.node.property.name === 'hasOwnProperty'
      ) {
        path.get('object').replaceWith(
          t.memberExpression(t.identifier('Object'), t.identifier('prototype')),
        );
      }
    },
  });
}

module.exports.transform = function transform(args) {
  const result = upstream.transform(args);
  if (result && result.ast) {
    rewriteAst(result.ast);
  }
  return result;
};

module.exports.getCacheKey = function getCacheKey() {
  const key = crypto.createHash('md5');
  key.update(upstream.getCacheKey());
  key.update(fs.readFileSync(__filename));
  return key.digest('hex');
};
