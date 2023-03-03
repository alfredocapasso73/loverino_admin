import React, {useEffect, useState} from "react";
import {useParams, useNavigate, Link, useLocation} from "react-router-dom";
import {api_get_matches} from "../../services/api";

const Match = () => {
    const { search } = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(params.id);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [numberPartners, setNumberPartners] = useState(0);
    const [partners, setPartners] = useState([]);
    const matches_per_page = 10;

    const userClicked = (id) => {
        const url = `/user/${id}`;
        navigate(url);
    }

    useEffect(() => {
        const callFetchMatches = async () => {
            try{
                setCurrentPage(params.page);
                const result = await api_get_matches(params.page, matches_per_page);
                if(result?.status === 200 && result?.data?.partners?.length){
                    console.log("result",result);
                    setNumberPartners(result.data.count);
                    setPartners(result.data.partners);
                }
            }
            catch(exception){
                console.log('exception',exception);
            }
        }
        console.log('wtf');
        callFetchMatches().catch(console.log);
    }, []);


    return(
        <>
            <div className="row">
                <div className="col col-12">
                    <h1 className="h3 mb-2 text-gray-800">Matches</h1>
                </div>
                <div className="col col-12">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">All matches</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <div id="dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            {
                                                partners.length &&
                                                <table className="table dataTable" width="100%" cellSpacing="0">
                                                    <thead>
                                                    <tr role="row">
                                                        <th className="sorting sorting_asc" rowSpan="1" colSpan="1">
                                                            User 1
                                                        </th>
                                                        <th className="sorting"rowSpan="1" colSpan="1">
                                                            User 2
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        partners?.length && partners.map((user, index) =>
                                                            <tr key={index} className="odd user_tr">
                                                                <td>
                                                                    <div>
                                                                        <b>{user.user1.name}</b>
                                                                    </div>
                                                                    <div onClick={e => userClicked(user.user1._id)}>
                                                                        <img src={`${process.env.REACT_APP_IMAGE_SERVER_BASE}/getImage/small-picture-${user.user1.pictures[0]}`} alt="" />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div>
                                                                        <b>{user.user2.name}</b>
                                                                    </div>
                                                                    <div onClick={e => userClicked(user.user2._id)}>
                                                                        <img src={`${process.env.REACT_APP_IMAGE_SERVER_BASE}/getImage/small-picture-${user.user2.pictures[0]}`} alt="" />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                    </tbody>
                                                </table>
                                            }
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-5">
                                            <div className="dataTables_info">
                                                Showing 10 of {numberPartners} entries
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-7">
                                            <div className="dataTables_paginate paging_simple_numbers">
                                                <ul className="pagination">
                                                    {
                                                        numberOfPages > 1 &&
                                                        <li className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}`} onClick={e => navigate(`/match/1`)}>
                                                            <Link to={`/match/1`} className="page-link pointer">First</Link>
                                                        </li>
                                                    }

                                                    {
                                                        numberOfPages > 1 && currentPage > 1 &&
                                                        <li className={`paginate_button page-item`} onClick={e => navigate(`/match/${currentPage-1}`)}>
                                                            <Link to={`/match/${parseInt(currentPage)-1}`} className="page-link pointer">{parseInt(currentPage)-1}</Link>
                                                        </li>
                                                    }

                                                    <li className="paginate_button page-item disabled active">
                                                        <div className="page-link pointer">
                                                            {currentPage}
                                                        </div>
                                                    </li>

                                                    {
                                                        numberOfPages > 1 && currentPage < numberOfPages &&
                                                        <li className={`paginate_button page-item`} onClick={e => navigate(`/match/${parseInt(currentPage)+1}`)}>
                                                            <Link to={`/match/${parseInt(currentPage)+1}`} className="page-link pointer">{parseInt(currentPage)+1}</Link>
                                                        </li>
                                                    }

                                                    {
                                                        numberOfPages > 1 &&
                                                        <li className={`paginate_button page-item next ${currentPage === numberOfPages ? 'disabled' : ''}`}>
                                                            <Link to={`/match/${numberOfPages}`} className="page-link pointer">Last</Link>
                                                        </li>
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Match;