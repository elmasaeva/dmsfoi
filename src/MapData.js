import React, { Component, cloneElement } from 'react';
import {Map} from './Map';
import {Form52} from './Form52';
import './MapData.css'
import {ISOCODES, koatu} from './regions';
import CI4DATA from './data/CI4_2018_05_all.json';
import CI5DATA from './data/CI5_2018_05_all.json';
import POPULATION from './data/population_2018_05.json';


function padTh(num) {
    let ret = num.toString();
    while(ret.length < 3) {
        ret = '0' + ret;
    }
    return ret;
}

function formatNum(num) {
    const mil = num / 1000000;
    const th = (num / 1000) % 1000;
    const rest = num % 1000;
    return [mil, th, rest]
        .map(Math.floor)
        .reduce((acc, el)=> ((el || acc.length) ? [...acc, acc.length ? padTh(el) : el] : acc), [])
        .join('\u00A0');
}


const CI45_COLS = [
    ['marr', 'шлюб з громадянином України два роки; діти і батьки громадян України'],
    ['torig', 'мають право на набуття громадянства України за територіальним походженням'],
    ['immsibl', 'батьки іммігранта; чоловік чи дружина іммігранта; неповнолітні діти іммігранта'],
    ['sibl', 'повнорідні брати чи сестри, дід чи баба, онуки громадян України'],
    ['guard', 'опікуни чи піклувальники громадян України; перебувають під опікою чи піклуванням громадян України '],
    ['zak', 'закордонні українці, подружжя закордонних українців, їх діти'],

    ['stint', 'імміграція становить державний інтерес для України'],
    ['cul', 'діячі науки та культури'],
    ['spec', 'висококваліфіковані спеціалісти і робітники'],
    ['inv', 'інвестували 100 тисяч доларів США в Україні'],
    ['former', 'раніше перебували в громадянстві України'],
    ['ren', 'вийшли з громадянства України'],

    ['ref', 'біженці, їхні батьки, чоловік чи дружина та неповнолітні діти'],
    ['vict', 'постраждалі від торгівлі людьми'],

    ['refg', 'прикінцеві положення Закону України "Про імміграцію" (Абхазія, В`єтнам та імміграція до 2001 року)'],
    ['total', 'Всього іммігрантів'],

    ['recalled', 'Скасовано дозволів на імміграцію'],
    ['rcit', '- через прийняття до громадянства України'],
    ['remigr', '- через виїзд за кордон на постійне місце проживання'],
    ['rother', '- з інших причин'],
    ['refused', 'Відмовлено у видачі дозволу на імміграцію'],

    ['pr', 'Оформлено посвідок на постійне проживання'],
    ['newpr', '- вперше'],
    ['replacepr', ' - обмін'],
    ['refusedPr', 'Відмовлено в оформленні посвідки на постійне проживання'],
    ['recalledPr', 'Вилучено посвідок на постійне проживання'],
];



class CI45 extends Component {
    render() {
        const {ci4, ci5} = this.props;

        return (<table>
            <thead>
                <tr><th></th><th>Total</th><th>May 2018</th></tr>
            </thead>
            <tbody>
                {CI45_COLS.map(([code, label], idx)=> (<tr key={idx}>
                    <td width={700}>{label}</td>
                    <td>{formatNum(ci4[code]) || '--'}</td>
                    <td><strong>{formatNum(ci5[code]) || '--'}</strong></td>
                </tr>))}
            </tbody>
        </table>);
    }
}

class Selected extends Component {
    render() {
        const {iso} = this.props;
        const region = ISOCODES[iso];
        const ci4 = CI4DATA[koatu(iso)];
        const ci5 = CI5DATA[koatu(iso)];
        const population = POPULATION[koatu(iso)];

        if (!ci4 && !ci5) {
            return (<div>No Data</div>);
        }

        return (<div>
            <h2>{region ? region.title : 'Вся Україна'}</h2>
            {region ? (<span>ISO:{iso} КОАТУ:{koatu(iso)}</span>) : (<span>--</span>)}

            <section>
                <h2>Чисельність населення (за оцінкою)</h2>
                Наявне: {formatNum(population.ondate)}
                <br/>
                Постійне: {formatNum(population.ondateP)}
                <br/>
                Іммігрантів на 1000 населення: {((1000 * ci4.total) / population.average).toFixed(2)}
                <br/>
                Іммігрантів у травні на 100 000 населення: {((100000 * ci5.total) / population.average).toFixed(2)}
                <br/>
                Іммігрантів у травні на 100 іммігрантів: {((1000 * ci5.total) / ci4.total).toFixed(2)}

                <h2>Інформація  про кількість іммігрантів, які перебувають на обліку</h2>
                <CI45 ci4={ci4} ci5={ci5} />
            </section>
        </div>);
    }
}

const STYLE_HIGHLIGHT = {
    border: '2px solid yellow',
    padding: 5,
    margin: 7,
};
const STYLE_DEFAULT = {
    ...STYLE_HIGHLIGHT,
    border: '2px solid #4CAF50',
};

export class MapData extends Component {
    state = {
        highlight: 'both4',
    };

    handleHighlight = (event)=> {
        this.setState({highlight: event.target.name || 'both4'});
    };

    renderHighlight(buttons) {
        const {highlight} = this.state;
        return cloneElement(buttons, buttons.props, buttons.props.children.map(
            (button)=> cloneElement(button, {
                ...button.props,
                key: button.props.name,
                style: (button.props.name === highlight)
                    ? STYLE_HIGHLIGHT
                    : STYLE_DEFAULT
            }))
        );
    }

    render() {
        const {highlight} = this.state;
        const {iso='total'} = this.props.match.params;
        return (<div><div className="mapdata">
            <div>
                <Map selected={iso} highlight={highlight} />
                <h3>Highlight</h3>
                {this.renderHighlight(
                    <div onClick={this.handleHighlight}>
                        <button name="marriage4">Immigration by marriage</button>
                        <button name="origin4">Immigration by origin</button>
                        <button name="both4">Both</button>
                        <br key={0} />
                        <button name="marriage5">Immigration by marriage last moth</button>
                        <button name="origin5">Immigration by origin last month</button>
                        <button name="both5">Both last month</button>
                        <br key={1} />
                        <button name="ipercent4">Immigrants to population</button>
                        <button name="ipercent5">New immigrants to population</button>
                        <button name="ipercentnew">New immigrants to immigrants</button>
                    </div>
                )}
            </div>
            <div>
                <Selected iso={iso} />
            </div>
            </div>
            <Form52 iso={iso} />
        </div>);
    }
}
