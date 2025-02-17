import Arrow from "../../assets/Arrow";
import "./Category.css";
import Modal from "react-modal";
import { useEffect, useState, useCallback } from "react";
import db from "../../firebase";
import { useHistory } from "react-router";

const Category = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true); // Loading state
    const history = useHistory();

    // Optimized function to fetch categories (runs only once)
    const fetchCategories = useCallback(async () => {
        try {
            const snapshot = await db.collection("category").get();
            let data = {};
            snapshot.docs.forEach(doc => {
                data[doc.id] = doc.data()[doc.id] || [];
            });
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false); // Hide loading state
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div className="category__menu">
            <div className="category__title">
                <div className="category__titleContents" onClick={openModal}>
                    <span>Filter...</span>
                    <div className={modalIsOpen ? "category__arrow" : "category__arrowDown"}>
                        <Arrow />
                    </div>
                </div>
                <div className="category__quickOptions">
                    <span>Cars</span>
                    <span>Motorcycle</span>
                    <span>Mobile Phone</span>
                    <span>For Sale: Houses & Apartments</span>
                    <span>Scooter</span>
                    <span>Commercial & Other Vehicles</span>
                    <span>For Rent: House & Apartments</span>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="Modal"
                overlayClassName="Overlay"
                contentLabel="Category Modal"
                ariaHideApp={false}
            >
                <i onClick={closeModal} className="bi bi-x-circle"></i>
                <div className="category__list">
                    {loading ? (
                        <p>Loading categories...</p>
                    ) : (
                        Object.keys(categories).map((categoryName, key) => (
                            <div className="category__listGroup" key={key}>
                                <h6 className="category__listTitle">{categoryName}</h6>
                                {categories[categoryName].map((item, k) => (
                                    <h6
                                        className="category__listContent"
                                        onClick={() => history.push(`/search/search?${item}`)}
                                        key={k}
                                    >
                                        {item}
                                    </h6>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Category;
