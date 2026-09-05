import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"

function Login(){

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [showPassword,setShowPassword] = useState(false)
    const [selectedRole,setSelectedRole] = useState("")

    const navigate = useNavigate()

    const handleLogin = async(e)=>{
        e.preventDefault()
        if(!selectedRole){
            toast.error("Please select Applicant or Recruiter.")
            return
        }
        try {
            const response = await fetch(
                "http://localhost:4000/api/auth/login",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        email,
                        password
                    })
                }
            )
            const data = await response.json()
            if(!response.ok){
                toast.error(data.message)
                return
            }
            const payload = JSON.parse(atob(data.token.split(".")[1]))

            if(payload.role !== selectedRole){
                toast.error(
                    `This account is registered as ${payload.role}.`
                )
                return
            }

            localStorage.setItem("token",data.token)

            navigate("/")

        } catch(error) {

            console.error(error)

            toast.error(
                "Something went wrong. Please try again."
            )
        }
    }

    return(
        <div className="container min-vh-100 d-flex justify-content-center align-items-center py-4">

            <div className="row justify-content-center w-100">

                <div className="col-12 col-md-10 col-lg-8">

                    <div className="text-center mb-4">
                        <h2 className="fw-bold">
                            Welcome to TalentHub
                        </h2>
                        <p className="text-muted">
                            Choose how you want to continue
                        </p>
                    </div>

                    {/* Role Selection */}
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-md-6">
                            <button
                                type="button"
                                className={`card w-100 h-100 text-start ${
                                    selectedRole === "applicant"
                                        ? "border-primary border-2"
                                        : "border"
                                }`}
                                onClick={() => setSelectedRole("applicant")}
                            >
                                <div className="card-body p-4">
                                    <div className="text-center mb-3">
                                        <i className="bi bi-person-circle fs-1 text-primary"></i>
                                    </div>
                                    <h4 className="fw-bold text-center">
                                        Applicant
                                    </h4>
                                    <p className="text-muted text-center mb-0">
                                        Find jobs, apply for opportunities
                                        and save your favorite jobs.
                                    </p>
                                </div>
                            </button>
                        </div>
                        <div className="col-12 col-md-6">
                            <button
                                type="button"
                                className={`card w-100 h-100 text-start ${
                                    selectedRole === "recruiter"
                                        ? "border-primary border-2"
                                        : "border"
                                }`}
                                onClick={() => setSelectedRole("recruiter")}
                            >
                                <div className="card-body p-4">
                                    <div className="text-center mb-3">
                                        <i className="bi bi-building fs-1 text-primary"></i>
                                    </div>
                                    <h4 className="fw-bold text-center">
                                        Recruiter
                                    </h4>
                                    <p className="text-muted text-center mb-0">
                                        Post jobs, manage applicants
                                        and find the best candidates.
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Login Form */}
                    {selectedRole && (
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h4 className="text-center fw-bold mb-4">
                                    Login as{" "}
                                    <span className="text-primary">
                                        {selectedRole === "applicant"
                                            ? "Applicant"
                                            : "Recruiter"}
                                    </span>
                                </h4>
                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e)=>setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Password
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e)=>setPassword(e.target.value)}
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() =>
                                                    setShowPassword(!showPassword)
                                                }
                                            >

                                                <i
                                                    className={`bi ${
                                                        showPassword
                                                            ? "bi-eye-slash"
                                                            : "bi-eye"
                                                    }`}
                                                ></i>

                                            </button>

                                        </div>

                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                    >
                                        Login as{" "}
                                        {selectedRole === "applicant"
                                            ? "Applicant"
                                            : "Recruiter"}
                                    </button>

                                    <p className="text-center mt-3 mb-0">

                                        Don't have an account?{" "}

                                        <Link to="/register">
                                            Register
                                        </Link>

                                    </p>

                                </form>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>
    )
}

export default Login