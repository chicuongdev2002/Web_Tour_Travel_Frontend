import didYouMean from "didyoumean";

const findInList = (item, list) => {
  return didYouMean(item, list);
};

export default findInList;
