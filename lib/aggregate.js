module.exports = () => {
  const files = [];

  return {
    addFile(file, list){
      files.push.apply(files, list);
    },
    files(){
      return files.slice()
    }
  };
};
