import React, {useState} from 'react';
import {URLS} from "../../../constants/url.js";
import {Button, Form, InputNumber, Upload} from "antd";
import ImgCrop from "antd-img-crop";
import {InboxOutlined} from "@ant-design/icons";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {useTranslation} from "react-i18next";
const {Dragger} = Upload;
const CreateBanner = ({setIsModalOpen,refetch}) => {
    const [imageUrl,setImgUrl] = useState('');
    const {t} = useTranslation();
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.banner_get_all,
    });
    const { mutate:UploadImage } = usePostQuery({
        hideSuccessToast: true
    });
    const onFinish = (values) => {
        const formData = {
            ...values,
            imageUrl,
        }
        mutate(
            { url: URLS.banner_upload, attributes: formData },
            {
                onSuccess: () => {
                    setIsModalOpen(false);
                    refetch()
                },
            }
        );
    };
    const customRequest = async (options) => {
        const { file, onSuccess, onError } = options;

        // Rasmni o'qish va .webp formatga o'tqazish
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxSize = 500;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        // Rasmni .webp formatga o'tqazish
                        const newFile = new File([blob], file.name, { type: 'image/webp' });

                        // Jo'natish
                        const formData = new FormData();
                        formData.append('file', newFile);
                        UploadImage(
                            {
                                url: URLS.image_upload,
                                attributes: formData,
                                config: {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }},
                            },
                            {
                                onSuccess: ({ data }) => {
                                    onSuccess(true)
                                    setImgUrl(data)
                                },
                                onError: (err) => {
                                    onError(err)
                                }
                            }
                        );
                    },
                    'image/webp',
                    0.8
                );
            };
        };
    };
    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
            >
                <Form.Item
                    label={t("Order")}
                    name="number"
                    rules={[{required: true,}]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item>
                    <ImgCrop quality={0.8} aspect={500/500}>
                        <Dragger maxCount={1} multiple={false} accept={".jpg,.png,jpeg,svg"} customRequest={customRequest}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">{t("Click or drag file to this area to upload")}</p>
                        </Dragger>
                    </ImgCrop>
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading}>
                        {t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateBanner;
