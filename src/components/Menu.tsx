import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

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
    <div id="sidebar">
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
            ${sidebarIsOpen ? "w-[280px] translate-x-0" : "w-0 -translate-x-[100px]"}
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
              <LinkBlock to="/" text="Home" />
            </li>
            <li>
              <LinkBlock to="/todos" text="My tasks" />
            </li>
            <li>
              <LinkBlock to="/finished" text="Finished tasks" />
            </li>
          </ul>
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

type LinkBlockProps = {
  to: string,
  text: string,
}

function LinkBlock({ to, text }: LinkBlockProps) {
  return (
    <Link to={to} className="block w-full p-1 rounded-md hover:bg-blue-200">
      {text}
    </Link>
  )
}
