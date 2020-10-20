function checkDuplicateItem(array){
    array = array.filter((array, index, self) =>
    index === self.findIndex((t) => (
      t.id === array.id
    ))
  )
  return array;
}

module.exports = {checkDuplicateItem};