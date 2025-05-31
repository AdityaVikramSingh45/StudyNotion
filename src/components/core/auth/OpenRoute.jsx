import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }) {
  const { token } = useSelector((state) => state.auth)

  console.log("OpenRoute - Token:", token) // Debugging log

  if (!token) {
    return children // Allow access if the user is NOT authenticated
  } else {
    return <Navigate to="/dashboard/my-profile" replace /> // Redirect if authenticated
  }
}

export default OpenRoute
