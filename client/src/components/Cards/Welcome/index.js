import React from "react";
import Card from "../CardConsts";
import "./index.css";


const Welcome = (props) => {

    return <>
        <Card>
            <h1>
                hello, {props.user}
            </h1>
            <h1>
                welcome to your dashboard
            </h1>
            <div>
                <code>play.mvte.net</code> has <code>{props.players}</code> players online
            </div>
        </Card>
    </>
}

export default Welcome;
