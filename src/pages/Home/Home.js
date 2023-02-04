import React, {useEffect, useState} from "react";
import {api_get_users} from "../../services/api";
import {get_age_from_birthday, human_readable_date} from '../../helpers/helper';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [numberOfUsers, setNumberOfUsers] = useState(0);
    const users_per_page = 10;

    const fetchUsers = async (direction='f') => {
        try{
            const current_page = direction === 'f' ? currentPage +1 : currentPage -1;
            setCurrentPage(current_page);
            const result = await api_get_users(current_page, users_per_page);
            if(result?.status === 200 && result?.data?.users?.length){
                result.data.users.map(el => {
                    el.gender = el.gender === 'f' ? 'female' : 'male';
                    el.createdAt = human_readable_date(el.createdAt);
                    el.age = get_age_from_birthday(el.birthday);
                });
                setUsers(result.data.users);
                setNumberOfUsers(result.data.count);
                setNumberOfPages(Math.ceil(result.data.count/users_per_page));
            }
        }
        catch(exception){
            console.log('exception',exception);
        }
    }

    useEffect(() => {
        if(!users?.length){
            fetchUsers().catch(console.log);
        }
    }, []);


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
                                                            Name
                                                        </th>
                                                        <th className="sorting"rowSpan="1" colSpan="1">
                                                            Email
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            Age
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            Status
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            Paying
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            Region
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            City
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            Gender
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            Progress
                                                        </th>
                                                        <th className="sorting" rowSpan="1" colSpan="1">
                                                            Created At
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        users?.length && users.map((user, index) =>
                                                            <tr key={index} className="odd">
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
                                                Showing 1 to 10 of 57 entries
                                                {numberOfPages && <span>numberOfPages:{numberOfPages}</span>}
                                                ---
                                                {currentPage && <span>currentPage: {currentPage}</span>}
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-7">
                                            <div className="dataTables_paginate paging_simple_numbers">
                                                <ul className="pagination">
                                                    {
                                                        numberOfPages > 1 &&
                                                        <li className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}`} onClick={e => fetchUsers('b')}>
                                                            <div className="page-link pointer">
                                                                Previous
                                                            </div>
                                                        </li>
                                                    }

                                                    {
                                                        numberOfPages > 1 && currentPage > 1 &&
                                                        <li className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}`} onClick={e => fetchUsers('f')}>
                                                            <div className="page-link pointer">
                                                                {currentPage-1}
                                                            </div>
                                                        </li>
                                                    }

                                                    <li className="paginate_button page-item disabled active">
                                                        <div className="page-link pointer">
                                                            {currentPage}
                                                        </div>
                                                    </li>

                                                    {
                                                        numberOfPages > 1 && currentPage < numberOfPages &&
                                                        <li className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}`} onClick={e => fetchUsers('b')}>
                                                            <div className="page-link pointer">
                                                                {currentPage+1}
                                                            </div>
                                                        </li>
                                                    }

                                                    {
                                                        numberOfPages > 1 &&
                                                        <li className={`paginate_button page-item next ${currentPage === numberOfPages ? 'disabled' : ''}`} onClick={e => fetchUsers('f')}>
                                                            <div className="page-link pointer">
                                                                Next
                                                            </div>
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