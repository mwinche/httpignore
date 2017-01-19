const NODE_MODULES = 'node_modules';

const prefixFiles = file => item => file ?
  (NODE_MODULES + '/' + file + '/' + item) :
  item;

module.exports = () => {
  const files = [];

  return {
    addModule(file, list){
      files.push.apply(files, list.map(prefixFiles(file)));
    },
    files(){
      return files.slice()
    }
  };
};
