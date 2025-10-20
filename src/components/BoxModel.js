import React from 'react';
import demoImg from '../asserts/images/demo.jpg'
import './BoxModel.css'
const BoxModel = ({show,blog,onClose}) => {
    // if(!show){
    //     return null
    // }
  return (
    <div className='model-overlay'>
      <div className="model-content">
        <span className="close-button" onClick={onClose}>
            <i className='fa-solid fa-xmark'></i>
        </span>
        {
            blog.image && <img src={blog.image} alt={blog.title} className='blogs-model-image' />
        }
        
        <h2 className="blog-model-title">
            {blog.title}
        </h2>
        <p className="blog-model-content">
            {blog.content}
        </p>
      </div>
    </div>
  );
}

export default BoxModel;
