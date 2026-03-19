export const getCases = async () =>{
    const res = await fetch("http://localhost:5000/api/cases");
    return res.json();
};