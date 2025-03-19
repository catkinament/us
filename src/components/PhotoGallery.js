import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);

  // 🚀 从 Supabase Storage 获取所有图片
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage.from('photos').list('', {
        limit: 100, // 最多获取100张
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) throw error;
      if (!data || data.length === 0) return setPhotos([]);

      // 获取每张图片的 Public URL
      const urls = data.map((file) => {
        const publicUrlData = supabase.storage.from('photos').getPublicUrl(file.name);
        return {
          id: file.name, // 使用文件名作为唯一标识
          url: publicUrlData?.data?.publicUrl || '',
        };
      });

      setPhotos(urls);
    } catch (error) {
      setError('加载照片失败，请稍后再试');
      console.error(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 组件加载时拉取照片
  useEffect(() => {
    fetchPhotos();
  }, []);

  // 上传图片到 Supabase Storage
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setLoading(true);
    try {
      const uploadedPhotos = await Promise.all(
        Array.from(files).map(async (file) => {
          const fileName = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;
          const { error } = await supabase.storage.from('photos').upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

          if (error) throw error;

          // 获取上传后图片的 Public URL
          const publicUrlData = supabase.storage.from('photos').getPublicUrl(fileName);
          return {
            id: fileName,
            url: publicUrlData?.data?.publicUrl || '',
          };
        })
      );

      // 立即更新 UI
      setPhotos((prevPhotos) => [...uploadedPhotos, ...prevPhotos]);
      setError(null);
    } catch (err) {
      setError('上传失败，请稍后再试');
      console.error(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>照片墙</h2>
      {error && <p className="error-message">{error}</p>}
      <input type="file" accept="image/*" onChange={handleImageUpload} multiple disabled={loading} />

      <div className="gallery">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-container">
            <img src={photo.url} alt="Uploaded" className="photo" onClick={() => setZoomedImage(photo.url)} />
          </div>
        ))}
      </div>

      {zoomedImage && (
        <div className="zoomed-image" onClick={() => setZoomedImage(null)}>
          <img src={zoomedImage} alt="Zoomed" />
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
