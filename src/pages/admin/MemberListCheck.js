import "../../css/MemberListCheck.css"

function MemberListCheck() {
  return (
  <>  
    <table>
        <thead>
            <tr>
                <th>회원명</th>
                <th>ID</th>
                <th>회원Email</th>
                <th>신고처리여부</th>
                <th>이용자 권한</th>
                <th>탈퇴</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>김윤중</td>
                <td>1234</td>
                <td>dbswnd0606@naver.com</td>
                <td>x</td>
                <td>손님</td>
                <td><button>탈퇴</button></td>
            </tr>
        </tbody>
    </table>
  </>
  )
}

export default MemberListCheck;
