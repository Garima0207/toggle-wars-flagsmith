import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import flagsmith from '@flagsmith/flagsmith'
import { FlagsmithProvider } from '@flagsmith/flagsmith/react'
import App from './App.tsx'
import './App.css'
import { ENVIRONMENT_KEY, getVisitorId } from './flagsmith'

const root = createRoot(document.getElementById('root')!)

if (ENVIRONMENT_KEY) {
  root.render(
    <StrictMode>
      <FlagsmithProvider
        flagsmith={flagsmith}
        options={{
          environmentID: ENVIRONMENT_KEY,
          identity: getVisitorId(),
          // Turns on exposure + conversion events for Experimentation.
          enableEvents: true,
        }}
      >
        <App flagsmithReady />
      </FlagsmithProvider>
    </StrictMode>,
  )
} else {
  // No key yet: run the app on the control variant so the UI can still be developed.
  root.render(
    <StrictMode>
      <App flagsmithReady={false} />
    </StrictMode>,
  )
}
