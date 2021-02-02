const path = require('path');
module.exports = {
  mode: 'production',
  entry: {
    'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
    'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
    'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
    'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
    'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
  },
  output: {
    globalObject: 'self',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
