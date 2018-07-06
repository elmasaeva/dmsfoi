import React, {Component} from 'react';
import {ISOCODES, koatu} from './regions';
import CI4DATA from './data/CI4_2018_05_all.json';
import CI5DATA from './data/CI5_2018_05_all.json';

import {packci4, packci5} from './parsers';

function nColor(n) {
    return Number((256 * n).toFixed()).toString(16);
}

function highlightBoth(total, marriage, torig) {
    const g = (marriage / total);
    const r = (torig / total);
    return {g, r};
}

function highlightOne(total, metric) {
    return {g: (metric / total), r: (metric / total)};
}

function query(iso, type) {
    const region = (type === '4')
        ? CI4DATA[koatu(iso)]
        : CI5DATA[koatu(iso)];
    if (!region) {
        return {};
    }
    return (type === '4') ? packci4(region) : packci5(region);
}

function highlightCI45(iso, highlightCode, selected) {
    const highlight = highlightCode.slice(0, highlightCode.length - 1);
    const {total, marr, torig} = query(iso, highlightCode.slice(highlightCode.length - 1));
    const {g, r} = (highlight === 'both')
        ? highlightBoth(total, marr, torig)
        : highlightOne(total, (highlight === 'marriage') ? marr : torig);

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
            fill={highlightCI45(iso, highlight, selected)}
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
