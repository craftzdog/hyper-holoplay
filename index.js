exports.decorateTerm = (Term, { React, notify }) => {
  const { init, update } = require('./renderer')

  return class extends React.Component {
    constructor(props, context) {
      super(props, context)
      this._div = null
      this._holo = null
    }

    _onDecorated = term => {
      if (this.props.onDecorated) this.props.onDecorated(term)
      this._div = term ? term.termRef : null
      this._initHolo()
    }

    _initHolo() {
      this._holo = init(this._div)
      window.requestAnimationFrame(this._drawFrame)
    }

    // Draw the next frame in the particle simulation.
    _drawFrame = () => {
      update(this._holo)
      window.requestAnimationFrame(this._drawFrame)
    }

    render() {
      // Return the default Term component with our custom onTerminal closure
      // setting up and managing the particle effects.
      return React.createElement(
        Term,
        Object.assign({}, this.props, {
          onDecorated: this._onDecorated
        })
      )
    }
  }
}
