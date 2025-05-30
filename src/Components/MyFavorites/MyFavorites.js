import { useContext, useEffect, useState } from 'react';
import db from '../../firebase';
import { AuthContext } from '../../store/Context';
import Cards from '../Cards/Cards';
import './MyFavorites.css';

const MyFavorites = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      const unsubscribe = db.collection('users').doc(`${user.uid}`).collection(`favorites`).onSnapshot(snapshot => {
        if (isMounted) {
          const allPost = snapshot.docs.map((product) => ({
            ...product.data(),
            id: product.id
          }));
          setProducts(allPost);
        }
      });
      return () => {
        isMounted = false;
        unsubscribe();
      };
    }
  }, [user]);

  return (
    <div className="myFavorites">
      <div className="myFav__cards">
        {products.map(product => (
          <div className="myFav__card" key={product.id}>
            <Cards product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFavorites;