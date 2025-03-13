import React, { useState, useEffect } from 'react';
import '../css/PhotoGallery.css';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]); // 将初始化设置为空数组
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleImageUpload = (e) => {
    const files = e.target.files; // 获取所有选中的文件
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

      Promise.all(newPhotos).then((newImages) => {
        setPhotos([...photos, ...newImages]); // 合并新图片
      });
    }
  };

  const checkImageExists = async (src) => {
    const img = new Image();
    img.src = src;
    return new Promise((resolve) => {
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  // 使用 useEffect 来检测图片是否存在并移除不可用的图片
  useEffect(() => {
    const checkImages = async () => {
      const existence = await Promise.all(
        photos.map(async (photo) => ({
          id: photo.id,
          exists: await checkImageExists(photo.src),
        }))
      );

      // 只保留存在的图片
      const validPhotos = photos.filter((photo) => {
        const exists = existence.find((item) => item.id === photo.id)?.exists;
        return exists;
      });

      setPhotos(validPhotos); // 更新 photos 状态，只保留有效的图片
    };

    checkImages();
  }, [photos]); // 当 photos 发生变化时，重新检查图片

  const handleImageClick = (src) => {
    setZoomedImage(src);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  return (
    <div>
      <h2>我们的照片</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        multiple // 允许多选文件
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
