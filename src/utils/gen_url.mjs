import { openUrl } from "./open.mjs";

export const generateUrl = async ({ timestamp, urlInput, url }, argv) => {
  const protocol = urlInput.toLowerCase().startsWith("https://")
    ? "https://"
    : "http://";
  const urlToShow = `https://web.archive.org/web/${timestamp}id_/${protocol}${url}`;

  await openUrl({ url: urlToShow }, argv);

  echo(urlToShow);
};
