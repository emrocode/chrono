import open, { apps } from "open";

export const openUrl = async ({ url }, argv) => {
  if (argv.open) {
    await open(url, {
      app: {
        name: apps.browserPrivate,
      },
    });
    return;
  }
};
