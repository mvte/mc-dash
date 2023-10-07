import React from "react";
import { Card } from "../CardConsts";
import "./index.css";


const Welcome = (props) => {
    let colorString = props.health === "running" ? "green" : props.health === "dead" ? "red" : "orange";
    console.log(colorString);
    return <>
        <Card>
            <h1>
                hello, {props.user}
            </h1>
            <h1>
                welcome to your dashboard
            </h1>
            <div>
                <code>play.mvte.net</code> is <span style={{color: colorString}}> {props.health} </span>
            </div>
        </Card>
    </>
}

export default Welcome;
