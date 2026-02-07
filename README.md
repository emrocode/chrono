## Chrono

Wayback Machine CLI Link Generator. Get archive URLs fast, right from the terminal.

### Usage

```bash
npx @emrocode/chrono [options]
```

### Options

```text
--web=<URL>    set the base URL for monitoring
--open, -o     open in a browser
--version, -v  print current chrono version
--help, -h     print help
```

### Example

```bash
npx @emrocode/chrono --web=https://github.com/ --open
```

### Built with

- [zx] - A tool for writing better scripts.
- [Wayback Machine API] - Internet Archive's snapshots.

[zx]: https://google.github.io/zx
[Wayback Machine API]: https://archive.org/help/wayback_api.php
