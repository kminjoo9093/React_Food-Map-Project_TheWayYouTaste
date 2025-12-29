import React, { useState } from "react";
import styleMember from "../../css/MemberListCheck.module.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination";

function NoticeMemberList({ notices }) {
  const [nowPage, setNowPage] = useState(1);
  const navigate = useNavigate();

  const viewPeople = 5; // 한 페이지에 보여줄 항목 수
  const limitBlock = 5; // 페이지 블록 수

  const lastMember = nowPage * viewPeople;
  const firstMember = lastMember - viewPeople;
 
  function getPrcsYn(YorN) {
    return YorN === "Y" ? "승인" : "반려";
  }

  const handleClick = (notices) => {
    navigate("/member/notice/noticeDetail", { state: notices });
  };

  const nowNotices = notices.slice(firstMember, lastMember);
  return (
    <div className="contentTopPosition">
      <div className={styleMember.middleContainer}>
        <h1>내 알림 내역</h1>
        <table className='container'>
          <thead>
            <tr>
              <th>승인 / 반려</th>
              <th>제목</th>
            </tr>
          </thead>
          <tbody>
            {nowNotices.map((notice) => (
              <tr key={notice.notiSn} onClick={() => handleClick(notice)}>
                <td>{getPrcsYn(notice.prcsYn)}</td>
                <td>{notice.notiTtl}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          nowPage={nowPage}
          totalItems={notices.length}
          itemsPerPage={viewPeople}
          limitBlock={5}
          onPageChange={setNowPage}
        />
      </div>
    </div>
  );
}

export default NoticeMemberList;
