import { useRouter } from "@tanstack/react-router"

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button className="button-svg mr-auto" onClick={() => router.history.back()}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="10 18 4 12 10 6" />
        <line x1="4" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  )
}