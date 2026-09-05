import { useEffect, useState } from "react"
import { useParams,Link } from "react-router-dom"
import { toast } from "react-toastify"

function JobDetails(){
    const {id} = useParams()

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

    const [job,setJob] = useState("")
    const [similarJobs,setSimilarJobs] = useState([])
    const [aiPreparation,setAiPreparation] = useState("")
    const [aiLoading,setAiLoading] = useState(false)


    const handleInterviewPreparation = async()=>{
        const token = localStorage.getItem("token")

        if(!token){
            toast.error("Please login as an applicant to use AI Interview Preparation.")
            return
        }

        setAiLoading(true)
        setAiPreparation("")

        try {

            const response = await fetch(
                "https://talenthub-backend-0v0r.onrender.com/api/ai/interview-preparation",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${token}`
                    },
                    body:JSON.stringify({
                        title:job.title,
                        company:job.company,
                        description:job.description,
                        skills:job.skills,
                        experience:job.experience
                    })
                }
            )

            const data = await response.json()

            if(!response.ok){
                toast.error(data.message)
                return
            }

            setAiPreparation(data.preparation)

        } catch(error) {

            console.error("AI preparation error:",error)

            toast.error(
                "AI service is currently unavailable. Please try again later."
            )

        } finally {
            setAiLoading(false)
        }
    }
    const fetchJob=async()=>{
        try {
            const response = await fetch(`https://talenthub-backend-0v0r.onrender.com/api/jobs/${id}`)
            const data = await response.json()
            if(!response.ok){
                toast.error(data.message)
                return
            }
            setJob(data.job)
            setSimilarJobs(data.similarJobs)
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong. Please try again.")
        }
    }
    useEffect(()=>{
        fetchJob()
    },[id])
    if(!job){
        return(
            <div className="container py-5">
                <p>Loading...</p>
            </div>
        )
    }
    return(
        <div className="container py-4">
            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h2 className="fw-bold mb-2">
                                {job.title}
                            </h2>
                            <p className="text-muted mb-4">
                                <i className="bi bi-building me-2"></i>
                                {job.company}
                            </p>
                            <div className="row g-3 mb-4">
                                <div className="col-12 col-sm-6">
                                    <div className="border rounded p-3">
                                        <small className="text-muted">
                                            Location
                                        </small>
                                        <div>
                                            <i className="bi bi-geo-alt me-2"></i>
                                            {job.location}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <div className="border rounded p-3">
                                        <small className="text-muted">
                                            Salary
                                        </small>
                                        <div>
                                            <i className="bi bi-currency-rupee me-2"></i>
                                            {job.salary}/month
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <div className="border rounded p-3">
                                        <small className="text-muted">
                                            Experience
                                        </small>
                                        <div>
                                            <i className="bi bi-briefcase me-2"></i>
                                            {job.experience} years
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <div className="border rounded p-3">
                                        <small className="text-muted">
                                            Work Mode
                                        </small>
                                        <div>
                                            {job.workMode}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h5 className="fw-bold">
                                Job Description
                            </h5>
                            <p className="text-muted">
                                {job.description}
                            </p>
                            <h5 className="fw-bold mt-4">
                                Skills
                            </h5>
                            <div className="mb-4">
                                {job.skills.map((skill,index)=>(
                                    <span
                                        key={index}
                                        className="badge bg-light text-dark border me-2 mb-2"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            <h5 className="fw-bold">
                                Employment Type
                            </h5>
                            <p className="text-muted">
                                {job.employmentType}
                            </p>
                            <h5 className="fw-bold">
                                Application Deadline
                            </h5>
                            <p className="text-muted">
                                {new Date(
                                    job.applicationDeadline
                                ).toLocaleDateString()}
                            </p>
                            {role !== "recruiter" && (
                                <>
                                    <Link
                                        to={`/jobs/${job._id}/apply`}
                                        className="btn btn-primary w-100 mt-3"
                                    >
                                        Apply Now
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary w-100 mt-2"
                                        onClick={handleInterviewPreparation}
                                        disabled={aiLoading}
                                    >
                                        {aiLoading ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                    ></span>
                                                    Preparing...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-robot me-2"></i>
                                                    Prepare for Interview
                                                </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {/* AI result */}
                    {aiPreparation && (
                        <div className="card shadow-sm border-0 mt-4">
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-3">
                                    <i className="bi bi-robot me-2"></i>
                                    AI Interview Preparation
                                </h4>
                                <div
                                    className="bg-light rounded p-3"
                                    style={{whiteSpace:"pre-line"}}
                                >
                                    {aiPreparation}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* about company and view job */}
                <div className="col-12 col-lg-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">
                                About the company
                            </h5>
                            <h6 className="fw-bold">
                                {job.recruiter?.companyName || job.company}
                            </h6>
                            <p className="text-muted">
                                {job.recruiter?.aboutCompany ||  "Company information is not available."}
                            </p>
                            {job.recruiter?.website && (
                                <a 
                                    href={job.recruiter.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-decoration-none"
                                >
                                    Visit Website
                                </a>
                            )}
                        </div>
                    </div>
                    {similarJobs.length > 0 && (
                        <div className="card shadow-sm border-0 mt-4">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3">
                                    Similar Jobs
                                </h5>
                                {similarJobs.map((similarJob)=>(
                                    <div
                                        key={similarJob._id}
                                        className="border-bottom py-3"
                                    >
                                        <h6 className="fw-bold mb-1">
                                            {similarJob.title}
                                        </h6>
                                        <p className="text-muted small mb-2">
                                            {similarJob.company}
                                        </p>
                                        <Link to={`/jobs/${similarJob._id}`} className="btn btn-sm btn-outline-primary">
                                            View Job
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default JobDetails