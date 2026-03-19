import './App.css'
import { Badge } from './components/ui/Badge'

function App() {
  return (
    <div className="bg-black text-white h-screen flex items-center justify-center">
      <h1 className="text-5xl font-bold text-blue-500">
        NyaySetu
      </h1>
      <Badge label="Filed" variant="info" />
      <Badge label="Judgment" variant="success" />
      <Badge label="Today – Critical" variant="critical" />
      <Badge label="Pending" variant="neutral" />
    </div>
  )
}

export default App
