import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import UserProfile from "./pages/UserProfile"
import Messenger from "./pages/Messenger"
import Notification from "./pages/Notification"

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
      <Route path="/messanger" element={<Messenger />} />
      <Route path="/notifications" element={<Notification />} />
    </Routes>
  )
}

export default App