import { Link, useLocation } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import { useGroupsContext } from "../contexts/GroupsContext/GroupsContext";

export default function Menu() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(window.innerWidth >= 768 ? true : false);
  const prevWidth = useRef<number>(window.innerWidth);
  const location = useLocation();

  const breakpoint = 768; //md:

  function handleSidebarToggle() {
    setSidebarIsOpen(!sidebarIsOpen);
  }

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
    <div id="sidebar" className="text-gray-700">
      <button
        className={`
          button-svg absolute top-[8px] left-[8px] bg-white stroke-gray-600 rounded-md transition-opacity
          ${sidebarIsOpen ? "opacity-0" : "opacity-100"}
          `}
        title="Toggle sidebar"
        onClick={handleSidebarToggle}
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2" fill="none" strokeWidth="1.2" />
          <line x1="9" y1="4" x2="9" y2="20" strokeWidth="1.2" />
        </svg>
      </button>

      <div
        className={`h-full max-md:absolute max-md:inset-0 md:relative transition-all duration-500
          ${sidebarIsOpen ? "pointer-events-auto" : "pointer-events-none"}
          `}
      >
        <nav
          className={`relative h-full p-2 z-3 bg-blue-100 transition-all duration-500 overflow-hidden
            ${sidebarIsOpen ? "w-[280px] translate-x-0" : "w-0 -translate-x-[150px]"}
            `}
        >
          <div>
            <button
              className="button-svg bg-blue-100 stroke-gray-600 rounded-md"
              title="Close sidebar"
              onClick={handleSidebarToggle}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" fill="none" strokeWidth="1.2" />
                <line x1="9" y1="4" x2="9" y2="20" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
          <ul>
            <li>
              <LinkBlock to="/">
                <h2>Home</h2>
              </LinkBlock>
            </li>
            <li>
              <LinkBlock to="/todos">
                <h2>Ongoing tasks</h2>
              </LinkBlock>
            </li>
            <li>
              <LinkBlock to="/finished">
                <h2>Finished tasks</h2>
              </LinkBlock>
            </li>
          </ul>

          <GroupsSection />

        </nav>

        <div
          className={`absolute inset-0 bg-black/50 md:hidden transition-opacity duration-500  
            ${sidebarIsOpen ? "opacity-100" : "opacity-0"}
            `}
          onClick={handleSidebarToggle}
        />
      </div>
    </div>
  );
}


function LinkBlock({ to, children }: { to: string, children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="block w-full p-1 rounded-md hover:bg-blue-200"
      activeProps={{ className: "bg-blue-200" }}
    >
      {children}
    </Link>
  )
}

function GroupsSection() {
  const [blockIsOpen, setBlockIsOpen] = useState<boolean>(true);
  const { groups } = useGroupsContext();
  const location = useLocation();

  return (
    <div id="groups-menu" className="w-full mt-4">
      <div className={`rounded-md p-1 flex items-center
        ${location.pathname === "/groups" ? "bg-blue-200" : ""}
        `}>
        <Link
          to="/groups"
          className="block w-full"
          activeProps={{ className: "bg-blue-200" }}
          activeOptions={{ exact: true }}
        >
          <h2 className="font-black">Groups</h2>
        </Link>
        <button
          className="button-svg p-0.5 ml-auto bg-blue-100 stroke-gray-600 rounded-md"
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
                  className="p-1 h-[32px] flex hover:bg-blue-200 rounded-md"
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