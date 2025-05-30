import { useContext, useEffect, useState } from 'react';
import db, { firebasestorage } from '../../firebase';
import { AuthContext } from '../../store/Context';
import './EditProfilePicture.css';

const EditProfilePicture = () => {
    const { user } = useContext(AuthContext);
    const [photoUrl, setPhotoUrl] = useState('');
    const [profilePic, setProfilePic] = useState();
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if (user) {
            const unsubscribe = db.collection('users').doc(`${user.uid}`).onSnapshot(snapshot => {
                if (isMounted) {
                    setPhotoUrl(snapshot.data()?.photourl);
                }
            });
            return () => {
                isMounted = false;
                unsubscribe();
            };
        }
    }, [user]);

    const handleUploadPhoto = () => {
        if (!profilePic) return;
        
        setIsUploading(true);
        firebasestorage.ref(`/ProfilePic/${user.uid}.jpeg`).put(profilePic).then(({ ref }) => {
            ref.getDownloadURL().then((url) => {
                db.collection('users').doc(`${user.uid}`).update({
                    photourl: url
                });
                setIsUploading(false);
                alert('Profile Picture updated successfully!');
            });
        }).catch(error => {
            setIsUploading(false);
            alert('Error uploading image. Please try again.');
        });
    };

    return (
        <div className="editProfilePicture">
            <div className="editProfilePicture__container">
                <img src={photoUrl} alt="Profile" className="editProfilePicture__image" />
                <input
                    type="file"
                    onChange={(e) => setProfilePic(e.target.files[0])}
                    accept="image/*"
                    className="editProfilePicture__input"
                />
                <button
                    onClick={handleUploadPhoto}
                    disabled={!profilePic || isUploading}
                    className="editProfilePicture__button"
                >
                    {isUploading ? 'Uploading...' : 'Update Profile Picture'}
                </button>
            </div>
        </div>
    );
};

export default EditProfilePicture;