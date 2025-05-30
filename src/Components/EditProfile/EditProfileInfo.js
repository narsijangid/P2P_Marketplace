import { useContext, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import db from '../../firebase';
import { AuthContext } from '../../store/Context';
import './EditProfileInfo.css';

const EditProfileInfo = () => {
    const { user } = useContext(AuthContext);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [about, setAbout] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        db.collection("users").doc(`${user?.uid}`).onSnapshot(snapshot => {
            setUserName(snapshot?.data()?.username || '');
            setPhone(snapshot?.data()?.phone || '');
            setAbout(snapshot?.data()?.about || '');
        });
    }, [user]);

    const handleSubmitEdit = async () => {
        if (!userName.trim()) {
            alert('Please enter your name');
            return;
        }

        setIsSaving(true);
        try {
            await db.collection('users').doc(`${user.uid}`).update({
                username: userName.trim(),
                phone: phone.trim(),
                about: about.trim()
            });
            openModal();
        } catch (error) {
            alert('Error updating profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div className="edit__profileInfo">
            <h5>Edit Profile Information</h5>
            
            <div className="editProfile__section">
                <div className="section-header">
                    <h6>Basic Information</h6>
                    <p>This information will be visible to other users</p>
                </div>
                
                <div className="form-group">
                    <label htmlFor="username">Full Name</label>
                    <input 
                        id="username"
                        type="text" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="about">About Me</label>
                    <textarea 
                        id="about"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Tell others about yourself (optional)"
                        rows="4"
                    ></textarea>
                </div>
            </div>

            <div className="editProfile__section">
                <div className="section-header">
                    <h6>Contact Information</h6>
                    <p>Your contact details will be visible to users you interact with</p>
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <div className="readonly-field">
                        <span>{user?.email}</span>
                        <small>Email cannot be changed</small>
                    </div>
                </div>
            </div>

            <div className="editProfile__actions">
                <button 
                    className="save-button"
                    onClick={handleSubmitEdit}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="editProfile__successModel"
                overlayClassName="Overlay"
                contentLabel="Success Modal"
                ariaHideApp={false}
            >
                <div className="editProfile__success">
                    <i className="bi bi-check-circle-fill success-icon"></i>
                    <h3>Profile Updated Successfully!</h3>
                    <p onClick={closeModal}>Close</p>   
                </div>
            </ReactModal>
        </div>
    );
}

export default EditProfileInfo;