import { Link, useLocation, } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useGroupsContext } from "../contexts/GroupsContext/GroupsContext";

export default function Sidebar() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(window.innerWidth >= 768);
  const prevWidth = useRef<number>(window.innerWidth);
  const location = useLocation();

  const breakpoint = 768; //md:

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const isWide = width >= breakpoint;
      const wasNarrow = prevWidth.current < breakpoint;
      const wasWide = prevWidth.current >= breakpoint;

      if (isWide && wasNarrow) {
        setSidebarIsOpen(true);
      } else if (!isWide && wasWide) {
        setSidebarIsOpen(false);
      }

      prevWidth.current = width;
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <div
      id="sidebar"
      className="absolute md:relative"
    >
      {/* Outer button */}
      <button
        id="outer-button"
        className={`
          button-svg absolute top-[8px] left-[8px] bg-white stroke-gray-600 rounded-md transition-opacity duration-500
          ${sidebarIsOpen ? "opacity-0" : "opacity-100"}
          `}
        title="Toggle sidebar"
        onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2" fill="none" strokeWidth="1.2" />
          <line x1="9" y1="4" x2="9" y2="20" strokeWidth="1.2" />
        </svg>
      </button>

      {/* Actual sidebar */}
      <nav className={`relative h-screen bg-slate-100 transition-[width,left] duration-500 z-1
        ${sidebarIsOpen ? "w-[280px]" : "w-0"}
        ${sidebarIsOpen ? "left-0" : "left-[-100px]"}
        `}
      >
        <div className="h-screen flex flex-col">
          <div
            id="navbar-top"
            className="shrink-0 p-2"
          >
            <button
              className="button-svg bg-slate-100 stroke-gray-600 rounded-md"
              title="Close sidebar"
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" fill="none" strokeWidth="1.2" />
                <line x1="9" y1="4" x2="9" y2="20" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
          <div
            id="navbar-content"
            className="p-2 overflow-hidden hover:overflow-auto grow scrollbar-thin"
          >
            <ul>
              <li>
                <Link
                  to="/"
                  className="block p-1 rounded-md hover:bg-zinc-200"
                  activeProps={{ className: "bg-blue-100" }}
                >
                  <h2>Home</h2>
                </Link>
              </li>
              <li>
                <Link
                  to="/ongoing"
                  className="block p-1 rounded-md hover:bg-zinc-200"
                  activeProps={{ className: "bg-blue-100" }}
                >
                  <h2>Ongoing tasks</h2>
                </Link>
              </li>
              <li>
                <Link
                  to="/finished"
                  className="block p-1 rounded-md hover:bg-zinc-200"
                  activeProps={{ className: "bg-blue-100" }}
                >
                  <h2>Finished tasks</h2>
                </Link>
              </li>
            </ul>
            <GroupsSection />
          </div>
        </div>
      </nav>

      {/* Outer click detection div */}
      <div
        className={`fixed inset-0 md:hidden bg-black/50 transition-all
          ${sidebarIsOpen ? "opacity-100" : "opacity-0"}
          ${sidebarIsOpen ? "pointer-events-auto" : "pointer-events-none"}
        `}
        onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
      >
      </div>
    </div>
  )
}


function GroupsSection() {
  const [blockIsOpen, setBlockIsOpen] = useState<boolean>(true);
  const { groups } = useGroupsContext();
  const location = useLocation();

  return (
    <div id="groups-menu" className="w-full mt-4">
      <div className={`rounded-md p-1 flex items-center
        ${location.pathname === "/groups" ? "bg-blue-100" : ""}
        `}>
        <Link
          to="/groups"
          className="block w-full"
          activeProps={{ className: "bg-blue-100" }}
          activeOptions={{ exact: true }}
        >
          <h2 className="font-black">Groups</h2>
        </Link>
        <button
          className="button-svg p-0.5 ml-auto bg-slate-100 stroke-gray-600 rounded-md"
          title="Collapse groups"
          onClick={() => setBlockIsOpen(!blockIsOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24"
            className={`transition-transform
              ${blockIsOpen ? "rotate-0" : "-rotate-90"}
            `}
          >
            <line x1="6" y1="10" x2="12" y2="16" strokeWidth="1.3" />
            <line x1="18" y1="10" x2="12" y2="16" strokeWidth="1.3" />
          </svg>
        </button>
      </div>
      <div>
        <ul className={`grid transition-[grid-template-rows] duration-500
        ${blockIsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
        `}>
          <div className="overflow-hidden">
            {groups.map(group =>
              <li key={group.id}>
                <Link
                  to="/groups/$groupID"
                  params={{ groupID: group.id }}
                  className="p-1 h-[32px] flex hover:hover:bg-zinc-200 rounded-md"
                  activeProps={{ className: "bg-blue-100" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" className="fill-gray-700 shrink-0">
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                  <h2 key={group.id} className="truncate">{group.title}</h2>
                </Link>
              </li>
            )}
          </div>
        </ul>
      </div>
    </div>
  )
}