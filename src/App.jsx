import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthCallback from "./Authcallback"
import JamboardHome from "./JamboardHome"
import Login from "./Login"

function App() {
  return (
    <div className="app-routes">
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/jamboard" element={<JamboardHome />} />
    </Routes>
    </div>
  )
}

export default App
