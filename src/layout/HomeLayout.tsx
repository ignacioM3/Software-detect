import { Outlet } from "react-router-dom";

export function HomeLayout() {
  return (
    <div className="min-h-screen bg-cover flex flex-col bg-gray-900">
        <Outlet />
    </div>
  )
}
