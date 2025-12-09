import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './ModalCropImagem.css';

const ModalCropImagem = ({ imagemOriginal, onSalvar, onCancelar }) => {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    aspect: 1, // Forçar 1:1 (quadrado)
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onImageLoad = (e) => {
    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;
    const size = Math.min(width, height);
    
    // Centralizar o crop inicialmente
    setCrop({
      unit: 'px',
      width: size,
      height: size,
      x: (width - size) / 2,
      y: (height - size) / 2,
      aspect: 1,
    });
  };

  const getCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) {
      return null;
    }

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        const file = new File([blob], 'imagem-cortada.jpg', { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg', 0.95);
    });
  };

  const handleSalvar = async () => {
    const imagemCortada = await getCroppedImage();
    if (imagemCortada) {
      onSalvar(imagemCortada);
    }
  };

  return (
    <div className="modal-crop-overlay">
      <div className="modal-crop-container">
        <div className="modal-crop-header">
          <h2>Ajustar Imagem</h2>
          <button className="modal-crop-close" onClick={onCancelar}>✕</button>
        </div>
        
        <div className="modal-crop-body">
          <p className="modal-crop-instruction">
            Ajuste o quadrado para selecionar a área desejada da imagem
          </p>
          
          <div className="modal-crop-image-container">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop={false}
            >
              <img
                ref={imgRef}
                src={imagemOriginal}
                alt="Imagem para cortar"
                onLoad={onImageLoad}
                style={{ maxWidth: '100%', maxHeight: '60vh' }}
              />
            </ReactCrop>
          </div>
        </div>

        <div className="modal-crop-footer">
          <button className="btn_secundario rounded-full" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="btn_primario rounded-full" onClick={handleSalvar}>
            Salvar Foto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCropImagem;
