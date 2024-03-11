import React, {useState} from 'react';
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {get} from "lodash";
import {Button, Checkbox, Form, Input, InputNumber} from "antd";
const { TextArea } = Input;
import {useTranslation} from "react-i18next";

const EditCategory = ({itemData,setIsModalOpen,refetch}) => {
    const {t} = useTranslation();
    const { mutate, isLoading } = usePutQuery({
        listKeyId: KEYS.category_get_all,
        hideSuccessToast: false
    });
    const [isActive,setIsActive] = useState(get(itemData,'active'))
    const onFinish = (values) => {
        values.active = isActive;
        mutate(
            { url: `${URLS.category_edit}/${get(itemData,'id')}`, attributes: values },
            {
                onSuccess: () => {
                    setIsModalOpen(false);
                    refetch()
                },
            }
        );
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


                <Form.Item
                    name="active"
                    valuePropName="active"
                >
                    <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>{t("is Active")}</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading}>
                        {t("Edit")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default EditCategory;
