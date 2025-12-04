import "./navbar.css"
import { userStore } from "./EmailStore"

export default function NavBar(){
    const username = userStore(store=>store.userDetail.username)
    return (
        <div className="nav-bar">
            <img src="/images/jamboard-logo.png" className="logo"/>
            <h2>Jamboard</h2>
             <div className="profile-pic">
                <div className="center-p">
                    <p>{username}</p>
                </div>
                <img src="/images/dummy-profile.png" className="profile-pic-img"/>
                
            </div> 
            
        </div>
    )
}