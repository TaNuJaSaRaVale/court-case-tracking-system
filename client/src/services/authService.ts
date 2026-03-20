export  async function checkIt(email:string,password:string){
    const res = await fetch("https://court-case-tracking-system.onrender.com/api/auth/login",{
        method:'POST',
        headers:{
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json()
    return {
        ok:res.ok,
        data,
    }
}
export async function register(name:string,email:string,password:string,role:string) {
    const res = await fetch("https://court-case-tracking-system.onrender.com/api/auth/register",{
        method:'POST',
        headers:{
            "Content-type":"application/json",
        },
        body:JSON.stringify({
            name,
            email,
            password,
            role,
        })
    })
    const data = await res.json()
    return {
        ok:res.ok,
        data,
    }
}