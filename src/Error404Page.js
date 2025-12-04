import { Link } from "react-router-dom";

function Error404Page(){

    return (
        <>
            <h2>잘못된 접근입니다. </h2>
            <Link to="/" >돌아가기</Link>
        </>
    )
}

export default Error404Page;