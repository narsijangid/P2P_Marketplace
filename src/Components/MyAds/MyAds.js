import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import SellButton from '../../assets/SellButton';
import SellButtonPlus from '../../assets/SellButtonPlus';
import db from '../../firebase';
import { AuthContext } from '../../store/Context';
import Cards from '../Cards/Cards';
import './MyAds.css';
import { MdOutlineAddChart } from "react-icons/md";


const MyAds = () => {
    const [myAds, setMyAds] = useState([]);
    const { user } = useContext(AuthContext);
    const history = useHistory();


    useEffect(() => {
        db.collection('products').where('userId', '==', `${user?.uid}`).onSnapshot(snapshot => {
            const allPost = snapshot.docs.map((product) => {
                return {
                    ...product.data(),
                    id: product.id
                }
            })
            setMyAds(allPost)
        })
    }, [user])


    return (
        <div className="my__ads">
            <div className="myAds__container">
                {
                    myAds.map(product => {
                        return (
                            <div className="myAds__cards" key={product.id}>
                                <Cards product={product} />
                            </div>
                        )
                    })
                }
            </div>
            {
                (myAds.length === 0) && (
                    <div className="myads__noads">
                        <h1>No post yet !!</h1>
                        <h3>Start selling</h3>
                        <div onClick={() => history.push('/create')}>
                        <MdOutlineAddChart className='addpostnow'/>
                            </div>
                        </div>
                  
                )
            }

        </div>
    );
}

export default MyAds;