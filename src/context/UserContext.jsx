import {createContext,useContext,useEffect,useState} from 'react';
const API_URL=import.meta.env.VITE_API_URL||'';
export const UserContext=createContext();
export function UserProvider({children}){
 const [user,setUser]=useState(null);const [loading,setLoading]=useState(true);
 async function api(path,options={}){
  const r=await fetch(API_URL+path,{...options,credentials:'include',headers:{'Content-Type':'application/json',...options.headers}});
  let data;try{data=await r.json();}catch{throw new Error('API connection failed. Check the backend URL and deployment.');}
  if(!r.ok){if(r.status===401)setUser(null);throw new Error(data.message||'Request failed');}return data;
 }
 useEffect(()=>{let active=true;fetch(API_URL+'/api/user',{credentials:'include'}).then(async r=>r.ok?(await r.json()).user:null).then(u=>{if(active)setUser(u);}).catch(()=>{}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
 async function login(email,password){const result=await api('/api/auth/login',{method:'POST',body:JSON.stringify({email,password})});setUser(result.user);}
 async function logout(){await api('/api/auth/logout',{method:'POST'});setUser(null);}
 return <UserContext.Provider value={{user,loading,api,login,logout}}>{children}</UserContext.Provider>;
}
export function useUser(){return useContext(UserContext);}
