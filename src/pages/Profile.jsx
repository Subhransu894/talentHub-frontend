import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {toast} from "react-toastify"
function Profile(){
    const [user, setUser] = useState(null)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        photo: "",
        bio: "",
        experience: "",
        education: "",
        skills: "",
        companyName: "",
        companyLogo: "",
        website: "",
        aboutCompany: ""
    })
    const fetchProfile=async()=>{
        const token = localStorage.getItem("token")
        if(!token){
            navigate("/login")
            return
        }
        try {
            const response = await fetch("https://talenthub-backend-0v0r.onrender.com/api/users/profile",{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (!response.ok) {
                toast.error(data.message)
                return
            }
            setUser(data.user)
            setFormData({
                name: data.user.name || "",
                photo: data.user.photo || "",
                bio: data.user.bio || "",
                experience: data.user.experience || "",
                education: data.user.education || "",
                skills: data.user.skills?.join(", ") || "",
                companyName: data.user.companyName || "",
                companyLogo: data.user.companyLogo || "",
                website: data.user.website || "",
                aboutCompany: data.user.aboutCompany || ""
            })
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong. Please try again.")
        }
    }
    useEffect(()=>{
        fetchProfile()
    },[])
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem("token")
        try {
            const response = await fetch(
                "https://talenthub-backend-0v0r.onrender.com/api/users/profile",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...formData,
                        skills: formData.skills
                            .split(",")
                            .map(skill => skill.trim())
                            .filter(skill => skill !== "")
                    })
                }
            )
            const data = await response.json()
            if (!response.ok) {
                toast.error(data.message)
                return
            }
            setUser(data.user)
            toast.success("Profile updated successfully!")
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong. Please try again.")
        }
    }
     if(!user){
            return (
                <div className="container py-5">
                    <p>Loading profile...</p>
                </div>
            )
        }
    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                             <h2 className="fw-bold mb-4">
                                My Profile
                            </h2>
                            <div className="mb-4">
                                <p className="mb-1">
                                    <strong>Email:</strong> {user.email}
                                </p>
                                <p className="mb-0">
                                    <strong>Role:</strong>{" "}
                                    {user.role}
                                </p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {user.role === "applicant" && (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Photo URL
                                            </label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                name="photo"
                                                value={formData.photo}
                                                onChange={handleChange}
                                                placeholder="https://example.com/photo.jpg"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Bio
                                            </label>
                                            <textarea
                                                className="form-control"
                                                name="bio"
                                                rows="3"
                                                value={formData.bio}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Experience
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="experience"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                placeholder="e.g. Fresher / 2 years"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Education
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="education"
                                                value={formData.education}
                                                onChange={handleChange}
                                                placeholder="e.g. B.Tech Computer Science"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Skills
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                placeholder="React, JavaScript, Node.js"
                                            />
                                            <div className="form-text">
                                                Separate skills with commas.
                                            </div>
                                        </div>
                                    </>
                                )}
                                {user.role === "recruiter" && (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Company Logo URL
                                            </label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                name="companyLogo"
                                                value={formData.companyLogo}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Website
                                            </label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                About Company
                                            </label>
                                            <textarea
                                                className="form-control"
                                                name="aboutCompany"
                                                rows="4"
                                                value={formData.aboutCompany}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                    </>
                                )}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    Save Profile
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Profile