import { SORT_ORDER } from '../constants/index.js';

export const parseSortOrder = (sortOrder) => {
  const sortOrderArrParams = [SORT_ORDER.ASC, SORT_ORDER.DESC];
  if (sortOrderArrParams.includes(sortOrder)) return sortOrder;
  return SORT_ORDER.ASC;
};

export const parseSortBy = (sortBy) => {
  const sortByArr = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
    'createdAt',
    'updatedAt',
  ];
  if (sortByArr.includes(sortBy)) return sortBy;
  return '_id';
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;
  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
