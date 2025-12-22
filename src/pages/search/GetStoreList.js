export async function GetStoreList(url){
        try{
            //const url = "http://localhost:3001/store";
            const res = await fetch(url);
            if(!res.ok){
                throw new Error(`Http error! status : ${res.status}`);
            }
            //ok인 경우
            return await res.json();
            //console.log(data);
        } catch(err){
            console.log("데이터 로드 중 오류: ", err);
            return [];
        }
    }