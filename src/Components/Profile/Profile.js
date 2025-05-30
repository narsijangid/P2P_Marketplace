import { useContext, useEffect, useState, useRef } from 'react';
import db, { firebasestorage } from '../../firebase';
import { AuthContext } from '../../store/Context';
import './Profile.css';
import { useHistory } from 'react-router';
import SellButtonPlus from '../../assets/SellButtonPlus';
import SellButton from '../../assets/SellButton';
import Cards from '../Cards/Cards';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [userDetails, setUserDetails] = useState([]);
    const history = useHistory();
    const [myAds, setMyAds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isShareLoading, setIsShareLoading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        if (user) {
            setIsLoading(true);
            db.collection('users').doc(`${user.uid}`).get().then(res => {
                if (isMounted) {
                    setUserDetails(res.data());
                    setIsLoading(false);
                }
            });
        }
        return () => {
            isMounted = false;
        };
    }, [user]);

    useEffect(() => {
        let isMounted = true;
        if (user) {
            const unsubscribe = db.collection('products').where('userId', '==', `${user.uid}`).onSnapshot(snapshot => {
                if (isMounted) {
                    const allPost = snapshot.docs.map((product) => ({
                        ...product.data(),
                        id: product.id
                    }));
                    setMyAds(allPost);
                }
            });
            return () => {
                isMounted = false;
                unsubscribe();
            };
        }
    }, [user]);

    const copyProfileLink = async () => {
        try {
            setIsShareLoading(true);
            const location = window.location.origin;
            await navigator.clipboard.writeText(`${location}/profile/${userDetails.id}`);
            alert('Profile link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);
            alert('Failed to copy profile link');
        } finally {
            setIsShareLoading(false);
        }
    };

    const handleProfileImageClick = () => {
        setShowUploadModal(true);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadProfilePicture(file);
        }
    };

    const uploadProfilePicture = async (file) => {
        if (!file) return;

        try {
            setIsUploading(true);
            setUploadProgress(0);

            // Create a storage reference
            const storageRef = firebasestorage.ref();
            const profilePicRef = storageRef.child(`profilePictures/${user.uid}/${file.name}`);

            // Upload file
            const uploadTask = profilePicRef.put(file);

            // Monitor upload progress
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('Upload error:', error);
                    alert('Failed to upload profile picture');
                    setIsUploading(false);
                },
                async () => {
                    // Get download URL
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    
                    // Update user profile in Firestore
                    await db.collection('users').doc(user.uid).update({
                        photourl: downloadURL
                    });

                    // Update local state
                    setUserDetails(prev => ({
                        ...prev,
                        photourl: downloadURL
                    }));

                    setIsUploading(false);
                    setShowUploadModal(false);
                    setUploadProgress(0);
                }
            );
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Failed to upload profile picture');
            setIsUploading(false);
        }
    };

    const handleModalClose = () => {
        if (!isUploading) {
            setShowUploadModal(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="profile">
            <div className="profile__header">
                <div className="profile__headerLeft">
                    <div 
                        className="profile__imageContainer clickable"
                        onClick={handleProfileImageClick}
                    >
                        <img 
                            src={userDetails?.photourl || "https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png"} 
                            alt="Profile" 
                            className="profile__image"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png";
                            }}
                        />
                        <div className="profile__imageOverlay">
                            <span>Change Photo</span>
                        </div>
                    </div>
                    <div className="profile__info">
                        <h3>{userDetails?.username || 'Loading...'}</h3>
                        <p>{userDetails?.about || 'No bio yet'}</p>
                        <div className="profile__stats">
                            <span>{myAds.length} Ads</span>
                            <span>{userDetails?.phone || 'No phone number'}</span>
                        </div>
                    </div>
                </div>
                <div className="profile__headerRight">
                    <button 
                        onClick={copyProfileLink} 
                        className={`profile__shareButton ${isShareLoading ? 'loading' : ''}`}
                        disabled={isShareLoading}
                    >
                        {isShareLoading ? 'Copying...' : 'Share Profile'}
                    </button>
                </div>
            </div>

            {showUploadModal && (
                <div className="profile__uploadModal">
                    <div className="profile__uploadModalContent">
                        <button 
                            className="profile__uploadModalClose"
                            onClick={handleModalClose}
                            disabled={isUploading}
                        >
                            ×
                        </button>
                        <h3>Update Profile Picture</h3>
                        <div className="profile__uploadArea">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <button
                                className="profile__uploadButton"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                Choose Image
                            </button>
                            <p className="profile__uploadHint">
                                Recommended: Square image, max 2MB
                            </p>
                        </div>
                        {isUploading && (
                            <div className="profile__uploadProgress">
                                <div 
                                    className="profile__uploadProgressBar"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                                <span>{Math.round(uploadProgress)}%</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="profile__content">
                <div className="profile__tabs">
                    <button className="profile__tab active">My Ads</button>
                </div>

                <div className="profile__ads">
                    {isLoading ? (
                        <div className="profile__loading">Loading...</div>
                    ) : myAds.length > 0 ? (
                        myAds.map(product => (
                            <div className="profile__ad" key={product.id}>
                                <Cards product={product} />
                            </div>
                        ))
                    ) : (
                        <div className="profile__noAds">No ads posted yet</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;