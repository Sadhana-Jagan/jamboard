import "./navbar.css"

export default function NavBar(){
    return (
        <div className="nav-bar">
            <img src="/images/jamboard-logo.png" className="logo"/>
            <h2>Jamboard</h2>
            <div className="profile-pic">
                <img src="/images/dummy-profile.png" className="profile-pic-img"/>
            </div>
        </div>
    )
}