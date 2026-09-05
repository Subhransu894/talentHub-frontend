import { useEffect, useState } from "react"
import JobCard from "../components/JobCard"

function Home(){
    const [jobs,setJobs]=useState([])
    const [search,setSearch]=useState("")
    const [location,setLocation]=useState("")
    const [salaryMin,setSalaryMin]=useState("")
    const [employmentType,setEmploymentType]=useState("")
    const [workMode,setWorkMode]=useState("")
    const [sort,setSort]=useState("")

    const [bookmarkedJobs,setBookmarkedJobs] = useState([])

    const fetchJobs=async()=>{
        try {
            const response = await fetch(
                `https://talenthub-backend-0v0r.onrender.com/api/jobs?search=${search}&location=${location}&salaryMin=${salaryMin}&employmentType=${employmentType}&workMode=${workMode}&sort=${sort}`
            )
            const data =await response.json()
            setJobs(data.jobs)
        } catch (error) {
            console.error("Fetch jobs error:", error)
        }
    }
    useEffect(()=>{
        fetchJobs()
    },[search,location,salaryMin,employmentType,workMode,sort])

    const fetchBookmarkedJobs = async()=>{
        const token = localStorage.getItem("token")

        if(!token){
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

            if(response.ok){
                setBookmarkedJobs(data.bookmarkedJobs)
            }

        } catch(error) {
            console.error("Fetch bookmarks error:",error)
        }
    }
    useEffect(()=>{
        fetchBookmarkedJobs()
    },[])

    return(
        <div className="container py-4">
            {/* Headiing */}
            <div className="mb-4">
                <h1 className="fw-bold">Find Your Next Job</h1>
                <p className="text-muted">
                    Discover opportunities that match your skills.
                </p>
            </div>
            {/* searhcing */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-12 col-lg-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input type="text" className="form-control" placeholder="Search jobs,companys..."
                                    value={search} onChange={(e)=>setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <select 
                                className="form-select"
                                value={employmentType}
                                onChange={(e)=>setEmploymentType(e.target.value)}
                            >
                                <option value="">Employment Type</option>
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="internship">Internship</option>
                                <option value="contract">Contract</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <select 
                                className="form-select"
                                value={workMode}
                                onChange={(e)=>setWorkMode(e.target.value)}
                            >
                                <option value="">Work Mode</option>
                                <option value="remote">Remote</option>
                                <option value="on-site">On-site</option>
                            </select>
                        </div>
                    </div>
                     <div className="row g-3 mt-1">
                            <div className="col-12 col-md-6 col-lg-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Location"
                                    value={location}
                                    onChange={(e)=>setLocation(e.target.value)}
                                />
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Minimum Salary"
                                    value={salaryMin}
                                    onChange={(e)=>setSalaryMin(e.target.value)}
                                />
                            </div>
                            <div className="col-12 col-lg-4">
                                <select 
                                    className="form-select"
                                    value={sort}
                                    onChange={(e)=>setSort(e.target.value)}
                                >
                                    <option value="">Sort By</option>
                                    <option value="newest">Newest</option>
                                    <option value="salary-desc">
                                        Salary: High to Low
                                    </option>
                                    <option value="salary-asc">
                                        Salary: Low to High
                                    </option>
                                    <option value="oldest">Oldest</option>
                                </select>
                            </div>
                    </div>
                </div>
            </div>
            {/* jobs */}
            <div className="row g-4">
                {jobs.map((job)=>(
                    <div className="col-12 col-md-6 col-lg-4" key={job._id}>
                        <JobCard job={job} bookmarkedJobs={bookmarkedJobs} setBookmarkedJobs={setBookmarkedJobs} />
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Home