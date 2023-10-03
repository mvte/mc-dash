import { Card } from "../CardConsts";
import { Button } from "@mui/material";
import { styled } from '@mui/material/styles';

const Layout = styled('div')`
    margin: 20px 8%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
`;

const StyledButton = styled(Button)`
    text-transform: none;
`

const Text = styled('p')`
    font-size: 0.8rem;
    font-style: italic;
    margin: 0px -4px;
`;

const StartStop = (props) => {
    let hasPermission = false;
    const token = localStorage.getItem("token");
    const user = JSON.parse(atob(token.split('.')[1]));

    hasPermission = user.roles.includes("admin");

    return <>
        <Card>
        quick controls
        <Layout>
            <StyledButton variant="contained" color="success" disabled={!hasPermission}>
                start
            </StyledButton>
            <StyledButton variant="contained" disabled={!hasPermission}>
                restart
            </StyledButton>
            <StyledButton variant="contained" color="error" disabled={!hasPermission}>    
                stop
            </StyledButton>
        </Layout>
        {!hasPermission && <Text>you do not have permission to start/stop the server</Text>}
        </Card>
    </>
}

export default StartStop;