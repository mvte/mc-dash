import ConsoleBox from '../../components/Console'

const Console = (props) => {
    let permissionToSend = false;
    const token = localStorage.getItem("token");
    const user = JSON.parse(atob(token.split('.')[1]));

    permissionToSend = user.roles.includes("admin");

    return <>
        <h1> console </h1>
        <p> see logs and enter commands (if you have the proper permissions) </p>
        <ConsoleBox 
            permissionToSend = {permissionToSend}
        />
    </>
}

export default Console;