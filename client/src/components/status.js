import React, { useState, useEffect } from "react";
import axios from "axios";

function Status() {
    const [players, setPlayers] = useState(-1);

    useEffect(() => {
        const updatePlayers = async () => {
          await axios.get("api/info/status")
            .then(res => {
              setPlayers(res.data.players.online);
            })
            .catch(err => {
              console.log(err);
            });
        };

        updatePlayers();
      }, []);

    return (
        <p>
            <code>play.mvte.net</code> currently has {players === 0 ? "no players" : players === 1 ? "1 player" : players + " players"} online
        </p>
    );
}

export default Status;