import { useState, useEffect } from "react";
import { GetStoreList } from "../GetStoreList";

export default function UseSearchStoreFetch(url){
    const [data, setData] = useState([]);

    useEffect(
        ()=>{
            if(!url) return;
            const fetchData = async() => {
                try{
                    // const url = "http://localhost:3001/store";
                    const result = await GetStoreList(url);

                    setData(result);
                } catch(err){
                    console.error("when getting data, has error : " + err);
                    setData([]);
                }
            }
            fetchData();
    }, [url]);

    return data;
}