import { SVGProps } from "react";
import {
  HomeIcon,
  HeartIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import IconButton from "./IconButton";
import { signOut, useSession } from "next-auth/react";
const Devider = () => <hr className="border-t-[1px] border-gray-900" />;

const Sidebar = () => {
  const { data: session } = useSession();
  return (
    <div className="side-bar text-gray-500 px-5 pt-5 pb-36 text-xs lg:text-sm border-r border-gray-900 h-screen overflow-y-scroll hide-scrollbar sm:max-w-[12rem] lg:max-w-[15rem] hidden md:block">
      <div className="space-y-4">
        {session?.user ? (
          <button
            onClick={() => {
              signOut();
            }}
          >
            {session.user.name} - Logout
          </button>
        ) : (
          ""
        )}
        <IconButton icon={HomeIcon} label={"Home"} />
        <IconButton icon={SearchIcon} label={"Search"} />
        <IconButton icon={LibraryIcon} label={"Library"} />
        <Devider />
        <IconButton icon={PlusCircleIcon} label={"Create Playlist"} />
        <IconButton icon={HeartIcon} label={"Liked Songs"} />
        <IconButton icon={RssIcon} label={"Your Episodes"} />
        <Devider />
        <p className="cursor-pointer hover:text-white">PLAYLIST</p>
      </div>
    </div>
  );
};

export default Sidebar;
