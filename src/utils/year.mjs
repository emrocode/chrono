export const getAndValidateYear = async ({ data }) => {
  let years = [];

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

  const date = new Date();
  let yearInput = (await question(chalk.cyan("Year: "))) || date.getFullYear();

  if (yearInput < years[0]) {
    echo(chalk.yellow(`Year ${yearInput} not found. Using ${years[0]}.`));
    yearInput = years[0];
  }

  if (yearInput > years.at(-1)) {
    echo(chalk.yellow(`Year ${yearInput} not found. Using ${years.at(-1)}.`));
    yearInput = years.at(-1);
  }

  return yearInput;
};
