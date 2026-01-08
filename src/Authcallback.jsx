import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { canvasDataJsonStore, tokenStore, userStore } from "./EmailStore"

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID




export default function AuthCallback() {
    const location = useLocation()
    const navigate = useNavigate()
    //zustand variable to handle user
    const addUser = userStore((store) => store.addUser)
    const addToken = tokenStore((store)=>store.addToken)
    const addCanvasJson = canvasDataJsonStore((store)=>store.addCanvasData)
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const authCode = params.get("code")
        if (authCode) {
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
            try {
                if (tokenparse) {
                    const tokenId = tokenparse.id_token
                    addToken(tokenId)
                    const decodedToken = jwtDecode(tokenId)
                    const subID = decodedToken.sub
                    const emailID = decodedToken.email
                    const username = decodedToken["cognito:username"]
                    addUser(subID, emailID, username)
                    const res = await fetch("https://gbuzj6ybed.execute-api.us-east-2.amazonaws.com/getCanvasData",{
                        method:"GET",
                        headers:{
                            "Authorization":`Bearer ${tokenId}`
                        }
                    })
                    if(!res){
                        addCanvasJson({}) 
                        return
                    }
                    // console.log("fetch success")
                    const jsonResponse = await res.json()
                    const canvasJsonResponse = jsonResponse.canvas
                    //console.log("canvas json: ",canvasJsonResponse)
                    addCanvasJson(canvasJsonResponse)
                    console.log("login successful")
                    
                }
            } catch (error) {
                console.error("Error fetching token from cognito or error fetching canvas data from dynamodb", error);
            }

        }
        getTokenExchange()
    }, [location])

}