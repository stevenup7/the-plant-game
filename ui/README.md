# ES6 with require javascript template project

This project comes from me wanting to see how hard the switch from gulp to npm scripts would be.

Assumes and app.js in src folder as base for project.

## Building the Project

```bash
npm run build
```

this will call several other npm scripts
 * browserify - for require
 * babel - build es6 to es2015
 * build_cleanup - remove working files

### Autobuilding project

```bash
npm run watch
```

this will also run lint

## TODO
testing (karma)
e2e (protractor)

coding standards (jscs)