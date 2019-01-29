const {h, Component, Color, Fragment} = require('ink')
const TextInput = require('ink-text-input')
const Spinner = require('ink-spinner')
const Link = require('ink-link')
const meow = require('meow')
const clipboardy = require('clipboardy')

const {shorten, themeColor} = require('./utils')

class App extends Component {
  constructor(p) {
    super(p)

    this.state = {
      url: '',
      error: null,
      loading: true,
    }
  }

  renderForm() {
    const {url} = this.state
    return (
      <div>
        Enter your url:{' '}
        <TextInput value={url} onChange={url => this.setState({url})} />
      </div>
    )
  }

  renderError(errorString) {
    setTimeout(this.props.onError, 500)
    return (
      <Fragment>
        <Color bgHex="#f00">ERROR</Color> <Color red>{errorString}</Color>
      </Fragment>
    )
  }

  componentDidUpdate() {
    if (this.state.error) {
      return setTimeout(this.props.onError, 0)
    }

    if (this.state.short) {
      return setTimeout(this.props.onExit, 0)
    }
  }

  async componentDidMount() {
    const {url, copyToClipboard} = this.props

    try {
      const short = await shorten(url)
      if (copyToClipboard) clipboardy.writeSync(short)
      this.setState({loading: false, short})
    } catch (err) {
      this.setState({loading: false, error: err.message})
    }
  }

  render() {
    const {error, loading, short} = this.state
    const {url, copyToClipboard} = this.props

    if (error) {
      return this.renderError(error)
    }

    if (loading)
      return (
        <div>
          <Spinner hex={themeColor} /> Shortening{' '}
          <Link url={url}>
            <Color hex={themeColor}>{url}</Color>
          </Link>
          <Color gray> [from clipboard]</Color>
        </div>
      )

    return (
      <Fragment>
        <Color hex={themeColor}>✓</Color> Shortened:{' '}
        <Link url={short}>
          <Color hex={themeColor}>{short}</Color>
        </Link>
        {copyToClipboard && <Color gray> [in clipboard]</Color>}
      </Fragment>
    )
  }
}

App.Error = message => (
  <div>
    <Color bgHex="#f00">ERROR</Color> <Color red>{message}</Color>
  </div>
)
module.exports = App
