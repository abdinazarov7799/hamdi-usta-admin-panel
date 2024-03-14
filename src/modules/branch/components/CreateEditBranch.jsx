import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Checkbox, Form, Input, InputNumber} from "antd";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
const { TextArea } = Input;

const CreateEditCategory = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [isActive, setIsActive] = useState(get(itemData,'active',true));
    const [isClosesAfterMn, setIsClosesAfterMn] = useState(get(itemData,'closesAfterMn',true));
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.branch_get_all,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.branch_get_all,
        hideSuccessToast: false
    });
    const { mutate:UploadImage } = usePostQuery({
        hideSuccessToast: true
    });
    const onFinish = (values) => {
        const formData = {
            ...values,
            active: isActive,
            closesAfterMn: isClosesAfterMn,
        }
        if (itemData) {
            mutateEdit(
                { url: `${URLS.branch_edit}/${get(itemData,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.branch_add, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }
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
                    addressUz: get(itemData,'addressUz'),
                    addressRu: get(itemData,'addressRu'),
                    openingTime: get(itemData,'openingTime'),
                    closingTime: get(itemData,'closingTime'),
                    closesAfterMn: get(itemData,'closesAfterMn'),
                    lat: get(itemData,'lat'),
                    lon: get(itemData,'lon'),
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
                    label={t("addressUz")}
                    name="addressUz"
                    rules={[{required: true,}]}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    label={t("addressRu")}
                    name="addressRu"
                    rules={[{required: true,}]}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    label={t("openingTime")}
                    name="openingTime"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("closingTime")}
                    name="closingTime"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("lat")}
                    name="lat"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("lon")}
                    name="lon"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Order")}
                    name="number"
                    rules={[{required: true,}]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    name="closesAfterMn"
                    valuePropName="closesAfterMn"
                >
                    <Checkbox checked={isClosesAfterMn} onChange={(e) => setIsClosesAfterMn(e.target.checked)}>{t("closesAfterMn")} ?</Checkbox>
                </Form.Item>

                <Form.Item
                    name="active"
                    valuePropName="active"
                >
                    <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>{t("is Active")} ?</Checkbox>
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
