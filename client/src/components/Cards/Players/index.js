import { Card, ScrollableDiv } from '../CardConsts';

const Players = (props) => {
    return <>
        <Card>
            <b>players online</b>
            {props.players.length}/{props.maxPlayers}
            <ScrollableDiv>
                <table>
                    {
                        props.players.map((player) => {
                            return <tr>
                                <td>
                                    <img src={player.icon} alt="player icon" />
                                </td>
                                <td>
                                    {player.name}
                                </td>
                            </tr>
                        })
                    }
                </table>
            </ScrollableDiv>           
        </Card>
    </>
}

export default Players;

/*    &-3 {
    --scroll-size: 5px;
    --scroll-radius: 10px;
    --scroll-track: rgb(255 255 255 / 10%);
    --scroll-thumb-color: #fff;
  }
  */