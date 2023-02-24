import React, {useEffect, useState} from "react";
import {api_get_users} from "../../services/api";
import {get_age_from_birthday, human_readable_date} from '../../helpers/helper';
import {useParams, useNavigate, Link, useLocation} from "react-router-dom";

const Home = () => {
    const { search } = useLocation();
    const params = useParams();
    const tmp_sort_by = new URLSearchParams(search).get("sorting");
    const tmp_sort_dir = new URLSearchParams(search).get("dir");
    const sorting_by = tmp_sort_by ? tmp_sort_by : 'createdAt';
    const sorting_dir = tmp_sort_dir ? tmp_sort_dir : 'desc';
    const sortBy = sorting_by;
    const sortDir = sorting_dir;
    //const [sortBy, setSortBy] = useState(sorting_by);
    //const [sortDir, setSortDir] = useState(sorting_dir);


    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(params.id);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [numberOfUsers, setNumberOfUsers] = useState(0);
    const users_per_page = 10;
    const userClicked = (id) => {
        const url = `/user/${id}`;
        navigate(url);
    }

    const formatUserFields = (users) => {
        users.forEach(el => {
            el.gender = el.gender === 'f' ? 'female' : 'male';
            el.createdAt = el.createdAt ? human_readable_date(el.createdAt) : '';
            el.age = el.birthday ? get_age_from_birthday(el.birthday) : '';
        });
        return users;
    }

    const getArrowDown = (field) => {
        return <a href={`/home/${currentPage}?sorting=${field}&dir=asc`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className={`bi bi-arrow-down pointer`} viewBox="0 0 16 16">
            <path fill="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
        </svg></a>;
    }

    const getArrowUp = (field) => {
        return <a href={`/home/${currentPage}?sorting=${field}&dir=desc`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className={`bi bi-arrow-up pointer`} viewBox="0 0 16 16">
            <path fill="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
        </svg></a>;
    }


    useEffect(() => {
        const callFetchUsers = async () => {
            try{
                setCurrentPage(params.page);
                const result = await api_get_users(params.page, users_per_page, sortBy, sortDir);
                if(result?.status === 200 && result?.data?.users?.length){
                    setUsers(formatUserFields(result.data.users));
                    setNumberOfUsers(result.data.count);
                    setNumberOfPages(Math.ceil(result.data.count/users_per_page));
                }
            }
            catch(exception){
                console.log('exception',exception);
            }
        }
        callFetchUsers().catch(console.log);
    }, [params, sortBy, sortDir]);


    return(
        <>
            <div className="row">
                <div className="col col-12">
                    <h1 className="h3 mb-2 text-gray-800">Users</h1>
                </div>
                <div className="col col-12">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">All users</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <div id="dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            {
                                                users?.length &&
                                                <table className="table table-bordered dataTable" width="100%" cellSpacing="0">
                                                    <thead>
                                                    <tr role="row">
                                                        <th className="sorting sorting_asc" rowSpan="1" colSpan="1">
                                                            {getArrowUp('name')}
                                                            {getArrowDown('name')}
                                                            Name
                                                        </th>
                                                        <th className="sorting"rowSpan="1" colSpan="1">
                                                            {getArrowUp('email')}
                                                            {getArrowDown('email')}
                                                            Email
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            {getArrowUp('birthday')}
                                                            {getArrowDown('birthday')}
                                                            Age
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            {getArrowUp('active')}
                                                            {getArrowDown('active')}
                                                            Status
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            {getArrowUp('is_paying_user')}
                                                            {getArrowDown('is_paying_user')}
                                                            Paying
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            Region
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            City
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            Pictures
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            {getArrowUp('gender')}
                                                            {getArrowDown('gender')}
                                                            Gender
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            {getArrowUp('status')}
                                                            {getArrowDown('status')}
                                                            Progress
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            {getArrowUp('createdAt')}
                                                            {getArrowDown('createdAt')}
                                                            Created At
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        users?.length && users.map((user, index) =>
                                                            <tr key={index} className="odd user_tr" onClick={e => userClicked(user._id)}>
                                                                <td className="sorting_1">{user.name}</td>
                                                                <td>{user.email}</td>
                                                                <td>{user.age}</td>
                                                                <td>
                                                                    {user.active && <span className="badge badge-success">Active</span>}
                                                                    {!user.active && <span className="badge badge-danger">Inactive</span>}
                                                                </td>
                                                                <td>
                                                                    {user.is_paying_user && <span className="badge badge-success">Yes</span>}
                                                                    {!user.is_paying_user && <span className="badge badge-danger">No</span>}
                                                                </td>
                                                                <td>{user.region_name}</td>
                                                                <td>{user.city_name}</td>
                                                                <td>{user.pictures.length}</td>
                                                                <td>{user.gender}</td>
                                                                <td>{user.status}</td>
                                                                <td>{user.createdAt}</td>
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
                                                Showing 10 of {numberOfUsers} entries
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-7">
                                            <div className="dataTables_paginate paging_simple_numbers">
                                                <ul className="pagination">
                                                    {
                                                        numberOfPages > 1 &&
                                                        <li className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}`} onClick={e => navigate(`/home/1`)}>
                                                            <Link to={`/home/1`} className="page-link pointer">First</Link>
                                                        </li>
                                                    }

                                                    {
                                                        numberOfPages > 1 && currentPage > 1 &&
                                                        <li className={`paginate_button page-item`} onClick={e => navigate(`/home/${currentPage-1}`)}>
                                                            <Link to={`/home/${parseInt(currentPage)-1}`} className="page-link pointer">{parseInt(currentPage)-1}</Link>
                                                        </li>
                                                    }

                                                    <li className="paginate_button page-item disabled active">
                                                        <div className="page-link pointer">
                                                            {currentPage}
                                                        </div>
                                                    </li>

                                                    {
                                                        numberOfPages > 1 && currentPage < numberOfPages &&
                                                        <li className={`paginate_button page-item`} onClick={e => navigate(`/home/${parseInt(currentPage)+1}`)}>
                                                            <Link to={`/home/${parseInt(currentPage)+1}`} className="page-link pointer">{parseInt(currentPage)+1}</Link>
                                                        </li>
                                                    }

                                                    {
                                                        numberOfPages > 1 &&
                                                        <li className={`paginate_button page-item next ${currentPage === numberOfPages ? 'disabled' : ''}`}>
                                                            <Link to={`/home/${numberOfPages}`} className="page-link pointer">Last</Link>
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
export default Home;