import React from 'react';
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {get} from "lodash";

const EditCategory = ({itemData,setIsModalOpen}) => {
    const { mutate, isLoading } = usePutQuery({
        listKeyId: KEYS.category_get_all,
        hideSuccessToast: false
    });
    const onFinish = (values) => {
        mutate(
            { url: `${URLS.category_edit}/${get(itemData,'id')}`, attributes: values },
            {
                onSuccess: () => {
                    setIsModalOpen(false);
                },
            }
        );
    };
    return (
        <div>

        </div>
    );
};

export default EditCategory;
