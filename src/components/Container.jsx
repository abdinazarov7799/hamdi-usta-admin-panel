import React from 'react';
import {theme} from "antd";
import styled from "styled-components";

const Container = ({children}) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const StyledContainer = styled.div`
        margin: 0 auto;
        padding: 16px;
        border-radius: 5px;
        width: 100%;
        background-color: ${colorBgContainer};
`;
    return (
        <StyledContainer>
            {children}
        </StyledContainer>
    );
};

export default Container;
