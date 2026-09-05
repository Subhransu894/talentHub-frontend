import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function RecruiterDashboard() {

    const [jobs,setJobs] = useState([])

    const [title,setTitle] = useState("")
    const [company,setCompany] = useState("")
    const [description,setDescription] = useState("")
    const [skills,setSkills] = useState("")
    const [salary,setSalary] = useState("")
    const [experience,setExperience] = useState("")
    const [location,setLocation] = useState("")
    const [employmentType,setEmploymentType] = useState("full-time")
    const [workMode,setWorkMode] = useState("remote")
    const [applicationDeadline,setApplicationDeadline] = useState("")

    const [applications,setApplications] = useState([])

    // for ai assistant
    const [aiResponse,setAiResponse] = useState("")
    const [aiLoading,setAiLoading] = useState(false)
    const [aiJobId,setAiJobId] = useState(null)

    const navigate = useNavigate()

    const fetchJobs = async() => {

        const token = localStorage.getItem("token")

        if(!token){
            navigate("/login")
            return
        }

        try {

            const response = await fetch(
                "http://localhost:4000/api/jobs"
            )

            const data = await response.json()

            if(!response.ok){
               toast.error(data.message)
                return
            }

            setJobs(data.jobs)

        } catch(error) {
            toast.error("Something went wrong. Please try again.")
        }
    }

    const fetchApplications = async()=>{

        const token = localStorage.getItem("token")

        try {

            const response = await fetch(
                "http://localhost:4000/api/applications/recruiter",
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            if(!response.ok){
                toast.error(data.message)
                return
            }

            setApplications(data.applications)

        } catch(error) {
            console.error(error)
            toast.error("Something went wrong. Please try again.")
        }
    }

    useEffect(()=>{
        fetchJobs()
        fetchApplications()
    },[])

    const handleCreateJob = async(e) => {

        e.preventDefault()

        const token = localStorage.getItem("token")

        if(!token){
            navigate("/login")
            return
        }

        try {

            const response = await fetch(
                "http://localhost:4000/api/jobs",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${token}`
                    },
                    body:JSON.stringify({
                        title,
                        company,
                        description,
                        skills:skills
                            .split(",")
                            .map(skill=>skill.trim())
                            .filter(skill=>skill),
                        salary:Number(salary),
                        experience:Number(experience),
                        location,
                        employmentType,
                        workMode,
                        applicationDeadline
                    })
                }
            )

            const data = await response.json()

            if(!response.ok){
                toast.error(data.message)
                return
            }

            toast.success("Job created successfully!")

            setTitle("")
            setCompany("")
            setDescription("")
            setSkills("")
            setSalary("")
            setExperience("")
            setLocation("")
            setEmploymentType("full-time")
            setWorkMode("remote")
            setApplicationDeadline("")

            fetchJobs()

        } catch(error) {
            console.error(error)
            toast.error("Something went wrong. Please try again.")
        }
    }
    const updateApplicationStatus = async(applicationId,status)=>{

        const token = localStorage.getItem("token")

        try {

            const response = await fetch(
                `http://localhost:4000/api/applications/${applicationId}/status`,
                {
                    method:"PATCH",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${token}`
                    },
                    body:JSON.stringify({
                        status
                    })
                }
            )

            const data = await response.json()

            if(!response.ok){
                toast.error(data.message)
                return
            }
            toast.success(`Application ${status} successfully!`)
            fetchApplications()

        } catch(error) {
            console.error(error)
            toast.error("Something went wrong. Please try again.")
        }
    }
    // Ai assistant
    const handleHiringAssistant = async(jobId,prompt)=>{
        const token = localStorage.getItem("token")

        setAiLoading(true)
        setAiResponse("")
        setAiJobId(jobId)
        try {
            const response = await fetch(
                `http://localhost:4000/api/ai/hiring-assistant/${jobId}`,
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${token}`
                    },
                    body:JSON.stringify({
                        prompt
                    })
                }
            )
            const data = await response.json()
            if(!response.ok){
                toast.error(data.message)
                return
            }
            setAiResponse(data.response)
        } catch(error) {
            console.error("AI hiring assistant error:",error)
            toast.error(
                "AI service is currently unavailable. Please try again later."
            )
        } finally {
            setAiLoading(false)
        }
    }
    return(
        <div className="container py-4">
            <h2 className="fw-bold mb-4">
                Recruiter Dashboard
            </h2>
            {/* Create Job */}
            <div className="card shadow-sm border-0 mb-5">

                <div className="card-body p-4">

                    <h4 className="fw-bold mb-4">
                        Create New Job
                    </h4>

                    <form onSubmit={handleCreateJob}>

                        <div className="row g-3">

                            <div className="col-12 col-md-6">
                                <label className="form-label">
                                    Job Title
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={(e)=>setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label">
                                    Company
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={company}
                                    onChange={(e)=>setCompany(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label">
                                    Job Description
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="5"
                                    value={description}
                                    onChange={(e)=>setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="col-12">
                                <label className="form-label">
                                    Skills
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="React, Node.js, MongoDB"
                                    value={skills}
                                    onChange={(e)=>setSkills(e.target.value)}
                                    required
                                />

                                <div className="form-text">
                                    Separate skills with commas.
                                </div>
                            </div>

                            <div className="col-12 col-sm-6 col-lg-3">
                                <label className="form-label">
                                    Monthly Salary
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={salary}
                                    onChange={(e)=>setSalary(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-12 col-sm-6 col-lg-3">
                                <label className="form-label">
                                    Experience (Years)
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    min="0"
                                    value={experience}
                                    onChange={(e)=>setExperience(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-12 col-sm-6 col-lg-3">
                                <label className="form-label">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={location}
                                    onChange={(e)=>setLocation(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-12 col-sm-6 col-lg-3">
                                <label className="form-label">
                                    Employment Type
                                </label>

                                <select
                                    className="form-select"
                                    value={employmentType}
                                    onChange={(e)=>setEmploymentType(e.target.value)}
                                >
                                    <option value="full-time">
                                        Full-time
                                    </option>
                                    <option value="part-time">
                                        Part-time
                                    </option>
                                    <option value="internship">
                                        Internship
                                    </option>
                                    <option value="contract">
                                        Contract
                                    </option>
                                </select>
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label">
                                    Work Mode
                                </label>

                                <select
                                    className="form-select"
                                    value={workMode}
                                    onChange={(e)=>setWorkMode(e.target.value)}
                                >
                                    <option value="remote">
                                        Remote
                                    </option>
                                    <option value="on-site">
                                        On-site
                                    </option>
                                </select>
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label">
                                    Application Deadline
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    value={applicationDeadline}
                                    onChange={(e)=>setApplicationDeadline(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-12">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Create Job
                                </button>
                            </div>

                        </div>

                    </form>

                </div>

            </div>
            {/* Jobs */}
            <h4 className="fw-bold mb-3">
                Jobs
            </h4>
            <div className="row g-4">
                {jobs.map((job)=>(
                    <div
                        className="col-12 col-md-6 col-lg-4"
                        key={job._id}
                    >
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-body d-flex flex-column">
                                <h5 className="fw-bold">
                                    {job.title}
                                </h5>
                                <p className="text-muted mb-2">
                                    {job.company}
                                </p>
                                <p className="mb-2">
                                    <i className="bi bi-geo-alt me-2"></i>
                                    {job.location}
                                </p>
                                <p className="mb-2">
                                    <i className="bi bi-currency-rupee me-2"></i>
                                    ₹{job.salary} / month
                                </p>
                                <p className="mb-3">
                                    {job.experience} years experience
                                </p>
                                <span className="badge bg-success align-self-start">
                                    {job.status}
                                </span>
                                <div className="mt-3">
                                    <h6 className="fw-bold">
                                        <i className="bi bi-robot me-2"></i>
                                        AI Hiring Assistant
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() =>
                                                handleHiringAssistant(
                                                    job._id,
                                                    "Suggest the top 3 candidates."
                                                )
                                            }
                                            disabled={aiLoading && aiJobId === job._id}
                                        >
                                            Top 3 Candidates
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() =>
                                                handleHiringAssistant(
                                                    job._id,
                                                    "Summarize all applicants."
                                                )
                                            }
                                            disabled={aiLoading && aiJobId === job._id}
                                        >
                                            Summarize
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() =>
                                                handleHiringAssistant(
                                                    job._id,
                                                    "Who should I interview first?"
                                                )
                                            }
                                            disabled={aiLoading && aiJobId === job._id}
                                        >
                                            Interview First
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() =>
                                                handleHiringAssistant(
                                                    job._id,
                                                    "Which applicant has the strongest frontend profile?"
                                                )
                                            }
                                            disabled={aiLoading && aiJobId === job._id}
                                        >
                                            Strongest Frontend
                                        </button>
                                    </div>
                                    {aiLoading && aiJobId === job._id && (
                                        <div className="mt-3 text-muted">
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            AI is analyzing applicants...
                                        </div>
                                    )}

                                </div>

                            </div>

                        </div>
                    </div>
                ))}
            </div>
            {aiResponse && (
                <div className="card shadow-sm border-0 mt-4">
                    <div className="card-body p-4">
                        <h4 className="fw-bold mb-3">
                            <i className="bi bi-robot me-2"></i>
                            AI Hiring Assistant
                        </h4>
                        <div
                            className="bg-light rounded p-3"
                            style={{whiteSpace:"pre-line"}}
                        >
                            {aiResponse}
                        </div>
                    </div>
                </div>
            )}
            {/* Applications */}
            <div className="mt-5">

                <h4 className="fw-bold mb-3">
                    Applications
                </h4>
                {applications.length === 0 && (
                    <div className="alert alert-info">
                        No applications received yet.
                    </div>
                )}

                <div className="row g-4">

                    {applications.map((application)=>(
                        <div
                            className="col-12 col-md-6 col-lg-4"
                            key={application._id}
                        >

                            <div className="card h-100 shadow-sm border-0">

                                <div className="card-body">

                                    <h5 className="fw-bold">
                                        {application.applicant?.name}
                                    </h5>

                                    <p className="text-muted mb-3">
                                        {application.applicant?.email}
                                    </p>

                                    <p className="mb-2">
                                        <strong>Job:</strong>{" "}
                                        {application.job?.title}
                                    </p>

                                    <p className="mb-3">
                                        <strong>Cover Letter:</strong>
                                    </p>

                                    <p className="text-muted">
                                        {application.coverLetter}
                                    </p>

                                    <a
                                        href={application.resume}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-outline-primary btn-sm mb-3"
                                    >
                                        View Resume
                                    </a>

                                    <div className="mb-3">
                                        <span className="badge bg-primary">
                                            {application.status}
                                        </span>
                                    </div>

                                    <div className="d-flex flex-wrap gap-2">

                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() =>
                                                updateApplicationStatus(
                                                    application._id,
                                                    "shortlisted"
                                                )
                                            }
                                        >
                                            Shortlist
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                                updateApplicationStatus(
                                                    application._id,
                                                    "rejected"
                                                )
                                            }
                                        >
                                            Reject
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={() =>
                                                updateApplicationStatus(
                                                    application._id,
                                                    "hired"
                                                )
                                            }
                                        >
                                            Hire
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </div>
    )
}

export default RecruiterDashboard