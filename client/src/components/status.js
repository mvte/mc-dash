import React, { useState } from "react";
import axios from "axios";

function Status() {
    const [players, setPlayers] = useState(0);

    function updatePlayers() {
        axios.get("https://api.mcsrvstat.us/2/play.mvte.net ")
            .then(res => {
                setPlayers(res.data.players.online);
            })
            .catch(err => {
                console.log(err);
            });
    }

    updatePlayers();
    setInterval(updatePlayers, 30000);

    return (
        <p>
            <code>play.mvte.net</code> currently has {players === 0 ? "no players" : players === 1 ? "1 player" : players + " players"} online
        </p>
    );
}

export default Status;