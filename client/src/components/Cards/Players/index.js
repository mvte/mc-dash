import { Card } from '../CardConsts';
import styled from '@mui/material/styles/styled';

const Players = (props) => {
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