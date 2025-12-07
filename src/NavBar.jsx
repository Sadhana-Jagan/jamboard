import "./navbar.css"
import { canvasDataJsonStore, tokenStore, userStore } from "./EmailStore"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


export default function NavBar() {
    const [showLogout, setShowLogout] = useState(false)
    const navigate = useNavigate()
    const username = userStore(store => store.userDetail.username)
    const tokenid = tokenStore(store => store.tokenID)
    const canvasJson = canvasDataJsonStore(store=>store.canvasJson)
    
    function handleLogoutDisplay() {
        setShowLogout(prev => !prev)
    }
    async function handleLogout(){
        console.log("check")
        const res = await fetch("https://gbuzj6ybed.execute-api.us-east-2.amazonaws.com/saveCanvas",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${tokenid}`
            },
            body:JSON.stringify({canvas:canvasJson})
        })
        const response = await res.json()
        navigate('/')
    }
    return (
        <div className="nav-bar">
            <img src="/images/jamboard-logo.png" className="logo" />
            <h2>Jamboard</h2>
            <div className="profile-pic">
                <div className="center-p">
                    <p>{username}</p>
                </div>
                <img src="/images/dummy-profile.png" onClick={handleLogoutDisplay} className="profile-pic-img" />
                {showLogout && <div className="logout-hover">
                    <button href="https://us-east-29gxssxvwo.auth.us-east-2.amazoncognito.com/logout?client_id=2346fa77sp8m7pjosv1pvjdiaf&logout_uri=http%3A%2F%2Flocalhost%3A5173%2F" onClick={handleLogout}>Logout
                        
                    </button>
                </div>}
                
            </div>

        </div>
    )
}