#!/usr/bin/env node

import "zx/globals";
import {
  showHelp,
  useFetcher,
  getAndValidateYear,
  openUrl,
} from "./utils/index.mjs";

const argv = minimist(process.argv.slice(2), {
  string: ["web"],
  boolean: ["help", "open"],
  alias: {
    h: "help",
    o: "open",
  },
});

// show help as a priority
if (argv.help) {
  showHelp();
  process.exit(0);
}

const urlInput = argv.web || (await question(chalk.cyan("URL: ")));
const url = urlInput.replace(/^(?:https?:\/\/)?|\s+/g, "");

if (!url) {
  echo(chalk.yellow("A valid URL is required to continue."));
  process.exit(1);
}

const data = await spinner("Fetching data...", async () => {
  const res = await useFetcher({ url });

  if (res.status === "timeout") {
    echo(chalk.red(res.message));
    process.exit(2);
  }

  return res;
});

if (!data.length) {
  echo(chalk.yellow("Wayback Machine has not archived that URL."));
  process.exit(3);
}

const year = await getAndValidateYear({ data });

const newUrl = await spinner("Generating URL...", async () => {
  const res = await useFetcher({ url, year });

  if (res.status === "timeout") {
    echo(chalk.red(res.message));
    process.exit(4);
  }

  if (!Array.isArray(res) || res.length < 2) {
    echo(chalk.red("Could not generate snapshot URL. Please try again."));
    process.exit(5);
  }

  return res;
});

const timestamp = newUrl[1][1];
const urlToShow = `https://web.archive.org/web/${timestamp}if_/http://${url}`;

await openUrl({ url: urlToShow }, argv);

echo(urlToShow);
