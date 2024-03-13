import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Checkbox, Form, Input, InputNumber, Upload} from "antd";
import ImgCrop from "antd-img-crop";
import {InboxOutlined} from "@ant-design/icons";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
const { TextArea } = Input;
const { Dragger } = Upload;

const CreateEditCategory = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [isActive, setIsActive] = useState(get(itemData,'active',true));
    const [imageUrl,setImgUrl] = useState('');
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.category_get_all,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.category_get_all,
        hideSuccessToast: false
    });
    const { mutate:UploadImage } = usePostQuery({
            hideSuccessToast: true
    });
    const onFinish = (values) => {
        const formData = {
            ...values,
            active: isActive,
            imageUrl,
        }
        if (itemData) {
            mutateEdit(
                { url: `${URLS.category_edit}/${get(itemData,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.category_add, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }
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
                const maxSize = 400;
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
                    0.5 // 50% compress
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
                initialValues={{
                    nameUz: get(itemData,'nameUz'),
                    nameRu: get(itemData,'nameRu'),
                    descriptionUz: get(itemData,'descriptionUz'),
                    descriptionRu: get(itemData,'descriptionRu'),
                    number: get(itemData,'number')
                }}
            >
                <Form.Item
                    label={t("nameUz")}
                    name="nameUz"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("nameRu")}
                    name="nameRu"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("descriptionUz")}
                    name="descriptionUz"
                    rules={[{required: true,}]}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    label={t("descriptionRu")}
                    name="descriptionRu"
                    rules={[{required: true,}]}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    label={t("Order")}
                    name="number"
                    rules={[{required: true,}]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item>
                    <ImgCrop quality={0.5} aspect={400/400}>
                        <Dragger maxCount={1} multiple={false} accept={".jpg,.png,jpeg,svg"} customRequest={customRequest}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">{t("Click or drag file to this area to upload")}</p>
                        </Dragger>
                    </ImgCrop>
                </Form.Item>

                <Form.Item
                    name="active"
                    valuePropName="active"
                >
                    <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>{t("is Active")}</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {itemData ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditCategory;
