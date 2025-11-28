import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../store/slices/chatSlice";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { User } from "lucide-react";
import { setSelectedUser } from "../store/slices/chatSlice";

const Sidebar = () => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { users, selectedUser, isUsersLoading } = useSelector(
    (state) => state.chat
  );
  const { onlineUsers,authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch,authUser]);
  // console.log("users in sidebar", users);

  const filteredUsers = showOnlineOnly
    ? users?.filter((user) => onlineUsers.includes(user._id))
    : users;
    const fl =  users?.filter((user) => onlineUsers.includes(user._id));

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      <aside className="h-full w-20 lg:w-72 border-r border-gray-200 flex flex-col transition-all duration-200 bg-white">
        {/* Sidebar Header */}
        <div className="border-b border-gray-200 p-5 2-full">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-gray-700" size={32} />
            <span className="font-medium hidden lg:block text-gray-800">
              Contacts
            </span>
          </div>

          {/* Online Only Filter */}
          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="w-4 h-4 border-gray-700 text-blue-600 focus:ring-blue-500"
              />
              Show Online Only
            </label>
         
            <span className="text-xs text-gray-500">
              ({fl.length} Online)
            </span>
          
          </div>
        </div>

        {/* User List */}
        <div className=" overflow-y-auto w-full ">
         
          {filteredUsers?.length > 0 &&
            filteredUsers.map((user) => (
              <button
                onClick={() =>  dispatch(setSelectedUser(user))}
                key={user._id}
                className={`w-full p-3 flex items-center gap-3 transition-colors rounded-md ${
                  selectedUser && selectedUser._id === user._id
                    ? "bg-gray-200 ring-gray-200"
                    : "hover:bg-gray-200"
                }`}
              >
                {/* {console.log("selected user in sidebar", selectedUser)} */}
                {/*  AVATAR */}
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user?.avatar?.url || "/avatar-holder.avif"}
                    alt="/avatar-holder.avif"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                {/* USER INFO */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium text-gray-800 truncate">
                    {user.fullName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            ))}

          {filteredUsers?.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No Users Found.
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

