import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Slider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  visible: boolean;
  imageUrl: string;
  onCancel: () => void;
  onSave: (croppedImageUrl: string) => void;
  onReset?: (resetFn: () => void) => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  visible,
  imageUrl,
  onCancel,
  onSave,
  onReset
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Expose reset function to parent component
  useEffect(() => {
    if (visible && onReset) {
      onReset(resetCropValues);
    }
  }, [visible, onReset]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    console.log('Image loaded:', width, height);
    
    // Set a simple initial crop without aspect ratio constraints
    const initialCrop: Crop = {
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25
    };
    
    setCrop(initialCrop);
    console.log('Initial crop set:', initialCrop);
  };

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: PixelCrop,
    scale = 1,
    rotate = 0,
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const pixelRatio = window.devicePixelRatio;

      canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      const rotateRads = rotate * (Math.PI / 180);
      const centerX = image.naturalWidth / 2;
      const centerY = image.naturalHeight / 2;

      ctx.save();

      ctx.translate(-cropX, -cropY);
      ctx.translate(centerX, centerY);
      ctx.rotate(rotateRads);
      ctx.scale(scale, scale);
      ctx.translate(-centerX, -centerY);
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
      );

      ctx.restore();

      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create blob');
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  const resetCropValues = () => {
    // Reset crop to initial values
    setCrop({
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25
    });
    setCompletedCrop(undefined);
    setScale(1);
    setRotation(0);
  };

  const handleSave = async () => {
    if (imgRef.current && completedCrop?.width && completedCrop?.height) {
      try {
        const croppedImageUrl = await getCroppedImg(
          imgRef.current,
          completedCrop,
          scale,
          rotation,
        );
        onSave(croppedImageUrl);
        resetCropValues();
        // Modal will be closed by parent component after onSave is called
      } catch (error) {
        console.error('Error cropping image:', error);
      }
    } else {
      console.warn('No crop area selected or image not loaded');
    }
  };

  const handleChooseFile = () => {
    resetCropValues();
    onCancel();
  };

  const handleDragStart = (e: PointerEvent) => {
    console.log('Drag start:', e);
  };

  const handleDragEnd = (e: PointerEvent) => {
    console.log('Drag end:', e);
  };

  const handleCropChange = (crop: Crop, percentCrop: Crop) => {
    console.log('Crop change:', crop, percentCrop);
    setCrop(percentCrop);
  };

  console.log('ImageCropModal render - visible:', visible, 'imageUrl:', imageUrl);

  return (
    <Modal
      open={visible}
      onCancel={() => {}} // Disable closing by clicking outside
      footer={null}
      width={600}
      centered
      closable={false}
      maskClosable={false} // Prevent closing when clicking outside
      keyboard={false} // Disable ESC key to close
      className="image-crop-modal"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-[#0B262F]">Image preview</h3>
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={handleChooseFile}
          className="!text-gray-500 hover:!text-gray-700"
        />
      </div>

      <div className="mb-4 flex justify-center items-center">
        <ReactCrop
          crop={crop}
          onChange={handleCropChange}
          onComplete={(c) => setCompletedCrop(c)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="max-w-full"
          disabled={false}
          locked={false}
          keepSelection={true}
          minWidth={10}
          minHeight={10}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={imageUrl}
            style={{ 
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              maxWidth: '100%',
              maxHeight: '400px'
            }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 min-w-[60px]">Scale:</span>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={scale}
            onChange={setScale}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 min-w-[40px]">
            {scale.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleChooseFile}
          className="flex-1 !h-12 !rounded-lg !border-2 !border-gray-300 !text-gray-700 hover:!border-blue-400"
        >
          Choose file
        </Button>
        <Button
          type="primary"
          onClick={handleSave}
          className="flex-1 !h-12 !rounded-lg !bg-[#1a365d] hover:!bg-[#2d4a66]"
        >
          Save
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        style={{
          display: 'none',
        }}
      />
    </Modal>
  );
};

export default ImageCropModal; 