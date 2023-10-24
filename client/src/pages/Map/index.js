import React from 'react';
import MapFrame from '../../components/MapFrame';
import { styled } from "@mui/material/styles";

const FullHeightDiv = styled('div')({
    height: '95vh',
});

function Map() {
    return (
        <FullHeightDiv>
            <MapFrame src="https://map.mvte.net/?worldname=world&mapname=surface" />
        </FullHeightDiv>
    );
}

export default Map;
