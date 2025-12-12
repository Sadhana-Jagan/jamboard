import {create} from "zustand"

export const userStore = create((set)=>({
    userDetail:{subID:"",emailID:"",username:""},
    addUser:(subID,emailID,username)=>set((state)=>({userDetail:{subID,emailID,username}}))
}))

export const tokenStore = create((set)=>({
    tokenID:"",
    addToken:(tokenID)=>set((state)=>({tokenID:tokenID}))
}))

export const canvasDataJsonStore = create((set)=>({
    canvasJson:{},
    addCanvasData:(canvasJson)=>set((state)=>({canvasJson:canvasJson}))
}))

export const collabStore = create((set)=>({
    collabList:[],
    addCollabList:(item)=>set((state) => ({collabList: [...state.collabList, item]}))
}))
