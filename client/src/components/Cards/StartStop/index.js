import { Card } from "../CardConsts";
import { Button } from "@mui/material";
import { styled } from '@mui/material/styles';

const Layout = styled('div')`
    margin: 20px 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
`;

const StyledButton = styled(Button)`
    text-transform: none;
`

const StartStop = (props) => {

    return <>
        <Card>
        quick controls
        <Layout>
            <StyledButton variant="contained" color="success">
                start
            </StyledButton>
            <StyledButton variant="contained">
                restart
            </StyledButton>
            <StyledButton variant="contained" color="error">    
                stop
            </StyledButton>
        </Layout>
        </Card>
    </>
}

export default StartStop;