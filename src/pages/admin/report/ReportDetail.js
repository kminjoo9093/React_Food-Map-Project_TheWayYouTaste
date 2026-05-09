import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styleReport from "../../../css/Report.module.css";
import styleMember from "../../../css/MemberListCheck.module.css";
import styleNotice from "../../../css/Notice.module.css";
import serverUrl from "../../../config/server.json";
import axios from "axios";

function ReportDetail({ setMemberNotices }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [stores, setStores] = useState([]);
  const report = location.state;
  const SERVER_URL = serverUrl.SERVER_URL;

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/youtaste/search/store/all`)
      .then((res) => setStores(res.data))
      .catch((err) => console.error("가게 목록 로드 실패", err));
  }, []);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/membership/check`)
      .then((res) => setMembers(res.data))
      .catch((err) => console.error("회원 목록 로드 실패", err));
  }, []);

  const [showDetail, setShowDetail] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState(report?.dclrTtl || "");
  const [isActionBoxOpen, setIsActionBoxOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionReason, setActionReason] = useState("");

  if (!report) return <p>신고 정보가 없습니다.</p>;

  const { dclrTtl, dclrCn, dclrCatNo, userSn, bplcSn, storeName, isAdmin } =
    report;

  function getDclrCatName(catNo) {
    switch (catNo) {
      case 1:
        return "폐업 신고";
      case 2:
        return "허위 사실 신고";
      case 3:
        return "리뷰 신고";
      default:
        return "기타 신고";
    }
  }

  const openActionBox = (type) => {
    setActionType(type);
    setActionReason("");
    setIsActionBoxOpen(true);
  };

  const closeActionBox = () => setIsActionBoxOpen(false);

  function transName(userSn) {
    const member = members.find((m) => m.userSn === userSn);
    return member ? member.userNm : report.writer || report.userName || userSn; // 이름을 찾으면 반환, 없으면 번호 그대로 표시
  }

  function transStore(bplcSn) {
    const store = stores.find((s) => s.bplcSn === bplcSn);
    return store ? store.bplcNm : report.storeName || bplcSn; // 이름을 찾으면 반환, 없으면 번호 그대로 표시
  }

  const handleSubmit = async (title) => {
    const prcsYnValue = actionType === "수리" ? "Y" : "N";

    const updateData = {
      prcsYn: prcsYnValue,
      notiTtl: title,
      notiCn: actionReason,
    };

    try {
      // 신고 상태 업데이트
      const updateRes = await fetch(
        `${SERVER_URL}/youtaste/reports/${report.dclrSn}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        },
      );

      if (!updateRes.ok) throw new Error("신고 처리 업데이트 실패");

      // 반려(N) 처리 시 MemberNotice에 바로 추가
      if (prcsYnValue === "N") {
        const noticeData = {
          userSn: report.userSn,
          notiTtl: title,
          notiCn: actionReason,
          prcsYn: "N",
        };

        // const noticeRes = await fetch(
        //   `${SERVER_URL}/youtaste/member-notices`,
        //   {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(noticeData)
        //   }
        // );

        // if (!noticeRes.ok) throw new Error("공지사항 등록 실패");

        // const newNotice = await noticeRes.json();
        // // MemberNoticeList에 즉시 반영
        // setMemberNotices(prev => [newNotice, ...prev]);
      }

      alert("처리 완료!");
      navigate("/notice/list");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="contentTopPosition">
      <div className={styleMember.middleContainer}>
        <h1>신고 내역</h1>

        <table className="container" style={{ marginBottom: "100px" }}>
          <thead>
            <tr>
              <th>카테고리</th>
              <th>매장</th>
              <th>제목</th>
              <th>작성자</th>
              <th>자세히보기</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{getDclrCatName(dclrCatNo)}</td>
              <td>{transStore(bplcSn)}</td>
              <td>{dclrTtl}</td>
              <td>{transName(userSn)}</td>
              <td>
                <button
                  onClick={() => setShowDetail(!showDetail)}
                  className="button"
                >
                  자세히 보기
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        {showDetail && (
          <div className="container">
            <h3>신고 사유</h3>
            <textarea className={styleReport.textarea} disabled>
              {dclrCn}
            </textarea>

            {isAdmin && (
              <div className="rightContainer">
                <button
                  onClick={() => openActionBox("수리")}
                  className="button"
                >
                  수리
                </button>
                <button
                  onClick={() => openActionBox("반려")}
                  className="button"
                >
                  반려
                </button>
              </div>
            )}
          </div>
        )}

        {isActionBoxOpen && (
          <div className={styleNotice.popupDimmed}>
            <div className={styleNotice.popupBox}>
              <h2>{actionType} 처리</h2>
              <p>제목:</p>
              <input
                type="text"
                className={styleNotice.popupInput}
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="제목을 입력하세요"
              />
              <p>날짜: {new Date().toLocaleDateString()}</p>
              <p>카테고리 : {getDclrCatName(dclrCatNo)}</p>
              <textarea
                className={styleNotice.popupTextarea}
                placeholder="사유를 작성하세요"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
              <div className={styleNotice.popupButtonGroup}>
                <button
                  className={styleNotice.confirmBtn}
                  onClick={() => handleSubmit(noticeTitle)}
                >
                  등록
                </button>
                <button
                  className={styleNotice.cancelBtn}
                  onClick={closeActionBox}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportDetail;
