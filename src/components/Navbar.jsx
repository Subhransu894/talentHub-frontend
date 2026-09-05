import { Link, useNavigate } from "react-router-dom"

function Navbar() {

    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    let role = null

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]))
            role = payload.role
        } catch (error) {
            console.log("Invalid token")
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container">

                {/* Logo */}
                <Link className="navbar-brand" to="/">
                    TalentHub
                </Link>

                {/* Hamburger */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Nav Items */}
                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                >
                    <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

                        <Link className="nav-link text-white" to="/">
                            Jobs
                        </Link>

                        {role === "applicant" && (
                            <>
                                <Link
                                    className="nav-link text-white"
                                    to="/applications"
                                >
                                    My Applications
                                </Link>
                                <Link
                                    className="nav-link text-white"
                                    to="/bookmarks"
                                >
                                    Bookmarks
                                </Link>
                            </>
                        )}

                        {role === "recruiter" && (
                            <Link
                                className="nav-link text-white"
                                to="/recruiter"
                            >
                                Recruiter Dashboard
                            </Link>
                        )}

                        {token ? (
                            <>
                                <Link
                                    className="nav-link text-white"
                                    to="/profile"
                                >
                                    Profile
                                </Link>

                                <button
                                    className="btn btn-danger"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    className="nav-link text-white"
                                    to="/login"
                                >
                                    Login
                                </Link>

                                <Link
                                    className="btn btn-primary"
                                    to="/register"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar