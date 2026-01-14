export const showHelp = () => {
  echo(`
  ${chalk.bold("Chrono")}
    A Wayback Machine CLI Link Generator

  ${chalk.bold("Usage")}
    chrono [options]

  ${chalk.bold("Options")}
    --web=<URL>    set the base URL for monitoring
    --open, -o     open in a browser
    --version, -v  print current chrono version
    --help, -h     print help
`);
};
