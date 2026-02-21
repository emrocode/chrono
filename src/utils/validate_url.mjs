export const isValidUrl = ({ url, extract = false }) => {
  const REGEXP_URL =
    /[a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

  if (extract) return url.match(REGEXP_URL);

  return REGEXP_URL.test(url);
};
