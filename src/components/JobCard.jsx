import { Link } from "react-router-dom"
import { toast } from "react-toastify"
function JobCard({job,bookmarkedJobs, setBookmarkedJobs}){
    const token = localStorage.getItem("token") 
    const isBookmarked = bookmarkedJobs?.some( (id) => id === job._id || id?._id === job._id )
    const handleBookmark = async()=>{ 
        if(!token){ 
            toast.error("Please login to bookmark jobs.")
            return 
        } 
        try {
             if(isBookmarked){ 
                const response = await fetch( `https://talenthub-backend-0v0r.onrender.com/api/bookmarks/${job._id}`, 
                    { method:"DELETE", headers:{ Authorization:`Bearer ${token}` } } 
                )
                const data = await response.json() 
                if(!response.ok){ 
                    toast.error(data.message) 
                    return 
                } 
                setBookmarkedJobs( bookmarkedJobs.filter( (id) => id !== job._id && id?._id !== job._id ) ) 
                toast.success("Bookmark removed.") 
            }else{ 
                const response = await fetch( `https://talenthub-backend-0v0r.onrender.com/api/bookmarks/${job._id}`,
                     { 
                        method:"POST", 
                        headers:{ 
                            Authorization:`Bearer ${token}` 
                        }
                    }) 
                const data = await response.json() 
                if(!response.ok){ 
                    toast.error(data.message) 
                    return 
                } 
                setBookmarkedJobs([ ...bookmarkedJobs, job._id ]) 
                toast.success("Job bookmarked.") 
            }
        } 
        catch(error) {
             console.error("Bookmark error:",error) 
             toast.error("Something went wrong. Please try again.") 
        } 
    }
    return(
         <div className="card h-100 shadow-sm border-0">

            <div className="card-body d-flex flex-column">

                <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title fw-bold mb-1">
                        {job.title}
                    </h5>
                    <button
                        type="button"
                        className="btn btn-light border-0"
                        onClick={handleBookmark}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark job"}
                    >
                        <i
                            className={`bi ${
                                isBookmarked
                                    ? "bi-bookmark-fill text-primary"
                                    : "bi-bookmark"
                            } fs-5`}
                        ></i>
                    </button>

                </div>

                <p className="text-muted mb-3">
                    <i className="bi bi-building me-2"></i>
                    {job.company}
                </p>

                <p className="mb-2">
                    <i className="bi bi-geo-alt me-2"></i>
                    {job.location}
                </p>

                <p className="mb-2">
                    <i className="bi bi-currency-rupee me-2"></i>
                    {job.salary} / month
                </p>

                <p className="mb-3">
                    <i className="bi bi-briefcase me-2"></i>
                    {job.experience} years experience
                </p>

                <div className="mb-3">
                    <span className="badge bg-primary me-2">
                        {job.employmentType}
                    </span>

                    <span className="badge bg-secondary">
                        {job.workMode}
                    </span>
                </div>

                <div className="mb-3">
                    {job.skills.map((skill, index) => (
                        <span
                            key={index}
                            className="badge bg-light text-dark border me-1 mb-1"
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                <p className="text-muted small mb-3">
                    <i className="bi bi-calendar-event me-2"></i>
                    Apply before{" "}
                    {new Date(job.applicationDeadline).toLocaleDateString()}
                </p>

                <Link to={`/jobs/${job._id}`} className="btn btn-primary w-100 mt-auto">
                    View Details
                </Link>

            </div>
        </div>
    )
}
export default JobCard