export const useFetcher = async ({ url, year, ms = 8000 }) => {
  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, ms);

  try {
    // queries from https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server
    // use timestamp:4 (get 1 capture per year) 2025XXXXXXXXXX
    const qParams = year
      ? `&from=${year}&to=${year}&output=json`
      : `&collapse=timestamp:4&output=json&filter=mimetype:text/html&filter=statuscode:200`;

    const res = await fetch(
      `${process.env.BASE_URL0}?url=${encodeURIComponent(url)}?${qParams}`,
      { signal },
    );

    // clear timeout on success
    clearTimeout(timeoutId);

    const json = res.json();

    return json;
  } catch (error) {
    // clear timeout on error
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      return {
        status: "timeout",
        message: "Request was cancelled due to timeout.",
      };
    }

    throw error;
  }
};
