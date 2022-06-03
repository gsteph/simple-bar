import * as Error from './lib/components/error.jsx'
import * as Spaces from './lib/components/spaces/spaces.jsx'
import * as Process from './lib/components/spaces/process.jsx'
import * as Utils from './lib/utils'
import * as Settings from './lib/settings'
import * as Variables from './lib/styles/core/variables'
import * as Base from './lib/styles/core/base'

const refreshFrequency = false 

const settings = Settings.get()
const { yabaiPath = '/usr/local/bin/yabai', shell } = settings.global
const { processWidget } = settings.widgets

// const command = `python3 ~/git_tree/yabai_conf/yabai/app.py spaces`
//const command = `${shell} simple-bar/lib/scripts/init.sh ${yabaiPath}`
// const command = `curl -s 127.0.0.1:5000/all`
const command = (dispatch) =>
  fetch('http://127.0.0.1:41417/http://127.0.0.1:5000/all')
  .then(async (response) => {
    dispatch({ type: 'FETCH_SUCCEEDED', output: await response.json() });
  })

Utils.injectStyles('simple-bar-spaces-styles', [
  Variables.styles,
  Base.styles,
  Spaces.styles,
  Process.styles,
  Settings.styles,
  settings.customStyles.styles
])

const render = ({ output, error }) => {

  $.post("http://127.0.0.1:41417/http://127.0.0.1:5000/log", `${getTS()}000 spaces.jsx : renderStarted`)
  const baseClasses = Utils.classnames('simple-bar simple-bar--spaces', {
    'simple-bar--floating': settings.global.floatingBar,
    'simple-bar--no-bar-background': settings.global.noBarBg,
    'simple-bar--on-bottom': settings.global.bottomBar,
    'simple-bar--inline-spaces-options': settings.global.inlineSpacesOptions,
    'simple-bar--background-color-as-foreground': settings.global.spacesBackgroundColorAsForeground
  })

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Error in spaces.jsx', error)
    return <Error.Component type="error" classes={baseClasses} />
  }
  if (!output) return <Error.Component type="noOutput" classes={baseClasses} />
  // if (Utils.cleanupOutput(output) === 'yabaiError') {
  //   return <Error.Component type="yabaiError" classes={baseClasses} />
  // }

  const data = output
  console.log(data)
  if (!data) return <Error.Component type="noData" classes={baseClasses} />

  const { displays, shadow, SIP, spaces, windows } = data

  // const displayId = parseInt(window.location.pathname.replace('/', ''))
  // const displayIndex = displays.find((d) => d.id === displayId).index
  const displayIndex = 1

  const classes = Utils.classnames(baseClasses, { 'simple-bar--no-shadow': shadow !== 'on' })

  Utils.handleBarFocus()

  // return (
  //   <div className={classes}>
  //     <Spaces.Component spaces={spaces} windows={windows} SIP={SIP} displayIndex={displayIndex} />
  //     {processWidget && <Process.Component displayIndex={displayIndex} spaces={spaces} windows={windows} />}
  //     <Settings.Wrapper />
  //   </div>
  // )

  $.post("http://127.0.0.1:41417/http://127.0.0.1:5000/log", `${getTS()}000 spaces.jsx : renderFinished`)
  // fetch("http://127.0.0.1:5000/log", {data:"asdasd"})

  return (
    <div className={classes}>
      <Spaces.Component spaces={spaces} windows={windows} SIP={SIP} displayIndex={displayIndex} />
      <Settings.Wrapper />
    </div>
  )
}

const updateState = (event, previousState) => {
  $.post("http://127.0.0.1:41417/http://127.0.0.1:5000/log", `${getTS()}000 spaces.jsx : updateState`)
  if (event.type === "FETCH_SUCCEEDED") {
    return event;
  }
  return previousState
}

const getTS = () => {
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  return localISOTime.split("T")[1]
}

const afterRender = (domEl) => {
  console.log(`${getTS()} afterRender`)
}

export { command, refreshFrequency, render, updateState, afterRender }
