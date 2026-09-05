import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, role }) {

    const token = localStorage.getItem("token")

    if (!token) {
        return <Navigate to="/login" replace />
    }

    let userRole = null

    try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        userRole = payload.role
    } catch (error) {
        localStorage.removeItem("token")
        return <Navigate to="/login" replace />
    }

    if (role && userRole !== role) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute