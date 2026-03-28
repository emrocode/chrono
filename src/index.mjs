#!/usr/bin/env node

import "zx/globals";
import {
  showHelp,
  showVersion,
  isValidUrl,
  useFetcher,
  getAndValidateYear,
  openUrl,
} from "./utils/index.mjs";

const MIN_VALID_RESPONSE_LENGTH = 2;

const handleError = (message, exitCode = 1) => {
  echo(chalk.red(message));
  process.exit(exitCode);
};

if (argv.h || argv.help) {
  showHelp();
  process.exit(0);
}

if (argv.v || argv.version) {
  await showVersion();
  process.exit(0);
}

const urlInput = argv.web || (await question(chalk.cyan("URL: ")));
if (!isValidUrl({ url: urlInput })) {
  echo(chalk.yellow("A valid URL is required to continue."));
  process.exit(1);
}

const url = isValidUrl({ url: urlInput, extract: true });
if (!url) {
  echo(chalk.yellow("Could not extract a valid URL."));
  process.exit(1);
}

const data = await spinner("Fetching data...", async () => {
  const { data: res, error } = await useFetcher({ url });

  if (error) return handleError(error);

  if (!res.length) {
    echo(chalk.yellow("Wayback Machine has not archived that URL."));
    process.exit(1);
  }

  return res;
});

const year = await getAndValidateYear({ data, year: argv.year });

const newUrl = await spinner("Generating URL...", async () => {
  const { data: res, error } = await useFetcher({ url, year });

  if (error) return handleError(error);

  if (!Array.isArray(res) || res.length < MIN_VALID_RESPONSE_LENGTH) {
    handleError("Could not generate URL. Please try again.");
  }

  return res;
});

const timestamp = newUrl[1]?.[1];

if (!timestamp) {
  handleError("Invalid timestamp received from API.");
}

const urlToShow = `https://web.archive.org/web/${timestamp}id_/http://${url}`;

await openUrl({ url: urlToShow }, argv);

echo(urlToShow);
