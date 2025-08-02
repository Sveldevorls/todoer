import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/tasks/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Navigate to="/ongoing" />
  )
}