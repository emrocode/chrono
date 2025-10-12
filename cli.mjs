#!/usr/bin/env zx

import "zx/globals";
import { createRequire } from "module";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const packageRoot = dirname(require.resolve("./package.json"));
const indexPath = join(packageRoot, "src", "index.mjs");

cd(packageRoot);

await import(indexPath);
