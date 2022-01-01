exports.onRendererWindow = () => {
  const { run } = require('./renderer')
  setTimeout(run, 2000)
}
