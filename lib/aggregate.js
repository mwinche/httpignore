const NODE_MODULES = 'node_modules';

const prefixFiles = file => item => file ?
  (NODE_MODULES + '/' + file + '/' + item) :
  item;

const filterLines = line => {
  const trimmed = line.trim();

  if(trimmed.length === 0){
    return false;
  }

  return trimmed[0] !== '#';
};

module.exports = () => {
  const files = [];

  return {
    addModule(file, list){
      files.push.apply(files, list
        .filter(filterLines)
        .map(prefixFiles(file))
      );
    },
    files(){
      return files.slice()
    }
  };
};
