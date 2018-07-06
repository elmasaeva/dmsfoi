import React, {Component} from 'react';
import {ISOCODES, koatu} from './regions';
import CI4DATA from './data/CI4_2018_05_all.json';

function nColor(n) {
    return Number((256 * n).toFixed()).toString(16);
}

function highlightBoth(nq, marriage, terrOrigin) {
    const g = (marriage / nq);
    const r = (terrOrigin / nq);
    return {g, r};
}

function highlightOne(nq, metric) {
    return {g: (metric / nq), r: (metric / nq)};
}

function highlightCI4(iso, highlight, selected) {
    const region = CI4DATA[koatu(iso)];
    if (!region) {
        return 'gray';
    }
    const nq = region[11];
    const marriage = region[12];
    const terrOrigin = region[14];
    const {g, r} = (highlight === 'both')
        ? highlightBoth(nq, marriage, terrOrigin)
        : highlightOne(nq, (highlight === 'marriage') ? marriage : terrOrigin);

    const b = selected ? '77' : '44';
    return `#${nColor(r)}${nColor(g)}${b}`;
}

class Region extends Component {
    handleClick = (event)=> {
        event.stopPropagation();
        const {iso} = event.target.dataset;
        this.props.onClick(iso);
    };

    render() {
        const {iso, selected, highlight, ...props} = this.props;
        const region = ISOCODES[iso];
        return (<path
            data-iso={iso}
            title={region.title}
            d={region.shape}
            fill={highlightCI4(iso, highlight, selected)}
            {...props}
            onClick={this.handleClick} />);
    }
}

export class Map extends Component {
    
    handleClick = (event)=> {
        this.props.onSelect(null);
    };

    render() {
        const {selected, highlight} = this.props;
        return (<svg version="1.1" width="675" height="410" onClick={this.handleClick}>
            {Object.keys(ISOCODES)
                .map((iso)=> (<Region key={iso} iso={iso} selected={selected === iso} highlight={highlight} onClick={this.props.onSelect} />))}
        </svg>);
    }
}
