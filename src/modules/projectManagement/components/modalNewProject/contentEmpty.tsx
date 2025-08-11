import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Upload, Button, Row, Col, message, Image } from 'antd';
import { UploadOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { UploadProps, RcFile } from 'antd/es/upload/interface';
import imgUpload from "../../../../assets/images/IconImagePhoto.png";
import ImageCropModal from './ImageCropModal';

import { FormData } from "../../../../stores/interfaces/ProjectManage";

// CSS to make form items full width
const formStyles = `.ant-form-item-required {width: 100% !important;}
/* Hide Google Maps info cards and UI elements */
.gm-style-iw,
.gm-style-iw-c,
.gm-style-iw-d,
.poi-info-window,
.place-card,
.place-card-medium,
.place-card-large,
.place-desc-large,
.gm-style .gm-style-cc,
.gmnoprint,
.gm-bundled-control,
.gm-fullscreen-control,
.gm-svpc,
.directions-card,
.place-result,
.place-name,
a[href*="maps.google.com"],
a[href*="google.com/maps"] {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}
/* Target iframe content specifically */
iframe[src*="maps.google.com"] .place-card,
iframe[src*="maps.google.com"] .place-card-medium,
iframe[src*="maps.google.com"] .gm-style-iw {
  display: none !important;
  visibility: hidden !important;
}`;

export const FormNewProjectEmpty = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [tempImageUrl, setTempImageUrl] = useState<string>("");
  const [showCropModal, setShowCropModal] = useState(false);
  const [resetCropFunction, setResetCropFunction] = useState<(() => void) | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Add missing state variables
  const [projectName, setProjectName] = useState<string>("");
  const [projectType, setProjectType] = useState<string>("Condo");
  
  // Add map search states
  const [mapSearchValue, setMapSearchValue] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("13.7649109");
  const [longitude, setLongitude] = useState<string>("100.5357104");
  const [mapUrl, setMapUrl] = useState<string>(
    "https://maps.google.com/maps?q=Victory+Monument,Bangkok&t=m&z=15&output=embed&iwloc=near&ui=2"
  );


  

  console.log('Component render - showCropModal:', showCropModal, 'tempImageUrl:', tempImageUrl);

  // Inject CSS when component mounts or mapUrl changes
  useEffect(() => {
    injectMapCSS();
    
    // Also inject global CSS to document head
    const globalStyle = document.createElement('style');
    globalStyle.id = 'google-maps-hide-cards';
    globalStyle.textContent = `
      .place-card,
      .place-card-medium,
      .place-card-large,
      .gm-style-iw,
      .gm-style-iw-c,
      .gm-style-iw-d,
      .poi-info-window,
      .place-desc-large,
      .directions-card,
      .place-result,
      .place-name {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `;
    
    // Remove existing style if exists
    const existingStyle = document.getElementById('google-maps-hide-cards');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(globalStyle);
    
    // Cleanup function
    return () => {
      const styleToRemove = document.getElementById('google-maps-hide-cards');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [mapUrl]);

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: RcFile) => {
        console.log('beforeUpload called', file);
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return false;
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Image must be smaller than 10MB!');
            return false;
        }

        console.log('Converting to base64...');
        // Convert to base64 and show crop modal
        getBase64(file, (url) => {
            console.log('Base64 converted, showing modal');
            setTempImageUrl(url);
            setShowCropModal(true);
        });
        
        return false; // Prevent upload to server
    };



      const handleDeleteImage = () => {
    setImageUrl("");
    setTempImageUrl("");
    form.setFieldsValue({ image: "" });
    // Reset crop values if function is available
    if (resetCropFunction) {
      resetCropFunction();
    }
    message.success('Image deleted successfully');
  };

  const handleCropSave = (croppedImageUrl: string) => {
    setImageUrl(croppedImageUrl);
    form.setFieldsValue({ image: croppedImageUrl });
    setShowCropModal(false);
    setTempImageUrl("");
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setTempImageUrl("");
    // Clear form image value when canceling crop
    form.setFieldsValue({ image: "" });
    // Reset crop values if function is available
    if (resetCropFunction) {
      resetCropFunction();
    }
  };

  // Add map search functionality
  const handleMapSearch = async () => {
    if (!mapSearchValue.trim()) {
      message.warning('Please enter a location to search');
      return;
    }

    try {
      // Use Google Maps embed search directly (no API key required)
      const searchQuery = encodeURIComponent(mapSearchValue.trim());
      
      // Use this URL format to minimize info cards and popups
      const fallbackUrl = `https://maps.google.com/maps?q=${searchQuery}&t=m&z=15&output=embed&iwloc=near&ui=2`;
      
      setMapUrl(fallbackUrl);
      message.success(`Map updated to show: ${mapSearchValue}`);
      
      // Inject CSS to hide place cards after map loads
      injectMapCSS();
      
      // You can optionally try to extract coordinates from the search
      // For now, we'll keep the original coordinates but could enhance this later
      
    } catch (error) {
      console.error('Error searching location:', error);
      message.error('Failed to search location. Please try again.');
    }
  };

  const handleMapSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMapSearch();
    }
  };

  // Function to inject CSS into iframe to hide place cards
  const injectMapCSS = () => {
    setTimeout(() => {
      try {
        const iframe = document.querySelector('iframe[src*="maps.google.com"]') as HTMLIFrameElement;
        if (iframe && iframe.contentDocument) {
          const style = iframe.contentDocument.createElement('style');
          style.textContent = `
            .place-card,
            .place-card-medium,
            .place-card-large,
            .gm-style-iw,
            .gm-style-iw-c,
            .gm-style-iw-d,
            .poi-info-window,
            .place-desc-large,
            .directions-card,
            .place-result {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
            }
          `;
          iframe.contentDocument.head.appendChild(style);
        }
      } catch (error) {
        console.log('Cannot inject CSS into iframe due to CORS policy');
      }
    }, 1000);
  };

    const handleSave = () => {

        
        // ตรวจสอบว่ามีรูปภาพจริงๆ หรือไม่

        
        // ตรวจสอบว่า validate form ผ่านหรือไม่
        form
            .validateFields()
            .then((values) => {
                // ตรวจสอบอีกครั้งว่า values.image มีค่าจริงๆ
                if (!values.image || values.image.trim() === "") {
                    return;
                }
                // ถ้าผ่าน
                console.log('Validate Success:', values);
                // สามารถดำเนินการต่อ เช่น ส่งข้อมูล หรือปิด modal
            })
            .catch((errorInfo) => {
                // ถ้าไม่ผ่าน
                console.log('Validate Failed:', errorInfo);
            });
            if (!imageUrl || imageUrl.trim() === "") {
                return;
            }
    }

    const onFinish = (values: FormData) => {
        console.log('Form values:', values);
        // Handle form submission
    };

    const labelImage = (
        <div 
            className='!flex !items-center !justify-between !w-full'
            onClick={(e) => e.preventDefault()}
        >
            <div className='!text-[#0B262F] !font-medium !mr-auto'>Image</div>
            {imageUrl && (
                <div className="!ml-auto">
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDeleteImage();
                        }}
                        danger
                        size="small"
                    >
                        Delete
                    </Button>
                </div>
            )}
        </div>
    )


        return (
        <>
          <style dangerouslySetInnerHTML={{ __html: formStyles }} />
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                projectType: 'Condo',
                latitude: latitude,
                longitude: longitude
            }}
          >
            <p className='text-xl !text-[#0B262F] !font-medium'>Request new project</p>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Project name"
                        name="projectName"
                        rules={[{ required: true, message: 'Please input project name!' }]}
                    >
                        <Input 
                            placeholder="ZAITAN Demo" 
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)} 
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Latitude"
                        name="latitude"
                        rules={[{ required: true, message: 'Please input latitude!' }]}
                    >
                        <Input 
                            placeholder="13.7649109" 
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            disabled={true}   
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Select project type"
                        name="projectType"
                        rules={[{ required: true, message: 'Please select project type!' }]}
                    >
                        <Radio.Group 
                            value={projectType}
                            onChange={(e) => setProjectType(e.target.value)}
                        >
                            <Radio value="Condo">Condo</Radio>
                            <Radio value="Village">Village</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item

                        label="Longitude"
                        name="longitude"
                        rules={[{ required: true, message: 'Please input longitude!' }]}
                    >
                        <Input 
                            placeholder="100.5357104" 
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            disabled={true} 
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                         label={labelImage}
                        name="image"
                        rules={[{ required: true, message: 'Please upload an image!' }]}
                        className='!w-full'
                    >
                        <Upload
                            name="image"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            accept=".png,.jpg,.jpeg"
                            customRequest={() => {}}
                            disabled={previewOpen}
                            style={{
                                width: '100%',
                                padding: '10px',
                            }}
                        >
                            <div 
                                className=' !flex !flex-col !items-center !justify-center !h-[200px] !border-1 !border-[#d9d9d9] !rounded-xl 
                                !text-center !cursor-pointer hover:!border-[#1890ff] !transition-colors'
                                onClick={() => console.log('Upload div clicked')}
                            >
                                {imageUrl ? (
                                    <div className='pl-5 pr-5 pt-5 pb-5 overflow-hidden'>
                                        <Image
                                            src={imageUrl}
                                            alt="Project"
                                            className="max-w-[400px] max-h-[170px] object-cover rounded-lg"
                                            preview={{
                                                mask: <div className="text-white">Preview</div>,
                                                onVisibleChange: (visible) => {
                                                    setPreviewOpen(visible);
                                                }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                ) : (
                                    <div className='!flex !flex-col !items-center !justify-center '>
                                        <img
                                            src={imgUpload}
                                            alt="No Image"
                                            className="!w-[50px] !h-[50px] "
                                        />
                                        <div className='!text-[#CCCCCC] !text-sm !font-light'>Upload your project</div>
                                        <div className="!text-[#CCCCCC] !text-sm !font-light">
                                            *File size &lt;2MB, 16:9, *JPGs
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Upload>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Map">
                        <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px', height: '250px', position: 'relative' }}>
                            {/* Search input overlay on the map */}
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                right: '10px',
                                zIndex: 1000,
                                backgroundColor: 'white',
                                borderRadius: '6px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                padding: '5px'
                            }}>
                                <Input
                                    placeholder="Search location on map..."
                                    value={mapSearchValue}
                                    onChange={(e) => setMapSearchValue(e.target.value)}
                                    onKeyPress={handleMapSearchKeyPress}
                                    suffix={
                                        <Button 
                                            type="text" 
                                            icon={<SearchOutlined />} 
                                            onClick={handleMapSearch}
                                            size="small"
                                        />
                                    }
                                    className="!border-0 !shadow-none"
                                    size="small"
                                />
                            </div>
                            <iframe
                                src={mapUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '6px' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                            {/* Overlay to hide "View larger map" link */}
                            {/* <div style={{
                                position: 'absolute',
                                bottom: '0',
                                left: '0',
                                right: '0',
                                height: '25px',
                                backgroundColor: 'white',
                                zIndex: 1000,
                                borderBottomLeftRadius: '6px',
                                borderBottomRightRadius: '6px'
                            }}></div> */}
                        </div>
                    </Form.Item>
                </Col>
            </Row >



    <Row justify="end" style={{ marginTop: '20px' }}>
        <Col>
            <Button onClick={handleSave} type="primary" htmlType="submit" size="large" className='!rounded-xl !w-[150px]'>
                Save
            </Button>
        </Col>
    </Row>
                  </Form>
          
        <ImageCropModal
           visible={showCropModal}
           imageUrl={tempImageUrl}
           onSave={handleCropSave}
           onCancel={handleCropCancel}
           onReset={setResetCropFunction}
         />
        </>
      );
  };