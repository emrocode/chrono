export const showVersion = async () => {
  const { version } = await fs.readJson("./package.json");
  echo(version);
};
