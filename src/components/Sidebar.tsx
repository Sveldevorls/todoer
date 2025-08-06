import { useState } from "react";
import { Link, useLocation, } from "@tanstack/react-router";
import { useAppSelector } from "../redux/hooks";
import type { TodoObject } from "../types";
import logo from "../assets/logo.svg"

type SidebarProps = {
  sidebarIsOpen: boolean;
  setSidebarIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ sidebarIsOpen, setSidebarIsOpen }: SidebarProps) {
  const todos = useAppSelector(state => state.todos.todos);
  const currOngoingTodos = todos.filter(todo => !todo.isCompleted);
  const todayOngoingTodos = todos.filter(todo => todoDateIsToday(todo) && !todo.isCompleted)

  function todoDateIsToday(todo: TodoObject) {
    if (!todo.date) return false;

    const today = new Date();
    const todoDate = new Date(parseInt(todo.date, 10));
    return (
      todoDate.getDay() === today.getDay() &&
      todoDate.getMonth() === today.getMonth() &&
      todoDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <nav className="relative h-screen w-[260px] z-1 bg-slate-100">
      <div className="h-screen flex flex-col">
        <div
          id="navbar-top"
          className="flex items-center p-2 h-14"
        >
          <Link to="/" className="flex items-center pl-1 h-[40px]">
            <img src={logo} className="h-[60%]" />
          </Link>
          <button
            className={`button-svg fixed top-[11px] stroke-gray-600 transition-[left] duration-500
                ${sidebarIsOpen ? "left-[212px]" : "left-2"}
                `}
            title={`${sidebarIsOpen ? "Close sidebar" : "Open sidebar"}`}
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
          className="p-2 overflow-hidden hover:overflow-auto grow [scrollbar-width:thin] [scrollbar-gutter:stable]"
        >
          <ul>
            <li>
              <Link
                to="/ongoing"
                className="flex justify-between items-center p-1 rounded-md hover:bg-zinc-200"
                activeProps={{ className: "bg-blue-100" }}
              >
                <h2>Ongoing tasks</h2>
                {
                  currOngoingTodos.length > 0 &&
                  <span className="text-sm mx-1">
                    {currOngoingTodos.length <= 99 ? currOngoingTodos.length : "99+"}
                  </span>
                }
              </Link>
            </li>
            <li>
              <Link
                to="/today"
                className="flex justify-between items-center p-1 rounded-md hover:bg-zinc-200"
                activeProps={{ className: "bg-blue-100" }}
              >
                <h2>Today</h2>
                {
                  todayOngoingTodos.length > 0 &&
                  <span className="text-sm mx-1">
                    {todayOngoingTodos.length <= 99 ? todayOngoingTodos.length : "99+"}
                  </span>
                }
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
  )
}


function GroupsSection() {
  const [blockIsOpen, setBlockIsOpen] = useState<boolean>(true);
  const todos = useAppSelector(state => state.todos.todos);
  const groups = useAppSelector(state => state.groups.groups);
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
          className="button-svg p-0.5 ml-auto stroke-gray-600"
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
            {groups.map(group => {
              const currGroupOngoingTodos = todos.filter(todo => todo.group === group.id && !todo.isCompleted);

              return (
                <li key={group.id}>
                  <Link
                    to="/groups/$groupID"
                    params={{ groupID: group.id }}
                    className="flex items-center p-1 h-[32px] hover:hover:bg-zinc-200 rounded-md"
                    activeProps={{ className: "bg-blue-100" }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" className="fill-gray-700 shrink-0">
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                    <h2 key={group.id} className="truncate mr-auto">
                      {group.title}
                    </h2>
                    {
                      currGroupOngoingTodos.length > 0 &&
                      <span className="text-sm mx-1">
                        {currGroupOngoingTodos.length <= 99 ? currGroupOngoingTodos.length : "99+"}
                      </span>
                    }
                  </Link>
                </li>
              )
            }
            )}
          </div>
        </ul>
      </div>
    </div>
  )
}