import React, {useEffect, useState} from "react";
import {api_get_users} from "../../services/api";
import {get_age_from_birthday, human_readable_date} from '../../helpers/helper';
import {useNavigate} from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [numberOfUsers, setNumberOfUsers] = useState(0);
    const users_per_page = 10;
    const [currentSort, setCurrentSort] = useState('name');
    const [currentSortDirection, setCurrentSortDirection] = useState('asc');
    const color_current_in_use = 'red';
    const color_current_not_in_use = 'black';

    const userClicked = (id) => {
        const url = `/user/${id}`;
        navigate(url);
    }

    const formatUserFields = (users) => {
        users.map(el => {
            el.gender = el.gender === 'f' ? 'female' : 'male';
            el.createdAt = human_readable_date(el.createdAt);
            el.age = get_age_from_birthday(el.birthday);
        });
        return users;
    }

    const sort = async (field, direction, void_function) => {
        if(!void_function){
            setCurrentSort(field);
            setCurrentSortDirection(direction);
            setCurrentPage(1);
            try{
                const result = await api_get_users(1, users_per_page, field, direction);
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
    }

    const getArrowDown = (field) => {
        let color = color_current_not_in_use;
        let pointer = 'pointer';
        let void_function = false;
        if(field === currentSort && currentSortDirection === 'asc'){
            color = color_current_in_use;
            pointer = '';
            void_function = true;
        }
        return <svg onClick={e => sort(field, 'asc', void_function)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={color} className={`bi bi-arrow-down ${pointer}`} viewBox="0 0 16 16">
            <path fill="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
        </svg>;
    }

    const getArrowUp = (field) => {
        let color = color_current_not_in_use;
        let pointer = 'pointer';
        let void_function = false;
        if(field === currentSort && currentSortDirection === 'desc'){
            color = color_current_in_use;
            pointer = '';
            void_function = true;
        }
        return <svg onClick={e => sort(field, 'desc', void_function)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={color} className={`bi bi-arrow-up ${pointer}`} viewBox="0 0 16 16">
            <path fill="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
        </svg>;
    }




    const fetchUsers = async (direction='f') => {
        try{
            const current_page = direction === 'f' ? currentPage +1 : currentPage -1;
            console.log('current_page',current_page);
            setCurrentPage(current_page);
            const result = await api_get_users(current_page, users_per_page, currentSort, currentSortDirection);
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

    const fetchUserFirstLast = (el) => {
        if(el === 'prev' && currentPage !== 1){
            return fetchUsers('b').catch(console.log);
        }
        if(el === 'next' && currentPage < numberOfPages){
            return fetchUsers('f').catch(console.log);
        }
    }

    useEffect(() => {
        if(!users?.length){
            fetchUsers('f').catch(console.log);
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
                                                        <li className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}`} onClick={e => fetchUserFirstLast('prev')}>
                                                            <div className="page-link pointer">
                                                                Previous
                                                            </div>
                                                        </li>
                                                    }

                                                    {
                                                        numberOfPages > 1 && currentPage > 1 &&
                                                        <li className={`paginate_button page-item`} onClick={e => fetchUsers('b')}>
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
                                                        <li className={`paginate_button page-item`} onClick={e => fetchUsers('f')}>
                                                            <div className="page-link pointer">
                                                                {currentPage+1}
                                                            </div>
                                                        </li>
                                                    }

                                                    {
                                                        numberOfPages > 1 &&
                                                        <li className={`paginate_button page-item next ${currentPage === numberOfPages ? 'disabled' : ''}`} onClick={e => fetchUserFirstLast('next')}>
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