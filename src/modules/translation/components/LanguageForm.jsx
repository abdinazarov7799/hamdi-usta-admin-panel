import React from 'react';
import {Button, Form, Input, message, notification} from "antd";
import {find, get, isEqual} from "lodash";
import {useTranslation} from "react-i18next";
import TextArea from "antd/es/input/TextArea";
import usePostQuery from "../../../hooks/api/usePostQuery";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";

const LanguageForm = ({data,handleCancel}) => {
    const {t} = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.translations_list,
        hideSuccessToast: true,
    });
    const onFinish = (values) => {
        mutate(
            { url: `${URLS.add_translations}`, attributes: {
                id: get(data,'id'),
                    translations: {
                        Uz: get(values,'Uz'),
                        En: get(values,'En'),
                        Ru: get(values,'Ru'),
                    }
                }},
            {
                onSuccess: () => {
                    handleCancel();
                    messageApi.success('Tarjima muvaffaqiyatli amalga oshirildi!')
                },
                onError: () => {
                    handleCancel();
                    messageApi.error( 'Tarjima amalga oshirilmadi!')
                },
            }
        );
    };
    const findLang = (translations = [], lang) => {
        return find(translations, (item) => isEqual(get(item, "language"), lang));
    };
    return (
        <>
            {contextHolder}
            <Form
                name="lang"
                layout={"vertical"}
                onFinish={onFinish}
                autoComplete="off"
                initialValues={{
                    key: get(data, "text"),
                    Uz: get(
                        findLang(get(data, "languageSourcePs", []), "Uz"),
                        "translation",
                        ""
                    ),
                    En: get(
                        findLang(get(data, "languageSourcePs", []), "En"),
                        "translation",
                        ""
                    ),
                    Ru: get(
                        findLang(get(data, "languageSourcePs", []), "Ru"),
                        "translation",
                        ""
                    )
                }}
            >
                <Form.Item
                    label={t("Key")}
                    name="key"
                >
                    <TextArea disabled/>
                </Form.Item>

                <Form.Item
                    label={t("Uzbek")}
                    name="Uz"
                >
                    <TextArea allowClear/>
                </Form.Item>

                <Form.Item
                    label={t("English")}
                    name="En"
                >
                    <TextArea allowClear/>
                </Form.Item>

                <Form.Item
                    label={t("Rus")}
                    name="Ru"
                >
                    <TextArea allowClear/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={isLoading}>
                        {t("Save")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default LanguageForm;
