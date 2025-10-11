#!/usr/bin/env node

import "dotenv/config";
import "zx/globals";
import { useFetcher } from "./utils/fetcher.mjs";

const argv = minimist(process.argv.slice(2), {
  string: ["web"]
});
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

if (data.length === 0) {
  echo(chalk.yellow("Wayback Machine has not archived that URL."));
  process.exit(3);
}

const years = [];

// save all timestamps into years[]
for (let i = 1; i < data.length; i++) {
  const timestamp = data[i][1];
  // match first 4 digits 2025XXXXXXXXXX
  const match = timestamp.match(/^\d{4}/g);

  if (match) {
    years.push(match[0]);
  }
}

echo(chalk.cyan("Available years:"), years);

const yearInput = await question(chalk.cyan("Year: "));
const date = new Date();
var year = yearInput || date.getFullYear();

if (year < years[0]) {
  echo(chalk.yellow(`Year ${year} not found. Using ${years[0]}.`));
  year = years[0];
}

if (year > years.at(-1)) {
  echo(chalk.yellow(`Year ${year} not found. Using ${years.at(-1)}.`));
  year = years.at(-1);
}

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
const urlToShow = `${process.env.BASE_URL1}/${timestamp}if_/http://${url}`;

echo(urlToShow);
