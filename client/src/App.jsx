import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { useSelector,useDispatch } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { connectSocket, getSocket } from "./lib/socket";
import { setOnlineUsers } from "./store/slices/authSlice";
import { BrowserRouter as Router,Routes,Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { ToastContainer } from "react-toastify";
import NavBar from "./components/Navbar";
const App = () => {
  const {authUser,isCheakingAuth} = useSelector((state => state.auth));
  const dispatch = useDispatch();

    useEffect(() =>{
      dispatch(getUser());
    },[dispatch])

    useEffect(() =>{
      if(authUser){
         let socket = getSocket();
          if (!socket) {
            socket = connectSocket(authUser._id);
          }
         const handleOnlineUsers = (users) => {
    dispatch(setOnlineUsers(users));
  };
        socket.on("getOnlineUsers",handleOnlineUsers)

     return () => {
          socket.off("getOnlineUsers", handleOnlineUsers);
          // DO NOT disconnect here, let logout() handle disconnectSocket()
      };
      }
    },[authUser?._id, dispatch])

    if(isCheakingAuth && !authUser){
      return (
        <div className="w-full h-screen flex justify-center items-center">
          <Loader className="animate-spin" size={40} />
        </div>
      );
    }


  return <>
  <Router>
    <NavBar/>
    <Routes>
      <Route path="/" element={authUser ? <Home/> : <Navigate to={"/login"}/>} />
      <Route path="/register" element={!authUser ? <Register/> : <Navigate to={"/"}/>} />
      <Route path="/login" element={!authUser ? <Login/> : <Navigate to={"/"}/>} />
      <Route path="/profile" element={authUser ? <Profile/> : <Navigate to={"/login"}/>} />
    </Routes>
    <ToastContainer />
  </Router>
  </>;
};

export default App;











