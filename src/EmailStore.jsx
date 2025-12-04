import {create} from "zustand"

export const userStore = create((set)=>({
    userDetail:{subID:"",emailID:"",username:""},
    addUser:(subID,emailID,username)=>set((state)=>({userDetail:{subID,emailID,username}}))
}))

