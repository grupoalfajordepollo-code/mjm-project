import Categories from "./components/Categories"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import Unauthorized401 from "./components/Unauthorized401"

function App() {

  return (
    <>
      <Header></Header>
      <Hero></Hero>
      <Categories></Categories>
      {/* <LoginForm></LoginForm> */}
      {/* <RegisterForm></RegisterForm> */}
      <Footer></Footer>
    </>
  )
}

export default App
