const fg = require('fast-glob');
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const JS_GLOBS = ['**/*.{js,jsx,ts,tsx}', '!**/node_modules/**', '!**/android/**/build/**', '!**/ios/**/build/**', '!**/dist/**'];
const OTHER_GLOBS = ['**/*.{json,css,html,xml,md}', '!**/node_modules/**', '!**/android/**/build/**', '!**/ios/**/build/**', '!**/dist/**'];
function stripJsTsComments(source, filename) {
  const isTs = filename.endsWith('.ts') || filename.endsWith('.tsx');
  const isJsx = filename.endsWith('.jsx') || filename.endsWith('.tsx');
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: [isTs && 'typescript', isJsx && 'jsx', 'classProperties', 'classPrivateProperties', 'classPrivateMethods', 'objectRestSpread', 'importAssertions'].filter(Boolean)
  });
  const {
    code
  } = generate(ast, {
    comments: false,
    compact: false
  }, source);
  return code;
}
function stripOtherComments(source, ext) {
  if (ext === '.json') {
    return source;
  }
  if (ext === '.css' || ext === '.xml' || ext === '.html') {
    return source.replace(/<!--([\s\S]*?)-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  }
  if (ext === '.md') {
    return source.replace(/<!--([\s\S]*?)-->/g, '');
  }
  return source;
}
(async () => {
  const jsFiles = await fg(JS_GLOBS, {
    dot: true
  });
  for (const file of jsFiles) {
    const abs = path.resolve(file);
    const src = fs.readFileSync(abs, 'utf8');
    try {
      const out = stripJsTsComments(src, abs);
      if (out !== src) fs.writeFileSync(abs, out, 'utf8');
    } catch (e) {}
  }
  const otherFiles = await fg(OTHER_GLOBS, {
    dot: true
  });
  for (const file of otherFiles) {
    const abs = path.resolve(file);
    const src = fs.readFileSync(abs, 'utf8');
    const ext = path.extname(abs).toLowerCase();
    const out = stripOtherComments(src, ext);
    if (out !== src) fs.writeFileSync(abs, out, 'utf8');
  }
})();