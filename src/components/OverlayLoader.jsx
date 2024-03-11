import styled from "styled-components";
import {Flex, Spin} from "antd";


const Styled = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 999;
    background-color: rgba(255,255,255,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
`;


const OverlayLoader = () => {
    return(
        <Flex align="center" gap="middle">
            <Spin size="large" fullscreen={true} />
        </Flex>
    )
}
export default OverlayLoader
