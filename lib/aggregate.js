module.exports = () => {
  const files = [];

  return {
    addModule(file, list){
      files.push.apply(files, list);
    },
    files(){
      return files.slice()
    }
  };
};
