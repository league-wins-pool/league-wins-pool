# Wins League

## Getting Started

1. [Install Meteor](https://www.meteor.com/install)
2. [Install NVM](https://github.com/nvm-sh/nvm)
3. `nvm install <version in .nvmrc>`
4. [Install Yarn](https://classic.yarnpkg.com/en/docs/install)
5. `yarn`
6. `yarn global add mup@1.4.6` for managing server deployments
7. `brew install gpg` for encrypting and decrypting server credentials


## Developing Locally

1. Launch the development environment:

    ```bash
    $ meteor
    ```

2. Open a browser to view the app:

    ```bash
    $ http://localhost:3000
    ```

3. Meteor automatically watches for changes and hot reloads the app.


### Updating Node packages

```bash
$ yarn
```


### Updating Meteor

1. Update `.nvmrc` with new Node version
2. `nvm install X.Y.Z`
3. `meteor update --release X.Y.Z`
4. Update `circle.yml` with Docker container that supports Node version



## Testing

### Running tests once

```
$ meteor npm run test
$ meteor npm run test-app
```

### Running tests during development

```
$ meteor npm run test-watch
$ meteor npm run test-app-watch
```

### Running acceptance tests

In one terminal:
```
$ meteor test --full-app --driver-package tmeasday:acceptance-test-driver
```

In another terminal:
```
$ ./tests/acceptance_run
```

We run these in two separate terminals so the acceptance tests don't wipe out the dev database.

### Running [Flow check](http://flowtype.org)

```
$ flow check --all
```

Note that Flow doesn't yet support TypeScript declarations so it will complain about a bunch of Meteor global variables.

### Other tips:

1. Change `describe()` to `describe.only()` or `it()` to `it.only()` to only run specific specs.


## Debugging

### Interactive Development Console

```
$ meteor shell
```

### View and Edit Client Documents

Open app in the browser and press Control + M. See [Mongol documentation](https://github.com/msavin/Mongol) for more.

### Database Admin

```
$ http://stackoverflow.com/questions/22020580/how-to-connect-mongodb-clients-to-local-meteor-mongodb
```

### Bundle Visualizing

```
$ meteor --extra-packages bundle-visualizer --production
```

### Meteor Package Dependencies

```
$ for p in `meteor list | grep '^[a-z]' | awk '{sub(/[+*]$/, "", $2); print $1"@"$2 }'`; do echo "$p"; meteor show "$p" | grep -E '^  [a-z]'; echo; done
```


## Migrations

Migrations are done with [percolate:migrations](https://github.com/percolatestudio/meteor-migrations).


## Deploying to Production

CircleCI automatically does this when tests pass.

If a change to `.deploy/production/mup.js` is needed, make sure to run `gpg -c mup.js` and commit the updated `mup.js.gpg`.
