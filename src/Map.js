import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {ISOCODES, koatu} from './regions';
import CI4DATA from './data/CI4_2018_05_all.json';
import CI5DATA from './data/CI5_2018_05_all.json';
import POPULATION from './data/population_2018_05.json';

function pad(num) {
    return num.length === 2 ? num : '0' + num;
}

function nColor(n) {
    return pad(Number((256 * n).toFixed()).toString(16));
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
    return region || {};
}

function highlightNewPercent(iso, selected) {
    const ci4 = CI4DATA[koatu(iso)];
    const ci5 = CI5DATA[koatu(iso)];

    if(!ci4 || !ci5) {
        return 'gray';
    }
    const g = (ci5.total / ci4.total) * 87;
    const r = 1 - g;
    const b = selected ? '77' : '44';
    return `#${nColor(r)}${nColor(g)}${b}`;
}

function highlightPercent(iso, code, selected) {
    const region = query(iso, code);
    const population = POPULATION[koatu(iso)];
    if(!region || !population) {
        return 'gray';
    }
    const g = (region.total / population.average) * ((code === '4') ? 77 : 10000);
    const r = 1 - g;
    const b = selected ? '77' : '44';
    return `#${nColor(r)}${nColor(g)}${b}`;
}

function highlightCI45(iso, highlightCode, selected) {
    const code = highlightCode.slice(highlightCode.length - 1);
    const highlight = highlightCode.slice(0, highlightCode.length - 1);
    if (highlight === 'ipercent') {
        return highlightPercent(iso, code, selected);
    }
    if (highlightCode === 'ipercentnew') {
        return highlightNewPercent(iso, selected);
    }


    const {total, marr, torig} = query(iso, code);
    const {g, r} = (highlight === 'both')
        ? highlightBoth(total, marr, torig)
        : highlightOne(total, (highlight === 'marriage') ? marr : torig);

    const b = selected ? '77' : '44';
    return `#${nColor(r)}${nColor(g)}${b}`;
}

class Region extends Component {
    render() {
        const {iso, selected, highlight, ...props} = this.props;
        const region = ISOCODES[iso];
        return (<Link to={`/${iso}/`}> <path
            title={region.title}
            d={region.shape}
            fill={highlightCI45(iso, highlight, selected)}
            {...props} />
        </Link>);
    }
}

export class Map extends Component {
    
    render() {
        const {selected, highlight} = this.props;
        return (<svg version="1.1" width="675" height="410">
            {Object.keys(ISOCODES)
                .map((iso)=> (<Region key={iso} iso={iso} selected={selected === iso} highlight={highlight} onClick={this.props.onSelect} />))}
        </svg>);
    }
}
