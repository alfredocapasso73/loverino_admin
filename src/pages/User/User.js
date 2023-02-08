import React, {useState, useEffect ,useRef} from "react";
import {
    api_convert_pictures,
    api_get_cities,
    api_get_regions,
    api_get_user,
    api_save_user,
    api_delete_picture,
    api_upload_picture,
    api_delete_user
} from '../../services/api';
import {useParams, useNavigate} from "react-router-dom";

const User = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(undefined);
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const uploadRef = useRef(null);
    const [formFailure, setFormFailure] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);
    const [pictures, setPictures] = useState([]);
    const [currentPictureToRemove, setCurrentPictureToRemove] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [fileUploadFailed, setFileUploadFailed] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fileChanged = async (files) => {
        if(!files.length){
            console.log("nothing to upload");
            return;
        }
        setIsUploading(true);
        try{
            for await(const picture of files){
                const result = await api_upload_picture(picture, user._id);
            }
            await getUser();
        }
        catch(exception){
                console.log("exception",exception);
                setFileUploadFailed(true);
                setIsUploading(false);
            }
        }

    const uploadFile = (e) => {
        e.stopPropagation();
        uploadRef.current.click();
    }

    const confirmRemovePicture = async () => {
        try{
            const result = await api_delete_picture(currentPictureToRemove, user._id);
            console.log("result?",result);
            if(result?.status === 200){
                await getUser();
            }
            else{
                console.log("result",result);
            }
        }
        catch(exception){
            console.log('exception',exception);
        }
    }

    const cancelRemovePicture = () => {
        const pics = pictures;
        pics.find(el => el.id === currentPictureToRemove).confirm_delete = 'n';
        setPictures([...pics]);
        setCurrentPictureToRemove('');
    }

    const removePicture = async (id) => {
        setCurrentPictureToRemove(id);
        const pics = pictures;
        pics.find(el => el.id === id).confirm_delete = 'y';
        setPictures([...pics]);
    }

    const saveUser = async () => {
        try{
            const result = await api_save_user(user);
            if(result?.status === 200){
                setFormSuccess(true);
            }
            else{
               setFormFailure(true);
            }
            setTimeout(function(){
                setFormFailure(false);
                setFormSuccess(false);
            }, 3000);
        }
        catch(exception){
            console.log('exception',exception);
        }
    }

    const get_age_array = (years_old) =>
    {
        const max_older = 100;
        const min_older = 18;
        const arr = Array(max_older-min_older).fill(18).map((n, i) => n + i);
        const ages = [];
        arr.forEach(el => {
            ages.push(el)
        });
        return ages;
    }

    const get_height_array = () => {
        const max_height = 210;
        const min_height = 140;
        const arr = Array(max_height-min_height).fill(min_height).map((n, i) => n + i);
        const heights = [];
        arr.forEach(el => {
            heights.push(el);
        });
        return heights;
    }

    const [ages, setAges] = useState(get_age_array());

    const bodyTypeOptions = ['XS','S','M','L','XL'];


    const userValueChanged = (field, value) => {
        setUser((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    }

    const regionChanged = async (region_id) => {
        userValueChanged('region', region_id);
        const city_result = await api_get_cities(region_id);
        if(city_result?.data?.cities?.length){
            setCities(city_result.data.cities);
        }
    }

    const deleteUser = () => {
        console.log("deleteUser");
        setShowModal(true);
    }

    const confirmDeleteUser = async () => {
        try{
            const result = await api_delete_user(user._id);
            if(result?.status === 200 && result?.data?.message === 'user_removed'){
                return navigate('/home');
            }
            console.log("result:",result);
        }
        catch(exception){
            console.log('exception',exception);
        }

    }

    const getUser = async () => {
        try{
            const region_result = await api_get_regions();
            if(region_result?.data?.regions){
                setRegions(region_result.data.regions);
            }
            const result = await api_get_user(params.id);
            if(result?.status === 200 && result?.data?.user){
                setUser(result.data.user);
                const city_result = await api_get_cities(result.data.user.region);
                if(city_result?.data?.cities?.length){
                    setCities(city_result.data.cities);
                }
                const all_pics = api_convert_pictures(result.data.user.pictures);
                all_pics.map(el => el.confirm_delete = 'n');
                setPictures(all_pics);
            }
        }
        catch(exception){
            console.log('exception',exception);
        }
    }

    useEffect(() => {
        getUser().catch(console.log);
    }, []);

    return(
        <>
            {
                user &&
                <div className="row">
                    <div className="col-2">
                        <div className="card">
                            <div className="card-header">Pictures</div>
                            <div className="card-body text-center">
                                {
                                    pictures?.length > 0 && pictures.map((pic, index) =>
                                        <div key={index} style={{padding: '5px',width: '100%'}} className="relative_positioned">
                                            <div className="img_with_trash">
                                                <img src={pic.src} alt="" style={{width: '100%'}}/>
                                                {
                                                    pic.confirm_delete === 'y' &&
                                                    <div className="container_confirm_remove_picture">
                                                        <div style={{paddingTop: '30%'}}>
                                                            <div onClick={confirmRemovePicture} className="a_div pointer" style={{fontWeight: 'bolder'}}>Remove</div>
                                                            <div className="a_div" style={{fontWeight: 'bolder'}}>OR</div>
                                                            <div onClick={cancelRemovePicture} className="a_div pointer" style={{fontWeight: 'bolder'}}>Cancel</div>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="trash_can_picture"onClick={e => removePicture(pic.id)}>
                                                    <img src="/img/icons8-delete-trash-15.png" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="small font-italic text-muted mb-4">
                                    {
                                        !isUploading &&
                                        <div>
                                            <input
                                                accept="image/png, image/jpeg, image/gif"
                                                multiple
                                                ref={uploadRef}
                                                className="d-none"
                                                type="file"
                                                onChange={e => fileChanged(e.target.files)}
                                            />
                                            <button onClick={uploadFile} className="btn btn-success">
                                                Upload pictures
                                            </button>
                                            {
                                                fileUploadFailed &&
                                                <div className="alert alert-danger">
                                                    Upload filed!
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                {
                                    user &&
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        {user.name} - {user._id}
                                    </h6>
                                }
                            </div>
                            <div className="card-body">
                                <div>
                                    <div className="row gx-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="small mb-1" htmlFor="inputFirstName">Name</label>
                                            <input className="form-control" id="inputFirstName" type="text" value={user.name} onChange={e => userValueChanged('name', e.target.value)}/>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="small mb-1" htmlFor="inputLastName">Email</label>
                                            <input className="form-control" disabled={true} id="inputLastName" type="text" value={user.email} />
                                        </div>
                                    </div>
                                    <div className="row gx-3 mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="exampleFormControlSelect1">Region</label>
                                            <select className="form-control" id="exampleFormControlSelect1" value={user.region} onChange={e => regionChanged(e.target.value)}>
                                                {
                                                    regions?.length && regions.map((region, index) =>
                                                        <option value={region._id} key={index}>{region.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="exampleFormControlSelect1">City</label>
                                            <select className="form-control" value={user.city} id="exampleFormControlSelect1" onChange={e => userValueChanged('city', e.target.value)}>
                                                {
                                                    cities?.length && cities.map((city, index) =>
                                                        <option value={city._id} key={index}>{city.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row gx-3 mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="exampleFormControlSelect1">Active</label>
                                            <select value={user.active} className="form-control" id="exampleFormControlSelect1"  onChange={e => userValueChanged('active', e.target.value)}>
                                                <option value="true">TRUE</option>
                                                <option value="false">FALSE</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="exampleFormControlSelect1">Paying user</label>
                                            <select value={user.is_paying_user} className="form-control" id="exampleFormControlSelect1"  onChange={e => userValueChanged('is_paying_user', e.target.value)}>
                                                <option value="true">TRUE</option>
                                                <option value="false">FALSE</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row gx-3 mb-3">
                                        <div className="col-md-3">
                                            <label htmlFor="exampleFormControlSelect1">Gender</label>
                                            <select value={user.gender} className="form-control" id="exampleFormControlSelect1"  onChange={e => userValueChanged('gender', e.target.value)}>
                                                <option value="m">Male</option>
                                                <option value="f">Female</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="exampleFormControlSelect1">Search Gender</label>
                                            <select value={user.search_gender} className="form-control" id="exampleFormControlSelect1"  onChange={e => userValueChanged('search_gender', e.target.value)}>
                                                <option value="m">Male</option>
                                                <option value="f">Female</option>
                                                <option value="a">All</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="exampleFormControlSelect1">Distance</label>
                                            <select value={user.search_distance} className="form-control" id="exampleFormControlSelect1"  onChange={e => userValueChanged('search_distance', e.target.value)}>
                                                <option value="close">Close</option>
                                                <option value="all">All</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="small mb-1" htmlFor="inputFirstName">Birthday</label>
                                            <input className="form-control" id="inputFirstName" type="text" value={user.birthday} onChange={e => userValueChanged('birthday', e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="row gx-3 mb-3">
                                        <div className="col-md-3">
                                            <label htmlFor="exampleFormControlSelect1">Min age</label>
                                            <select value={user.search_min_age} className="form-control" id="exampleFormControlSelect1"  onChange={e => userValueChanged('search_min_age', e.target.value)}>
                                                {
                                                    ages.map((age, index) =>
                                                        <option value={age} key={index}>{age}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="exampleFormControlSelect1">Max age</label>
                                            <select value={user.search_max_age} className="form-control" id="exampleFormControlSelect1"  onChange={e => userValueChanged('search_max_age', e.target.value)}>
                                                {
                                                    ages.map((age, index) =>
                                                        <option value={age} key={index}>{age}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="exampleFormControlSelect1">Body Type</label>
                                            <select value={user.body_type} className="form-control" id="exampleFormControlSelect1"  onChange={e => userValueChanged('body_type', e.target.value)}>
                                                {
                                                    bodyTypeOptions.map((body, index) =>
                                                        <option value={body} key={index}>{body}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="exampleFormControlSelect1">Height</label>
                                            <select value={user.height} className="form-control" id="exampleFormControlSelect1" onChange={e => userValueChanged('height', e.target.value)}>
                                                {
                                                    get_height_array().map((height, index) =>
                                                        <option value={height} key={index}>{height}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlTextarea1">Example textarea</label>
                                        <textarea  value={user.description} onChange={e => userValueChanged('description', e.target.value)} className="form-control" id="exampleFormControlTextarea1"rows="3"></textarea>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <button className="btn btn-primary" type="button" onClick={saveUser}>Save changes</button>
                                        </div>
                                        <div className="col-md-6" style={{textAlign: 'right'}}>
                                            <button className="btn btn-danger" type="button" onClick={deleteUser}>Delete user</button>
                                        </div>
                                    </div>
                                    {
                                        formSuccess &&
                                        <div className="mb-3">
                                            <div className="alert alert-success alert-dismissible fade show mb-0" role="alert">
                                                <h5 className="alert-heading">Saving user</h5>
                                                The user has been saved
                                            </div>
                                        </div>
                                    }
                                    {
                                        formFailure &&
                                        <div className="mb-3">
                                            <div className="alert alert-danger alert-dismissible fade show mb-0" role="alert">
                                                <h5 className="alert-heading">Saving user</h5>
                                                The user could not be saved
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        showModal &&
                        <div className="modal force_show" id="exampleModal" tabIndex="-1" role="dialog"
                             aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Confirm</h5>
                                    </div>
                                    <div className="modal-body">
                                        <b style={{color: 'red'}}>Do you really want to remove this user?</b>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-secondary" type="button" onClick={e => setShowModal(false)}>Close</button>
                                        <button className="btn btn-primary" type="button" onClick={confirmDeleteUser}>Yes, remove user</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }
        </>
    );
}
export default User;