export const getCases = async () =>{
    const res = await fetch("https://court-case-tracking-system.onrender.com//api/cases");
    return res.json();
};