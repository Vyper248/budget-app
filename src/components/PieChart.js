import React, { useState } from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    margin: 20px;

    & #container {
        display: inline-grid;
        grid-template-columns: ${props => `${props.pieWidth} ${props.labelWidth}`};
        grid-gap: 50px;
    }

    & #pie {
        position: relative;
        width: ${props => props.pieWidth};
        height: ${props => props.pieWidth};
        border-radius: 50%;
        background: ${props => props.gradient};
        // filter: grayscale(1);
        transition: filter 1s;

        :hover {
            ${props => props.selectedVisible ? 'cursor: pointer;' : ''}
        }

        :after {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: ${props => props.gradientTwo};
            opacity: ${props => props.selectedVisible ? '1' : '0'};
            transition: opacity 0.5s;
        }
    }

    & #labels {
        width: ${props => props.labelWidth};
        height: ${props => props.pieWidth};
        overflow: scroll;

        #label {
            display: flex;
            align-items: center;
            margin: 5px;

            #color {
                width: 50px;
                min-width: 50px;
                height: 33px;
                border-radius: 5px;
                
                :hover {
                    cursor: pointer;
                }
            }

            #text {
                text-align: left;
                margin-left: 5px;
                font-size: 0.9em;
                text-transform: capitalize;
            }
        }
    }
`

const getGradient = (data, colors, selectedColor='') => {
    const grayColors = ['#4D4D4D', '#A1A1A1', '#686868', '#2C2C2C', '#595959', '#535353', '#797979', '#BBBBBB', '#D2D2D2', '#B9B9B9', '#DFDFDF', '#ABABAB', '#6A6A6A', '#222222', '#070707', '#C6C6C6', '#E5E5E5', '#D4D4D4', '#B2B2B2', '#9F9F9F'];

    let percentages = data.map(obj => obj.percentage);
    let pieString = 'conic-gradient(';
    let currentPercent = 0;

    percentages.forEach((percent,i) => {
        let color = colors[i%colors.length];
        let grayColor = grayColors[i%grayColors.length];
        let nextPercent = currentPercent + parseFloat(percent);
        if (selectedColor.length === 0 || selectedColor === color) pieString += `${color} ${currentPercent.toFixed(2)}%, ${color} ${nextPercent.toFixed(2)}%, `;
        else pieString += `${grayColor} ${currentPercent.toFixed(2)}%, ${grayColor} ${nextPercent.toFixed(2)}%, `;
        currentPercent = nextPercent;
    });

    pieString = pieString.slice(0,-2);
    pieString += ')';

    return pieString;
}

const getPercentages = (data) => {
    let total = data.reduce((a,c) => {
        return a + c.value;
    }, 0);

    let mappedData = data.map((obj, i) => {
        let newObj = {...obj};
        newObj.id = i;
        newObj.percentage = (obj.value / total * 100).toFixed(3);
        newObj.percentageSmall = (obj.value / total * 100).toFixed(1);
        return newObj;
    });

    return mappedData;
}

const PieChart = ({title='', data, width=600}) => {
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedVisible, setSelectedVisible] = useState(false);

    const onClickColor = (color) => () => {
        setSelectedColor(color);
        if (selectedColor.length === 0) setSelectedVisible(true);
        else if (color === selectedColor && selectedVisible) setSelectedVisible(false);
        else if (color === selectedColor && !selectedVisible) setSelectedVisible(true);
        else if (color !== selectedColor) setSelectedVisible(true);
    }

    const onClickChart = () => {
        setSelectedVisible(false);
    }

    // const colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928', '#8b0000', '#008b8b', '#00008b'];
    const colors = ['#8b0000','#ff0000','#b03060','#008b8b','#9acd32','#00ff00','#00d89a','#00ffff','#00bfff','#4169e1','#0000ff','#00006a','#d8bfd8','#eee8aa','#ffd700','#ffa07a','#ff8c00','#6a3d9a','#ee82ee','#ff00ff'];
    let labelWidth = 200;
    let pieWidth = width-labelWidth;

    let mappedData = getPercentages(data);
    let gradient = getGradient(mappedData, colors);
    let gradientSingle = getGradient(mappedData, colors, selectedColor);

    return (
        <StyledComp labelWidth={labelWidth+'px'} pieWidth={pieWidth+'px'} gradient={gradient} gradientTwo={gradientSingle} selectedVisible={selectedVisible}>
            <h4>{title}</h4>
            <div id='container'>
                <div id='pie' onClick={onClickChart}></div>
                <div id='labels'>
                    {
                        mappedData.map((obj,i) => {
                            let color = colors[i%colors.length];
                            let valueVisible = color === selectedColor && selectedVisible;
                            return (
                                <div key={i} id='label'>
                                    <div title={obj.percentageSmall+'%'} id='color' style={{backgroundColor: color}} onClick={onClickColor(color)}></div>
                                    <div title={obj.percentageSmall+'%'} id='text'>{obj.label} <span>{valueVisible ? `(${obj.percentageSmall}%)` : ''}</span></div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </StyledComp>
    );
}

export default PieChart;