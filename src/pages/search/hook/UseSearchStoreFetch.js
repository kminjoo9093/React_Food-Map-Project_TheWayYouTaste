import { useState, useEffect } from "react";

export default function UseSearchStoreFetch(url){
    const [data, setData] = useState([]);

    useEffect(
        ()=>{
            const fetchData = async() => {
                try{
                    // const url = "http://localhost:3001/store";
                    const res = await fetch(url);
                    if(!res.ok){
                        throw new Error(`Http error! status : ${res.status}`);
                    }
                    //ok인 경우
                    const data = await res.json();
                    //console.log(data);
                    setData(data);
                } catch(err){
                    console.error("when getting data, has error - " + err);
                }
            }
            fetchData();
    }, [url]);

    return data;
}