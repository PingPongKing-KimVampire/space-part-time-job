const toggleItemInList = (list: string[], target: string) => {
  if (list.includes(target))
    return list.filter((element) => element !== target);
  return list.concat(target);
};

export default toggleItemInList;
