import { fileURLToPath } from "node:url";

const getVersionFromPath = async (relativePath) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pkgPath = path.resolve(__dirname, relativePath);
  const { version } = await fs.readJson(pkgPath);
  return version;
};

export const showVersion = async () => {
  try {
    return echo(await getVersionFromPath("../../package.json"));
  } catch {
    try {
      return echo(await getVersionFromPath("../package.json"));
    } catch {
      return echo("Unknown");
    }
  }
};
