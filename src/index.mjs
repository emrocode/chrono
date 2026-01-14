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
const url = urlInput.replace(/^(?:https?:\/\/(www\.))?|\s+/g, "");

if (!isValidUrl({ url })) {
  echo(chalk.yellow("A valid URL is required to continue."));
  process.exit();
}

const data = await spinner("Fetching data...", async () => {
  const res = await useFetcher({ url });

  if (res.status === "timeout") {
    echo(chalk.red(res.message));
    process.exit();
  }

  return res;
});

if (!data.length) {
  echo(chalk.yellow("Wayback Machine has not archived that URL."));
  process.exit();
}

const year = await getAndValidateYear({ data });

const newUrl = await spinner("Generating URL...", async () => {
  const res = await useFetcher({ url, year });

  if (res.status === "timeout") {
    echo(chalk.red(res.message));
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
