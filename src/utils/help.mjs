export const showHelp = () => {
  echo`${chalk.bold("Chrono")}\n  A Wayback Machine CLI Link Generator\n\n${chalk.bold("Usage")}\n  npx -- @emrocode/chrono [options]\n\n${chalk.bold("Options")}\n  --help, -h    print help\n  --open, -o    open in a browser\n  --web=<URL>   set the base URL for monitoring`;
};
