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

if (argv.h || argv.help) {
  showHelp();
  process.exit();
}

if (argv.v || argv.version) {
  await showVersion();
  process.exit();
}

const urlInput = argv.web || (await question(chalk.cyan("URL: ")));

if (!isValidUrl({ url: urlInput })) {
  echo(chalk.yellow("A valid URL is required to continue."));
  process.exit();
}

const url = isValidUrl({ url: urlInput, extract: true });

const data = await spinner("Fetching data...", async () => {
  const { data: res, error } = await useFetcher({ url });

  if (error) {
    echo(chalk.red(error));
    process.exit();
  }

  if (!res.length) {
    echo(chalk.yellow("Wayback Machine has not archived that URL."));
    process.exit();
  }

  return res;
});

const year = await getAndValidateYear({ data });

const newUrl = await spinner("Generating URL...", async () => {
  const { data: res, error } = await useFetcher({ url, year });

  if (error) {
    echo(chalk.red(error));
    process.exit();
  }

  if (!Array.isArray(res) || res.length < 2) {
    echo(chalk.red("Could not generate URL. Please try again."));
    process.exit();
  }

  return res;
});

const timestamp = newUrl[1][1];
const urlToShow = `https://web.archive.org/web/${timestamp}if_/http://${url}`;

await openUrl({ url: urlToShow }, argv);

echo(urlToShow);
