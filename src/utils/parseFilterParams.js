const parseBoolean = (string) => {
  const booleanStringType = ['true', 'false'];
  if (!booleanStringType.includes(string)) return;
  return string === 'true' ? true : false;
};

const parseContactType = (type) => {
  const isString = typeof string === 'string';
  if (!isString) return type;
  const contactType = ['work', 'home', 'personal'];
  if (contactType.includes(type)) return type;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseBoolean(isFavourite);
  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
