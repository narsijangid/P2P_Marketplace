import React, { useEffect, useState, useCallback } from 'react';
import './Post.css';
import db from '../../firebase';
import Cards from '../Cards/Cards';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';

const Posts = () => {
  const [products, setProducts] = useState([]);
  const [shuffled, setShuffled] = useState([]);
  const [lastKey, setLastKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  const fetchRef = db.collection('products').orderBy("date", "desc");

  useEffect(() => {
    const unsubscribe = fetchRef.limit(20).onSnapshot(snapshot => {
      if (!snapshot.empty) {
        const allPost = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().date?.toDate().toLocaleString('en-IN', {
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: true, day: 'numeric', month: 'numeric', year: 'numeric'
          }),
        }));

        setProducts(allPost);
        setShuffled(allPost.sort(() => Math.random() - 0.5).slice(0, 10));
        setLastKey(snapshot.docs[snapshot.docs.length - 1]);
      } else {
        setIsEmpty(true);
      }
      setLoading(false);
    }, error => {
      console.error("Error fetching data: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchMore = useCallback(async () => {
    if (!lastKey || loading) return;

    setLoading(true);
    try {
      const snapshot = await fetchRef.startAfter(lastKey).limit(10).get();
      if (!snapshot.empty) {
        const newPosts = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().date?.toDate().toLocaleString('en-IN', {
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: true, day: 'numeric', month: 'numeric', year: 'numeric'
          }),
        }));

        setProducts(prev => [...prev, ...newPosts]);
        setLastKey(snapshot.docs[snapshot.docs.length - 1]);
      } else {
        setIsEmpty(true);
      }
    } catch (error) {
      console.error("Error fetching more data: ", error);
    }
    setLoading(false);
  }, [lastKey, loading]);

  return (
    <div className="post__ParentDiv">
      <div className="post__recommendations">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
            <div className="post__freshCards">
              {products.map(product => (
                <div className="post__card" key={product.id}>
                  <Cards product={product} />
                </div>
              ))}
            </div>
            {!isEmpty && (
              <button className="post__loadmoreBtn" onClick={fetchMore}>Load More</button>
            )}
            {isEmpty && <h5 className="post__loadmoreEnd">No more Posts !!</h5>}
          </>
        )}
      </div>
    </div>
  );
};

export default Posts;