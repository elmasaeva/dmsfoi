import React, {Component} from 'react';
import {ISOCODES} from './regions';

class Region extends Component {
    handleClick = (event)=> {
        const {iso} = event.target.dataset;
        this.props.onClick(iso);
    };

    render() {
        const {iso, selected, ...props} = this.props;
        const region = ISOCODES[iso];
        const color = selected ? 'yellow' : 'gray';
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
    
    render() {
        const {highlight} = this.props;
        return (<svg version="1.1" width="675" height="410" >
            {Object.keys(ISOCODES)
                .map((iso)=> (<Region key={iso} iso={iso} selected={highlight === iso} onClick={this.props.onSelect} />))}
        </svg>);
    }
}
