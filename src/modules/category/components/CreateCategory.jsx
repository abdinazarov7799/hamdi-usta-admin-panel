import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Checkbox, Form, Input, InputNumber} from "antd";
import TextArea from "antd/es/input/TextArea";

const CreateCategory = ({setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [isActive, setIsActive] = useState(true);
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.category_get_all,
    });
    const onFinish = (values) => {
        values.active = isActive;
        mutate(
            { url: URLS.category_add, attributes: values },
            {
                onSuccess: ({ data }) => {
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
                        {t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateCategory;
