export async function GetStoreList(url){
        try{
            const res = await fetch(url);
            console.log("res --> ", res.ok);
            if(!res.ok){
                throw new Error(`Http error! status : ${res.status}`);
            }
            return await res.json();
        } catch(err){
            console.log("데이터 로드 중 오류: ", err);
            return [];
        }
    }