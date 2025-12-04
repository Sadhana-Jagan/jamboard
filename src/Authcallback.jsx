import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import { userStore } from "./EmailStore"


const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID



export default function AuthCallback() {
    const location = useLocation()
    const navigate = useNavigate()
    //zustand variable to handle user
    const addUser = userStore((store)=>store.addUser)
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const authCode = params.get("code")
        if (authCode) {
            // console.log("code", authCode)
            navigate("/jamboard")
        }
        async function getTokenExchange() {
            const token = await fetch("https://us-east-29gxssxvwo.auth.us-east-2.amazoncognito.com/oauth2/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    client_id: COGNITO_CLIENT_ID,
                    code: authCode,
                    redirect_uri: "http://localhost:5173/auth/callback",
                })
            })
            const tokenparse = await token.json()
            const tokenId = tokenparse.id_token 
            const decodedToken = jwtDecode(tokenId)
            console.log(decodedToken)
            const username = decodedToken["cognito:username"]
            addUser(decodedToken.sub,decodedToken.email,decodedToken["cognito:username"])
        }
        getTokenExchange()
    }, [location])

}