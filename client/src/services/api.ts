const BASE_URL = 'https://court-case-tracking-system.onrender.com/'

export const fetchWithAuth = async(endpoint:string)=>{
    const token = localStorage.getItem("token")

    const res = await fetch(`${BASE_URL}${endpoint}`,{
        headers:{
            "Content-Type":"application/json",
            Authorization : `Bearer ${token}`,
        },
    })

    const data = await res.json();
    return {
        ok:res.ok,
        data
    }

};
