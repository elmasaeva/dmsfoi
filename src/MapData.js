import React, { Component } from 'react';
import {Map} from './Map';
import {ISOCODES} from './regions';
import CI4 from './data/CI4_2018_05_all.json';
import CI5 from './data/CI5_2018_05_all.json';

const KOATU_OVERRIDE = {
    '43': '01', // АР Крим використовує 43 (код КОАТУУ — 01)
    '09': '44', // Луганська область використовує 09 (код КОАТУУ — 44)
    '77': '73', // Чернівецька область використовує 77 (код КОАТУУ — 73)
    '30': '80', // місто Київ використовує 30 (код КОАТУУ — 80)
    '40': '85', // місто Севастополь використовує 40 (код КОАТУУ — 85)
};

function koatu(iso) {
    const isoN = iso.substr(3);
    const region = KOATU_OVERRIDE[isoN] || isoN;
    return `${region}01`;
}

const CONTAINER = {
    display: 'flex',
};


class Selected extends Component {
    render() {
        const {iso} = this.props;
        const region = ISOCODES[iso];
        const ci4 = CI4[koatu(iso)];
        const ci5 = CI5[koatu(iso)];

        if (!ci4 && !ci5) {
            return (<div>No Data</div>);
        }

        return (<div>
            {iso} {koatu(iso)} {region.title}

            <section style={{display: 'flex'}}>
                <div>
                    <h2>CI4</h2>
                    {ci4 && (<ul>
                        {ci4.map((num, idx)=> (<li key={idx}>{num}</li>))}
                    </ul>)}
                </div>

                <div>
                    <h2>CI5</h2>
                    {ci5 && (<ul>
                        {ci5.map((num, idx)=> (<li key={idx}>{num}</li>))}
                    </ul>)}
                </div>
            </section>
        </div>);
    }
}

export class MapData extends Component {
    state = {
        selected: null,
    };

    handleSelect = (iso)=> {
        this.setState({selected: iso});
    };

    render() {
        const {selected} = this.state;
        return (<div style={CONTAINER}>
            <Map highlight={selected} onSelect={this.handleSelect} />
            <div>
                <h2>Selected</h2>
                {selected && (<Selected iso={selected} />)}
            </div>
        </div>);
    }
}
