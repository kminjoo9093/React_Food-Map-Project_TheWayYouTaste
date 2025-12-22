import { Link } from "react-router-dom";

function Error404Page(){

    return (
        <>
            <div className="contentTopPosition">
                <div className="container">
                    <h1>잘못된 접근입니다.</h1>
                    <h1><Link to="/" >돌아가기</Link></h1>
                </div>
            </div>
        </>
    )
}

export default Error404Page;