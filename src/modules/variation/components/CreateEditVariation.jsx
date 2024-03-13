import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, InputNumber, Select, Space} from "antd";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";

const CreateEditVariation = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [searchProduct, setSearchProduct] = useState(null);
    const [searchMeasure, setSearchMeasure] = useState(null);
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.variation_get_all,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.variation_get_all,
        hideSuccessToast: false
    });
    const { data:products,isLoading:isLoadingProducts } = useGetAllQuery({
        key: KEYS.product_get_all,
        url: URLS.product_get_all,
        params: {
            params: {
                search: searchProduct,
                size: 500
            }
        }
    })
    const { data:measures,isLoading:isLoadingMeasures } = useGetAllQuery({
        key: KEYS.measure_get_all,
        url: URLS.measure_get_all,
        params: {
            params: {
                search: searchMeasure,
                size: 500
            }
        }
    })
    const onFinish = (values) => {
        const formData = {
            ...values,
        }
        if (itemData) {
            mutateEdit(
                { url: `${URLS.variation_edit}/${get(itemData,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.variation_add, attributes: formData },
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
                    number: get(itemData,'number'),
                    price: get(itemData,'price'),
                    measure: get(itemData,'measure'),
                    count: get(itemData,'count'),
                }}
            >
                <Form.Item
                    label={t("Product")}
                    name="productId"
                    rules={[{required: true,}]}>
                    <Select
                        showSearch
                        placeholder={t("Product")}
                        optionFilterProp="children"
                        defaultValue={get(itemData,'product.id')}
                        onSearch={(e) => setSearchProduct(e)}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        loading={isLoadingProducts}
                        options={get(products,'data.data.content')?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: `${get(item,'nameUz')} / ${get(item,'nameRu')}`
                            }
                        })}
                    />
                </Form.Item>

                <Space>
                    <Form.Item
                        label={t("Measure")}
                        name="measure"
                        rules={[{required: true,}]}
                    >
                        <InputNumber/>
                    </Form.Item>

                    <Form.Item
                        label={t("Measure unit")}
                        name="measureUnitId"
                        rules={[{required: true,}]}>
                        <Select
                            showSearch
                            placeholder={t("Measure unit")}
                            optionFilterProp="children"
                            defaultValue={get(itemData,'measureUnit.id')}
                            onSearch={(e) => setSearchProduct(e)}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            loading={isLoadingMeasures}
                            options={get(measures,'data.data.content')?.map((item) => {
                                return {
                                    value: get(item,'id'),
                                    label: `${get(item,'nameUz')} / ${get(item,'nameRu')}`
                                }
                            })}
                        />
                    </Form.Item>
                </Space>

                <Form.Item
                    label={t("Order")}
                    name="number"
                    rules={[{required: true,}]}
                >
                    <InputNumber style={{width: "100%"}}/>
                </Form.Item>

                <Form.Item
                    label={t("Count")}
                    name="count"
                    rules={[{required: true,}]}
                >
                    <InputNumber style={{width: "100%"}}/>
                </Form.Item>

                <Form.Item
                    label={t("Price")}
                    name="price"
                    rules={[{required: true,}]}
                >
                    <InputNumber style={{width: "100%"}}/>
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

export default CreateEditVariation;
