import React from 'react';
import './Bookmark.css';
import './NewsModel.css'


const Bookmark = ({show,bookmarks,onClose,onSelecteArticle,onDeleteBookmark}) => {
    if(!show){
        return null
    }
  return (
    <div className='model-overlay'>
      <div className="model-content">
        <span className='close-button' onClick={onClose}>
            <i className='fa-solid fa-xmark'></i>
        </span>
        <h2 className='bookmarks-heading'>Bookmark News</h2>
        <div className="bookmarks-list">
            {
                bookmarks.map((article,index)=>(
                <div key={index} className="bookmark-item"
                   onClick={()=>onSelecteArticle(article)} >
                    <img src={article.image} alt={article.title} />
                    <h3>{article.title}</h3>
                    <span className="delete-button" 
                        onClick={(e)=>{
                            e.stopPropagation()
                            onDeleteBookmark(article)}}>
                        <i className='fa-regular fa-circle-xmark'></i>
                    </span>
                </div>))
            }
            
        </div>
      </div>
    </div>
  );
}

export default Bookmark;
