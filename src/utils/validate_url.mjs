export const isValidUrl = ({ url }) => {
  const REGEXP_URL =
    /[a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

  return REGEXP_URL.test(url);
};
