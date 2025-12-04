// import Header from "./component/Header";
// import Day from "./component/Day";
import { BrowserRouter,Routes,Route, Navigate } from "react-router-dom";
import Error404Page from "./Error404Page";
// import CreateWord from "./component/CreateWord";
// import CreateDay from "./component/CreateDay";
import { useEffect, useState } from "react";
import MemberListCheck from "./pages/admin/MemberListCheck"
import Header from "./pages/Header";

function TheWayYouTaste() {
  //  const[days,setDays] = useState([]);

  //  useEffect( ()=> {
  //   const fetchDays = async () => {
  //       const res = await fetch("http://localhost:3001/days");
  //       const data = await res.json();
  //       setDays(data);
  //   }
  //   fetchDays();
   
  
  // },[]);

  return (
     <BrowserRouter>
      <div className="App">
          <Header />
          <Routes>
            {/* <Route exact path="/" element={ <DayList/> }/> */}
            {/* <Route exact path="/" element={ <Navigate to="/day/1" replace/> }/> */}
            <Route path="/admin/member/list" element={ <MemberListCheck /> }/> 
            <Route path="/*" element={<Error404Page/>}/>
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default TheWayYouTaste;
