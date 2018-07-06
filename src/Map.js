import React, {Component} from 'react';
import {ISOCODES, koatu} from './regions';
import CI4DATA from './data/CI4_2018_05_all.json';

function nColor(n) {
    return Number((256 * n).toFixed()).toString(16);
}

function highlightCI4(iso) {
    const region = CI4DATA[koatu(iso)];
    if (!region) {
        return 'gray';
    }
    const nq = region[11];
    const marriage = region[12];
    const terrOrigin = region[14];
    const g = (marriage / nq);
    const r = (terrOrigin / nq);
    return `#${nColor(r)}${nColor(g)}44`;
}

class Region extends Component {
    handleClick = (event)=> {
        event.stopPropagation();
        const {iso} = event.target.dataset;
        this.props.onClick(iso);
    };

    render() {
        const {iso, selected, ...props} = this.props;
        const region = ISOCODES[iso];
        const color = selected ? 'yellow' : highlightCI4(iso);
        return (<path
            data-iso={iso}
            title={region.title}
            d={region.shape}
            fill={color}
            {...props}
            onClick={this.handleClick} />);
    }
}

export class Map extends Component {
    
    handleClick = (event)=> {
        this.props.onSelect(null);
    };

    render() {
        const {highlight} = this.props;
        return (<svg version="1.1" width="675" height="410" onClick={this.handleClick}>
            {Object.keys(ISOCODES)
                .map((iso)=> (<Region key={iso} iso={iso} selected={highlight === iso} onClick={this.props.onSelect} />))}
        </svg>);
    }
}
