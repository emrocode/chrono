#!/usr/bin/env node

import "zx/globals";
import {
  showHelp,
  showVersion,
  isValidUrl,
  useFetcher,
  getAndValidateYear,
  generateUrl,
} from "./utils/index.mjs";

const MIN_VALID_RESPONSE_LENGTH = 2;

const exitWithError = (message, exitCode = 1) => {
  echo(chalk.red(message));
  process.exit(exitCode);
};

void (async function main() {
  let unknownArgs = new Set();
  const argv = minimist(process.argv.slice(2), {
    string: ["web", "year"],
    boolean: ["help", "version", "open"],
    alias: {
      h: "help",
      v: "version",
      o: "open",
    },
    unknown: (arg) => {
      if (!unknownArgs.has(arg)) {
        unknownArgs.add(arg);
        echo(
          chalk.yellow(
            `Unknown argument: '${arg}'.\nUse -h to see available options.`,
          ),
        );
        return false;
      }
    },
  });

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

    if (error) exitWithError(error);

    if (!res.length) {
      echo(chalk.yellow("Wayback Machine has not archived that URL."));
      process.exit(1);
    }

    return res;
  });

  const year = await getAndValidateYear({ data, year: argv.year });

  const newUrl = await spinner("Generating URL...", async () => {
    const { data: res, error } = await useFetcher({ url, year });

    if (error) exitWithError(error);

    if (!Array.isArray(res) || res.length < MIN_VALID_RESPONSE_LENGTH) {
      exitWithError("Could not generate URL. Please try again.");
    }

    return res;
  });

  const timestamp = newUrl[1]?.[1];
  if (!timestamp) exitWithError("Invalid timestamp received from API.");

  await generateUrl({ timestamp, urlInput, url }, argv);
})();
