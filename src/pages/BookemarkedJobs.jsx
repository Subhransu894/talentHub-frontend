import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import JobCard from "../components/JobCard"
import { toast } from "react-toastify"

function BookmarkedJobs(){

    const [bookmarkedJobs,setBookmarkedJobs] = useState([])

    const navigate = useNavigate()

    const fetchBookmarkedJobs = async()=>{
        const token = localStorage.getItem("token")

        if(!token){
            navigate("/login")
            return
        }

        try {
            const response = await fetch(
                "https://talenthub-backend-0v0r.onrender.com/api/bookmarks",
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

            setBookmarkedJobs(data.bookmarkedJobs)

        } catch(error) {
            console.error("Fetch bookmarked jobs error:",error)
            toast.error("Something went wrong. Please try again.")
        }
    }

    useEffect(()=>{
        fetchBookmarkedJobs()
    },[])

    return(
        <div className="container py-4">

            <h2 className="fw-bold mb-4">
                Bookmarked Jobs
            </h2>

            {bookmarkedJobs.length === 0 && (
                <div className="alert alert-info">
                    You haven't bookmarked any jobs yet.
                </div>
            )}

            <div className="row g-4">

                {bookmarkedJobs.map((job)=>(
                    <div
                        className="col-12 col-md-6 col-lg-4"
                        key={job._id}
                    >
                        <JobCard
                            job={job}
                            bookmarkedJobs={bookmarkedJobs}
                            setBookmarkedJobs={setBookmarkedJobs}
                        />
                    </div>
                ))}

            </div>

        </div>
    )
}

export default BookmarkedJobs