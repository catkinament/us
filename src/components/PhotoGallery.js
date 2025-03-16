import React, { useState, useEffect } from 'react';
import '../css/PhotoGallery.css';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);

  // 处理图片上传
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newPhotos = Array.from(files).map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = () => {
            resolve({
              id: photos.length + 1,
              src: reader.result,
              alt: file.name,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      // 图片上传后一次性更新
      Promise.all(newPhotos).then((newImages) => {
        setPhotos((prevPhotos) => [...prevPhotos, ...newImages]); // 只合并新图片
      });
    }
  };

  // 点击图片放大
  const handleImageClick = (src) => {
    setZoomedImage(src);
  };

  // 关闭放大图片
  const closeZoom = () => {
    setZoomedImage(null);
  };

  return (
    <div>
      <h2>照片片片片片片片</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        multiple
      />
      <div className="gallery">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-container">
            <img
              src={photo.src}
              alt={photo.alt}
              className="photo"
              onClick={() => handleImageClick(photo.src)}
            />
          </div>
        ))}
      </div>

      {zoomedImage && (
        <div className="zoomed-image" onClick={closeZoom}>
          <img src={zoomedImage} alt="Zoomed" />
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
