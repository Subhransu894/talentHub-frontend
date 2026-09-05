import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function MyApplications(){

    const [applications,setApplications] = useState([])

    const navigate = useNavigate()

    const fetchApplications = async()=>{
        const token = localStorage.getItem("token")

        if(!token){
            navigate("/login")
            return
        }

        try {

            const response = await fetch(
                "https://talenthub-backend-0v0r.onrender.com/api/applications/my",
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            )

            const data = await response.json()
            console.log("My applications:", data.applications)
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
        fetchApplications()
    },[])

    return(
        <div className="container py-4">

            <h2 className="fw-bold mb-4">
                My Applications
            </h2>

            {applications.length === 0  && (
                <div className="alert alert-info">
                    You haven't applied for any jobs yet.
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
                                    {application.job?.title}
                                </h5>

                                <p className="text-muted mb-2">
                                    <i className="bi bi-building me-2"></i>
                                    {application.job?.company}
                                </p>

                                <p className="mb-2">
                                    <i className="bi bi-geo-alt me-2"></i>
                                    {application.job?.location}
                                </p>

                                <p className="mb-2">
                                    <i className="bi bi-currency-rupee me-2"></i>
                                    ₹{application.job?.salary} / month
                                </p>

                                <p className="mb-2">
                                    <i className="bi bi-briefcase me-2"></i>
                                    {application.job?.employmentType}
                                </p>

                                <p className="mb-3">
                                    <i className="bi bi-laptop me-2"></i>
                                    {application.job?.workMode}
                                </p>

                                <span className="badge bg-primary">
                                    {application.status}
                                </span>

                                <p className="text-muted small mt-3 mb-0">
                                    Applied on{" "}
                                    {new Date(
                                        application.createdAt
                                    ).toLocaleDateString()}
                                </p>

                            </div>

                        </div>
                    </div>
                ))}

            </div>

        </div>
    )
}

export default MyApplications