export const showHelp = () => {
  echo(chalk.bold("Chrono"));
  echo("  A Wayback Machine CLI Link Generator\n");
  echo(chalk.bold("Usage"));
  echo("  chrono [options]\n");
  echo(chalk.bold("Options"));
  echo("  --web=<URL>      set the base URL for monitoring");
  echo("  --open, -o       open in a browser");
  echo("  --version, -v    print current chrono version");
  echo("  --help, -h       print help");
};
