import React, { useState } from 'react';
import { useHistory } from 'react-router';
import OlxLogo from '../../assets/OlxLogo';
import './Create.css';
import ChooseCategory from '../ChooseCategory/ChooseCategory';
import CreatePost from '../CreatePost/CreatePost';


const Create = () => {
  //useHistory
  const history = useHistory()
  //useStates
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [datas, setDatas] = useState([]);
  const [subData, setSubData] = useState([]);
  //functions
  const navigateBack = () => {
    history.push('/')
  }
  return (
      <div className="create__body">
        <header className="create__header">
          <div onClick={navigateBack} className="createBack__icon">
            <i className="bi bi-arrow-left"></i>
          </div>
          {/* <div onClick={() => history.push('/')} className="create__brandName">
            <OlxLogo />
          </div> */}
        </header>
        <div className="create__main">
          <div>
            <h5>POST YOUR ITEM</h5>
            {!subCategory ?
              <ChooseCategory setDatas={setDatas}
                setSubCategory={setSubCategory} setCategory={setCategory}
                category={category} setSubData={setSubData}
                subCategory={subCategory} datas={datas} subData={subData}
              />
              :
              <CreatePost category={category} subCategory={subCategory} setSubCategory={setSubCategory}/>
            }
          </div>
        </div>
        <footer className="create__footer">
       
          <div>
            <span style={{ fontWeight: 600 }}>Dazzlone</span>
            <span>&copy; 2025 </span>
          </div>
        </footer>
      </div>
  );
};

export default Create;
