import { useState, useEffect } from "react";
import { GetStoreList } from "../GetStoreList";

export default function UseSearchStoreFetch(url){
    const [data, setData] = useState([]);

    useEffect(
        ()=>{
            if(!url) return;
            const fetchData = async() => {
                try{
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