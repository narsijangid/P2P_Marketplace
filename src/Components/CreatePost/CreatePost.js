import "./CreatePost.css";
import db, { firebasestorage } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import { useContext, useRef, useState, useEffect } from "react";
import { useHistory } from "react-router";
import { AuthContext } from '../../store/Context';

const CreatePost = ({ category, subCategory, setSubCategory }) => {
    const { user } = useContext(AuthContext);
    const [image, setImage] = useState();
    const [userDetails, setUserDetails] = useState([]);
    const [location, setLocation] = useState({});
    
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const priceRef = useRef(null);
    const placeRef = useRef(null);
    
    const history = useHistory();

    useEffect(() => {
        db.collection('users').doc(`${user.uid}`).get().then(res => {
            setUserDetails(res.data());
        });
    }, [user]);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            }, (error) => {
                console.error("Error getting location: ", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    const handleSubmit = () => {
        firebasestorage.ref(`/image/${uuidv4()}-${image.name}`).put(image).then(({ ref }) => {
            ref.getDownloadURL().then((url) => {
                db.collection('products').add({
                    title: titleRef?.current.value,
                    description: descriptionRef?.current.value,
                    price: priceRef?.current.value,
                    category,
                    subCategory,
                    url,
                    userId: user.uid,
                    date: new Date(),
                    phone: userDetails.phone,
                    username: userDetails.username,
                    location: {
                        latitude: location.latitude || null,
                        longitude: location.longitude || null,
                        address: placeRef?.current.value || ""
                    }
                });
                alert('Ad Posted Successfully');
                history.push('/');
            });
        });
    };
    
    return (
        <div className="post__container">
            <h6>SELECTED CATEGORY</h6>
            <div className="post__changeCategory">
                <span>{category + ' / ' + subCategory}</span>
                <span onClick={() => setSubCategory(null)}>Change</span>
            </div>
            <div className="post__details">
                <h5>INCLUDE SOME DETAILS</h5>
                <label htmlFor="">Ad Title*</label>
                <input ref={titleRef} type="text" name="" id="" />
                <label>Description*</label>
                <textarea ref={descriptionRef} cols="20" rows="3"></textarea>
            </div>
            <div className="post__price">
                <h5>SET A PRICE</h5>
                <label>Price*</label>
                <input ref={priceRef} type="number" />
            </div>
            <div className="post__photo">
                <h5>UPLOAD PHOTO</h5>
                <img width="200px" max-height="400px" loading="lazy" class="lazy-load" src={image && URL.createObjectURL(image)} alt="" />
                <div className="custom-file">
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} className="custom-file-input" />
                    <label className="custom-file-label">Choose file</label>
                </div>
            </div>
            <div className="post__location">
                <h5>ENTER YOUR LOCATION</h5>
                <input ref={placeRef} type="text" placeholder="Enter location" />
            </div>
            <div className="post__userDetails">
                <h5>REVIEW YOUR DETAILS</h5>
                <div>
                    <img className="post__userPhoto" src="https://cdn-icons-png.flaticon.com/512/18388/18388709.png" alt="img" />
                    <div>
                        <div>
                            <span>Name: </span>
                            <span>{userDetails.username}</span>
                        </div>
                        <div>
                            <span>Phone No: {userDetails?.phone}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="post__button">
                <button onClick={handleSubmit}>Post now</button>
            </div>
        </div>
    );
};

export default CreatePost;