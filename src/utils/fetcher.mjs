export const useFetcher = async ({ url, year, ms = 120000 }) => {
  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, ms);

  try {
    // queries from https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server
    // use timestamp:4 (get 1 capture per year) 2025XXXXXXXXXX
    const baseUrl = new URL("https://web.archive.org/cdx/search/cdx");
    baseUrl.searchParams.set("url", url);
    baseUrl.searchParams.set("output", "json");
    baseUrl.searchParams.append("filter", "mimetype:text/html");
    baseUrl.searchParams.append("filter", "statuscode:200");

    if (year) {
      baseUrl.searchParams.set("from", year);
      baseUrl.searchParams.set("to", year);
      baseUrl.searchParams.set("fastLatest", "true");
      baseUrl.searchParams.set("limit", "-1");
    } else {
      baseUrl.searchParams.set("collapse", "timestamp:4");
    }

    const res = await fetch(baseUrl, { signal });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        data: null,
        error: `Error ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();

    return { data, error: null };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      return {
        data: null,
        error: "Timeout: Request was cancelled.",
      };
    }

    return { data: null, error: error.message };
  }
};
