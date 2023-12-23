# PlantD-Studio

[![Release Docker image to GitHub Container Registry](https://github.com/CarnegieMellon-PlantD/PlantD-Studio/actions/workflows/release-ghcr.yaml/badge.svg)](https://github.com/CarnegieMellon-PlantD/PlantD-Studio/actions/workflows/release-ghcr.yaml)
![GitHub License](https://img.shields.io/github/license/CarnegieMellon-PlantD/PlantD-Studio?label=License)

Web-based management console for PlantD.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) (`>= 18.0`)
- [Yarn](https://yarnpkg.com/)

### CLI Commands

#### Install dependencies

```shell
yarn install
```

#### Start the development server

```shell
yarn start
```

This command will start the development server and open up a browser window. Changes are reflected live without having to restart the server.

#### Build

```shell
yarn build
```

This command builds the entire application into the `build` directory.

#### Analyze the bundle

```shell
yarn build:analyze
```

This command builds the entire application and open up a browser window to visualize the size of each module.

#### Run tests

```shell
yarn test
```

#### Type check

```shell
# Type check
yarn tsc
```

#### Linter and formatter

```shell
# ESLint (w/o, w/ auto-fix)
yarn eslint
yarn eslint:fix

# Stylelint (w/o, w/ auto-fix)
yarn stylelint
yarn stylelint:fix

# Prettier (w/o, w/ auto-fix)
yarn prettier
yarn prettier:fix

# All linters (w/o, w/ auto-fix)
yarn lint
yarn lint:fix
```

Note that linters will run automatically before committing. Errors that are not auto-fixable will abort the commit process.

### Internationalization (i18n)

This project uses [react-i18next](https://react.i18next.com/) and [ICU message syntax](https://github.com/i18next/i18next-icu) for internationalization. See [`src/i18n/index.ts`](src/i18n/index.ts) for more details.

To extract messages from source code, run

```shell
yarn scan-i18n
```

This command will extract messages from source code and generate a JSON file in `public/locales/<lang>/translation.json` for each language.

### Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages and enforces it using [commitlint](https://commitlint.js.org/). To make sure your commit messages are valid, run

```shell
yarn commit
```

to commit your changes. It will launch a CLI wizard driven by [commitizen](https://commitizen.github.io/cz-cli/) to help you generate a valid commit message.

### Release

This project uses GitHub Actions as our CI/CD pipeline and to release Docker images to GitHub Container Registry. See [`.github/workflows/release-ghcr.yaml`](.github/workflows/release-ghcr.yaml) for more details.

To release a new version, run the following command:

```shell
# Automatically determine the next version number
yarn release

# Specify sub-version number to bump
yarn release --release-as=<major|minor|patch>
```

This command will run [standard-version](https://github.com/conventional-changelog/standard-version) to bump the version number, generate a changelog, and create a git tag.

Then, follow the instructions to push the git tag and the workflow will be triggered automatically. The output Docker image will be tagged with the same version number as the git tag.

### References

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Ant Design](https://ant.design/)
- [AntV](https://ant-design-charts.antgroup.com/en)
