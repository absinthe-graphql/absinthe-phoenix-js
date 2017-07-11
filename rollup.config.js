export default {
  entry: 'pkg/lib/index.js',
  dest: 'pkg/lib/absinthe-phoenix.umd.js',
  external: (x) => {
    console.log(x);
    return false;
  },
  format: 'umd',
  sourceMap: true,
  moduleName: 'absinthe-phoenix',
  onwarn
};

function onwarn(message) {
  const suppressed = [
    'UNRESOLVED_IMPORT',
    'THIS_IS_UNDEFINED'
  ];

  if (!suppressed.find(code => message.code === code)) {
    return console.warn(message.message);
  }
}