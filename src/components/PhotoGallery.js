import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "../css/PhotoGallery.css";

// 连接 Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [enlargedPhoto, setEnlargedPhoto] = useState(null);

  // 🚀 获取照片
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.storage.from("photos").list("");

      if (error) throw error;

      if (!data || data.length === 0) {
        setPhotos([]);
        return;
      }

      const urls = data.map((file) => ({
        id: file.name,
        url: supabase.storage.from("photos").getPublicUrl(file.name).data.publicUrl
      }));

      setPhotos(urls);
    } catch (error) {
      setError("加载照片失败，请稍后再试");
      console.error("Error fetching photos:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // 🔼 处理文件上传（支持多个文件）
  const handleUpload = async () => {
    if (!selectedFiles.length) {
      alert("请选择至少一个文件");
      return;
    }

    try {
      setUploading(true);

      // 🚀 使用 `Promise.all()` 并行上传多个文件
      const uploadPromises = selectedFiles.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${fileExt}`;
        const { error } = await supabase.storage.from("photos").upload(fileName, file);
        if (error) throw error;
      });

      await Promise.all(uploadPromises);

      setSelectedFiles([]);
      fetchPhotos(); // 上传完成后刷新照片墙
    } catch (error) {
      alert("上传失败：" + error.message);
    } finally {
      setUploading(false);
    }
  };

  // ✅ `useEffect()` 在组件加载时运行
  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div>
      <h2>照片墙</h2>
      
      {/* 上传按钮（支持多个文件） */}
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          multiple
          id="fileUpload"
          className="upload-input"
          onChange={(e) => setSelectedFiles([...e.target.files])}
        />
        <label htmlFor="fileUpload" className="upload-label">
          选择图片
        </label>
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "上传中..." : `上传 ${selectedFiles.length} 张`}
        </button>
      </div>

      {/* 错误消息 */}
      {error && <p className="error-message">{error}</p>}

      {/* 图片墙 */}
      <div className="gallery">
        {photos.length === 0 ? (
          <p className="no-photos">📷 暂无图片，快去上传吧！</p>
        ) : (
          photos.map((photo) => (
            <div key={photo.id} className="photo-container" onClick={() => setEnlargedPhoto(photo.url)}>
              <img src={photo.url} alt="Uploaded" className="photo" />
            </div>
          ))
        )}
      </div>

      {/* 点击放大图片 */}
      {enlargedPhoto && (
        <div className="overlay" onClick={() => setEnlargedPhoto(null)}>
          <img src={enlargedPhoto} alt="Enlarged" className="enlarged-photo" />
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
