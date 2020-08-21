import React from 'react';
import styled from 'styled-components';

import { parseCurrency } from '../functions';

const StyledComp = styled.div`
    margin: 10px;
    font-size: 1em;
    font-weight: bold;

    & > table {
        margin: auto;
    }

    & > table td:first-of-type {
        text-align: right;
    }

    & > table td:last-of-type {
        text-align: left;
    }
`;

const TotalsDisplay = ({label, value, fundObj}) => {
    if (fundObj !== undefined) {
        return (
            <StyledComp>
                <table>
                    <tbody>
                        <tr>
                            <td>Total Saved: </td>
                            <td>{parseCurrency(value)}</td>
                        </tr>
                        {
                            fundObj.target > 0 ?
                                <React.Fragment>
                                    <tr>
                                        <td>Fund Target: </td>
                                        <td>{parseCurrency(fundObj.target)}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Needed: </td>
                                        <td>{parseCurrency(fundObj.remaining)}</td>
                                    </tr>
                                </React.Fragment> : null 
                        }
                    </tbody>
                </table>
            </StyledComp>
        );
    }

    return (
        <StyledComp>
            {label}: {parseCurrency(value)}
        </StyledComp>
    );
}

export default TotalsDisplay;