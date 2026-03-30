export const getAndValidateYear = async ({ data, year }) => {
  let yearSet = new Set();

  // save all timestamps into years[]
  for (let i = 1; i < data.length; i++) {
    const timestamp = data[i][1];
    // match first 4 digits 2025XXXXXXXXXX
    const match = timestamp.match(/^\d{4}/g);

    if (match) {
      yearSet.add(match[0]);
    }
  }

  const years = Array.from(yearSet).sort();

  if (year) {
    const yearStr = String(year);

    if (!years.includes(yearStr)) {
      echo(chalk.yellow(`Year ${year} is not available in the archive.`));
      echo(chalk.cyan(`Available years: ${years.join(",")}`));
      process.exit(1);
    }

    echo(chalk.green(`Using year: ${year}`));
    return yearStr;
  }

  echo(chalk.cyan("Available years:"), years);

  const date = new Date();

  let yearInput = (await question(chalk.cyan("Year: "))) || date.getFullYear();
  if (yearInput < years[0]) {
    echo(chalk.yellow(`Year ${yearInput} not found. Using ${years[0]}.`));
    yearInput = years[0];
  }

  if (yearInput > years.at(-1)) {
    echo(
      chalk.yellow(
        `Year ${yearInput} exceeds available data. Using ${years.at(-1)}.`,
      ),
    );
    yearInput = years.at(-1);
  }

  return yearInput;
};
