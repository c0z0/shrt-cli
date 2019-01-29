const fetch = require('isomorphic-fetch')

async function shorten(url) {
  const res = await fetch('https://s.cserdean.me/api/sh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({url}),
  })

  if (!res.ok) throw new Error('An error has occurred')

  return 'https://s.cserdean.me/' + (await res.json()).id
}

function isURL(url) {
  const urlNoProtocolRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi

  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

  return urlRegex.test(url) || urlNoProtocolRegex.test(url)
}
const themeColor = '#FE51BB'

module.exports = {isURL, shorten, themeColor}
