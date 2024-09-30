import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import UserProfile from "./pages/UserProfile"

const App = () => {

  const user = {
    username: "johndoe",
    fullName: "John Doe",
    profilePicture: "",
    followers: 120,
    following: 150,
    bio: "Just another tech enthusiast!",
    posts: [
      { image: "https://images.unsplash.com/photo-1727447903891-f4a3bad38598?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { image: "https://images.unsplash.com/photo-1725489891146-490f7962e499?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { image: "https://images.unsplash.com/photo-1727454921045-fa5af2374b44?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D  " },
      { image: "https://images.unsplash.com/photo-1518802508264-76256089cddb?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
    ]
  };
  
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile" element={<UserProfile user = {user} />} />

    </Routes>
  )
}

export default App