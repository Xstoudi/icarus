import { useState, useEffect } from 'react'
import { formatBytes, eliteDateTime } from 'lib/format'
import { newWindow } from 'lib/window'
import { useSocket, eventListener, sendEvent } from 'lib/socket'
import Loader from 'components/loader'
import packageJson from '../../../package.json'

const defaultloadingStats = {
  loadingComplete: false,
  loadingInProgress: false,
  numberOfFiles: 0,
  numberOfLogLines: 0,
  numberOfEventsImported: 0,
  logSizeInBytes: 0,
  loadingTime: 0
}

export default function IndexPage () {
  const { connected } = useSocket()
  const [hostInfo, setHostInfo] = useState()
  const [loadingProgress, setLoadingProgress] = useState(defaultloadingStats)

  // Display URL (IP address/port) to connect from a browser
  useEffect(async () => setHostInfo(await sendEvent('hostInfo')), [])

  useEffect(async () => {
    const message = await sendEvent('getLoadingStatus')
    setLoadingProgress(message)
  }, [connected])

  useEffect(() => eventListener('loadingProgress', (message) => {
    setLoadingProgress(message)
  }), [])

  return (
    <>
      <Loader visible={!connected} />
      <div style={{ padding: '.5rem 1rem', opacity: connected ? 1 : 0, zoom: '1.2' }}>
        <h1>ICARUS</h1>
        <h3 className='text-primary'>Version {packageJson.version}</h3>
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
          <p className='text-muted'>Connect remotely:</p>
          <ul>
            {hostInfo && hostInfo.urls.map((url, i) => {
              return (i === 0) ? <li key={url} className='selectable'>{url}</li> : null
            })}
          </ul>
        </div>
        <div
          className='scrollable text-right text-uppercase' style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            bottom: '5rem',
            width: '19rem',
            background: 'var(--color-background-panel)',
            fontSize: '1.15rem',
            padding: '0 .5rem'
          }}
        >
          <div className={loadingProgress.loadingComplete ? 'text-muted' : ''}>
            {loadingProgress.loadingComplete === false ? <p>Loading...</p> : <p>Loaded</p>}
            <p>{loadingProgress.numberOfFiles.toLocaleString()} log files</p>
            <p>{formatBytes(loadingProgress.logSizeInBytes)} of data</p>
            <p>{loadingProgress.numberOfLogLines.toLocaleString()} recent log entries</p>
            <p>{loadingProgress.numberOfEventsImported.toLocaleString()} events imported</p>
            {loadingProgress.loadingComplete === true ? <p>Last activity {eliteDateTime(loadingProgress.lastActivity)}</p> : ''}
            {/* <p>Load time: {parseInt(loadingProgress.loadingTime / 1000)} seconds</p> */}
            <div style={{ position: 'absolute', bottom: '.5rem', left: '.5rem', right: '.5rem' }}>
              {loadingProgress.loadingComplete === false && <progress value={loadingProgress.numberOfEventsImported} max={loadingProgress.numberOfLogLines} />}
            </div>
          </div>
          {loadingProgress.loadingComplete === true ? <p>Ready</p> : ''}
        </div>
        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}>
          <button style={{ width: '20rem' }} onClick={newWindow}>New Terminal</button>
        </div>
      </div>
    </>
  )
}
