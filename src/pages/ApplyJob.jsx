import { useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import {toast} from "react-toastify"

function ApplyJob(){
    const {id}=useParams()

    const [resume,setResume]=useState("")
    const [coverLetter,setCoverLetter]=useState("")

    const navigate = useNavigate()

    const handleApply=async(e)=>{
        e.preventDefault()
        const token = localStorage.getItem("token")
        if(!token){
            navigate("/login")
            return
        }
        try {
            const formData = new FormData()
            formData.append("jobId",id)
            formData.append("resume",resume)
            formData.append("coverLetter",coverLetter)

            const response = await fetch("https://talenthub-backend-0v0r.onrender.com/api/applications",{
                method:"POST",
                headers:{
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })
            const data = await response.json()
            if(!response.ok){
                toast.error(data.message)
                return
            }
            toast.success("Application submitted successfully!")
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong. Please try again.")
        }
    }
    return(
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h2 className="fw-bold mb-4 text-center">
                                Apply for Job
                            </h2>
                            <form onSubmit={handleApply}>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Resume
                                    </label>
                                    <input 
                                        type="file" 
                                        className="form-control"
                                        accept="application/pdf"
                                        onChange={(e)=>setResume(e.target.files[0])}
                                        required
                                    />
                                    <div className="form-text">
                                        Only PDF files are allowed. Maximum size: 5MB.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Cover Letter
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows="6"
                                        placeholder="Write your cover letter"
                                        value={coverLetter}
                                        onChange={(e)=>setCoverLetter(e.target.value)}
                                        required
                                    >
                                    </textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    Submit Application
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ApplyJob