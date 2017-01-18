const NODE_MODULES = 'node_modules';

module.exports = () => {
  const files = [];

  return {
    addModule(file, list){
      files.push.apply(files, list.map(item => file ? (NODE_MODULES + '/' + file + '/' + item) : item ));
    },
    files(){
      return files.slice()
    }
  };
};
