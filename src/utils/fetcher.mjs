export const useFetcher = async ({ url, year, ms = 120000 }) => {
  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, ms);

  try {
    // queries from https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server
    // use timestamp:4 (get 1 capture per year) 2025XXXXXXXXXX
    const filters = "filter=mimetype:text/html&filter=statuscode:200";
    const commonParams = `output=json&${filters}`;
    const qParams = year
      ? `&from=${year}&to=${year}&fastLatest=true&limit=-1&${commonParams}`
      : `&collapse=timestamp:4&${commonParams}`;

    const res = await fetch(
      `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}?${qParams}`,
      { signal },
    );

    // clear timeout on success
    if (timeoutId) clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        data: null,
        error: `Error ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();

    return { data, error: null };
  } catch (error) {
    // clear timeout on error
    if (timeoutId) clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      return {
        data: null,
        error: "Timeout: Request was cancelled.",
      };
    }

    return { data: null, error: error.message };
  }
};
