import { styled } from "@mui/material/styles";

const Card = styled('div')`
    background-color: #2c2f33;
    border-radius: 10px;
    height: 280px;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    color: #fff;
    font-size: 1.2rem;
    font-weight: 400;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
`;

const TallCard = styled(Card)`
    height: 420px;
`;

const ScrollableDiv = styled('div')`
        overflow-y: scroll;
        height: 100%;
        border: 1px solid gray;
        border-radius: 5px;
        &::-webkit-scrollbar {
            width: 5px;
            height: 5px;
            $-track {
                background-color: rgb(255 255 255 / 50%);
                border-radius: 10px;
            }
            &-thumb {
                background-color: #fff;
                border-radius: 10px;
            }
        }
    `;

export { TallCard, Card, ScrollableDiv };