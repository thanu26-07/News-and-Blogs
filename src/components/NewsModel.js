import React from 'react';
import './NewsModel.css'
import './Bookmark.css'
const NewsModel = ({show,article,onClose}) => {
  if(!show){
    return null
  }
  return (
    <div className="model-overlay">
        <div className="model-content">
            <span className='close-button'>
                <i className='fa-solid fa-xmark' onClick={onClose}></i>
            </span>
            {
              article && 
              <>
                <img src={article.image} alt={article.title} className='model-img'/>
                <h2 className="model-title">{article.title}</h2>
                <p className="model-source">Source: {article.source.name}</p>
                <p className="model-date">{new Date(article.publishedAt).toLocaleString('en-US',{
                  month:'short',
                  dat:'2-digit',
                  year:'numeric',
                  hour:'2-digit',
                  minute:'2-digit',

                })}</p>
                <p className="model-content-text">{article.content}</p>
                <a href={article.url} 
                  target='_blank'
                  rel='noopener noreferrer'
                className="read-more-link">Read More</a>
              </>
            }
        </div>
    </div>
  );
}

export default NewsModel;
