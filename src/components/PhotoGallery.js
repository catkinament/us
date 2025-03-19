import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import '../css/PhotoGallery.css';

// 连接 Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [error, setError] = useState(null);

  // 上传图片到 Supabase
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    try {
      const uploadedPhotos = [];

      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('photos')  // 确保 Supabase 存储桶名为 'photos'
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        const { data: urlData } = await supabase.storage.from('photos').getPublicUrl(fileName);
        uploadedPhotos.push({
          id: Date.now(),
          src: urlData.publicUrl,
          alt: file.name,
        });
      }

      setPhotos((prevPhotos) => [...prevPhotos, ...uploadedPhotos]);
      setError(null);
    } catch (err) {
      setError('上传失败，请稍后再试');
      console.error(err);
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
      {error && <p className="error-message">{error}</p>}
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
