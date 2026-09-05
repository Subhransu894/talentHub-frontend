import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function Register(){

    const [selectedRole,setSelectedRole] = useState("")

    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [showPassword,setShowPassword] = useState(false)

    const [companyName,setCompanyName] = useState("")
    const [companyWebsite,setCompanyWebsite] = useState("")

    const navigate = useNavigate()

    const handleRegister = async(e)=>{
        e.preventDefault()

        try {

            const response = await fetch(
                "https://talenthub-backend-0v0r.onrender.com/api/auth/register",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        name,
                        email,
                        password,
                        role:selectedRole,
                        companyName:
                            selectedRole === "recruiter"
                                ? companyName
                                : "",
                        website:
                            selectedRole === "recruiter"
                                ? companyWebsite
                                : ""
                    })
                }
            )

            const data = await response.json()

            if(!response.ok){
                toast.error(data.message)
                return
            }

            toast.success("Registration successful! Please login.")

            setTimeout(()=>{
                navigate("/login")
            },1000)

        } catch(error) {

            console.error("Register error:",error)

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
                            Create Your TalentHub Account
                        </h2>

                        <p className="text-muted">
                            Choose how you want to use TalentHub
                        </p>

                    </div>

                    {/* ROLE SELECTION */}

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
                                        Create your profile, discover jobs,
                                        apply for opportunities and bookmark jobs.
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
                                        Create your company profile, post jobs
                                        and manage applicants.
                                    </p>

                                </div>

                            </button>

                        </div>

                    </div>

                    {/* REGISTRATION FORM */}

                    {selectedRole && (

                        <div className="card shadow-sm border-0">

                            <div className="card-body p-4">

                                <h4 className="text-center fw-bold mb-4">

                                    Register as{" "}

                                    <span className="text-primary">

                                        {selectedRole === "applicant"
                                            ? "Applicant"
                                            : "Recruiter"}

                                    </span>

                                </h4>

                                <form onSubmit={handleRegister}>

                                    {/* NAME */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            {selectedRole === "recruiter"
                                                ? "Your Name"
                                                : "Full Name"}
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={
                                                selectedRole === "recruiter"
                                                    ? "Enter your name"
                                                    : "Enter your full name"
                                            }
                                            value={name}
                                            onChange={(e)=>setName(e.target.value)}
                                            required
                                        />

                                    </div>

                                    {/* RECRUITER COMPANY */}

                                    {selectedRole === "recruiter" && (

                                        <>
                                            <div className="mb-3">

                                                <label className="form-label">
                                                    Company Name
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter company name"
                                                    value={companyName}
                                                    onChange={(e)=>setCompanyName(e.target.value)}
                                                    required
                                                />

                                            </div>

                                            <div className="mb-3">

                                                <label className="form-label">
                                                    Company Website
                                                </label>

                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    placeholder="https://example.com"
                                                    value={companyWebsite}
                                                    onChange={(e)=>setCompanyWebsite(e.target.value)}
                                                />

                                            </div>
                                        </>

                                    )}

                                    {/* EMAIL */}

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

                                    {/* PASSWORD */}

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
                                        Create{" "}
                                        {selectedRole === "applicant"
                                            ? "Applicant"
                                            : "Recruiter"}{" "}
                                        Account
                                    </button>

                                </form>

                                <p className="text-center mt-3 mb-0">

                                    Already have an account?{" "}

                                    <button
                                        type="button"
                                        className="btn btn-link p-0"
                                        onClick={() => navigate("/login")}
                                    >
                                        Login
                                    </button>

                                </p>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>
    )
}

export default Register