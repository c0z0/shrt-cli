#! /usr/bin/env node

const {h, render, renderToString} = require('ink')
const meow = require('meow')
const clipboardy = require('clipboardy')

const App = require('./app')
const {isURL} = require('./utils')

const cli = meow(
  `
  Usage
    $ shrt <url>
    
    If no url is provided it will look in the clipboard

    Options
      --noClipboard, -C  Do not attempt to copy URL to clipboard
`,
  {
    flags: {
      noClipboard: {
        alias: 'C',
        type: 'boolean',
      },
    },
  },
)

let unmount

const onError = () => {
  unmount()
  process.exit(1)
}

const onExit = () => {
  unmount()
  process.exit()
}

const url = cli.input.length > 0 ? cli.input[0] : clipboardy.readSync()
const fromClipboard = cli.input.length === 0

if (!url || !isURL(url)) {
  process.stdout.write(
    renderToString(
      <App.Error
        message={
          url && !fromClipboard
            ? `Invalid URL:  ${url}`
            : 'URL argument is required'
        }
      />,
    ),
  )
  process.exit(1)
}

unmount = render(
  <App
    onExit={onExit}
    onError={onError}
    url={url}
    fromClipboard={fromClipboard}
    copyToClipboard={!cli.flags.noClipboard}
  />,
)
