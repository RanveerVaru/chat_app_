import {useSelector} from "react-redux";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatCountainer from "../components/ChatContainer"



const Home = () => {
  const {selectedUser} = useSelector(state => state.chat);
              // {console.log("selected user in home", selectedUser)}
  return <>
  
    <div className="min-h-screnn bg-gray-100">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
              <Sidebar/>
              {!selectedUser ?   <NoChatSelected/> : <ChatCountainer/>}
          </div>
        </div>
      </div>
    </div>
  </>;
};

export default Home;
