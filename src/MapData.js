import React, { Component, cloneElement } from 'react';
import {Map} from './Map';
import './MapData.css'
import {ISOCODES, koatu} from './regions';
import CI4DATA from './data/CI4_2018_05_all.json';
import CI5DATA from './data/CI5_2018_05_all.json';

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
        .map(Math.round)
        .reduce((acc, el)=> ((el || acc.length) ? [...acc, acc.length ? padTh(el) : el] : acc), [])
        .join('\u00A0');
}


const CI45_COLS = [
    ['marr', 'один з  подружжя, якщо другий з подружжя, з яким він перебуває у шлюбі понад 2 роки, є громадянином України, дітям і батькам громадян України'],
    ['torig', 'особи, які мають право на набуття громадянства України за територіальним походженням'],
    ['immsibl', 'батьки, чоловік (дружина) іммігранта та його неповнолітні діти'],
    ['sibl', 'повнорідні брати чи сестри, дід чи баба, онуки громадян України'],
    ['guard', 'особи, які є опікунами чи піклувальниками громадян України, або перебувають під опікою чи піклуванням громадян України '],
    ['zak', 'закордонні українці, подружжя закордонних українців, їх діти'],

    ['stint', 'особи, імміграція яких становить державний інтерес для України'],
    ['cul', 'діячі науки та культури'],
    ['spec', 'висококваліфіковані спеціалісти і робітники'],
    ['inv', 'особи, які здійснили іноземну інвестицію в економіку України на суму не менше 100 (ста) тисяч доларів США'],
    ['ren', 'особи, які раніше перебували в громадянстві України'],

    ['ref', 'біженці, а також їхні батьки, чоловіки (дружини) та неповнолітні діти, які проживають разом з ними'],
    ['vict', 'особи, які постраждали від торгівлі людьми'],

    ['trans', 'особи, які отримали посвідку на постійне проживання за Прикінцевими положеннями Закону України "Про імміграцію"'],
    ['st416', 'особи, які отримали посвідку на постійне проживання відп. до ч. 16 ст. 4 ЗУ "Про правовий статус іноземців та осіб без громадянства"'],
    ['total', 'Всього іммігрантів'],

    ['recalled', 'Скасовано дозволів на імміграцію'],
    ['rcit', 'прийняттям до громадянства України'],
    ['remigr', 'виїздом за кордон на постійне місце проживання'],
    ['rother', 'інших причин'],
    ['refused', 'Відмовлено у видачі дозволу на імміграцію'],

    ['pr', 'Оформлено посвідок на постійне проживання'],
    ['newpr', 'вперше, відповідно до пункту 3  пост. КМУ від 28.03.2012 № 251'],
    ['replacepr', 'у порядку обміну, відповідно до пунктів 14, 16, абз. 1 пункту 22 пост. КМУ від 28.03.2012 № 251'],
    ['refusedPr', 'Відмовлено в оформленні посвідки на постійне проживання'],
    ['recalledPr', 'Вилучено посвідок на постійне проживання'],
];

function packci4(ci4) {
    const [
        ,total,,
        cul, spec, inv, sibl, ren, immsibl, ref, vict,
        ,
        marr, guard, torig, stint, zak, trans, st416,
    ] = ci4;

    return {total, cul, spec, inv, sibl, ren, immsibl, ref, vict,
        marr, guard, torig, stint, zak, trans, st416};
}

function packci5(ci5) {
    const [
        ,,,
        refused, total,
        cul, spec, inv, sibl, ren, immsibl, vict,
        marr, guard, torig, stint, zak,
        pr,newpr,replacepr,
        trans, st416,
        refusedPr,
        recalled, rcit,  remigr, rother,
        recalledPr,
    ] = ci5;

    return {refused, total, cul, spec, inv, sibl, ren, immsibl, vict,
        marr, guard, torig, stint, zak, trans, st416,
        pr, newpr, replacepr, refusedPr, recalled, rcit, remigr, rother,
        recalledPr};
}

class CI45 extends Component {
    render() {
        const ci4 = packci4(this.props.ci4);
        const ci5 = packci5(this.props.ci5);

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

        if (!ci4 && !ci5) {
            return (<div>No Data</div>);
        }

        return (<div>
            <h2>{region ? region.title : 'Вся Україна'}</h2>
            {region ? (<span>ISO:{iso} КОАТУ:{koatu(iso)}</span>) : (<span>--</span>)}

            <section>
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
        selected: null,
        highlight: 'both',
    };

    handleSelect = (iso)=> {
        this.setState({selected: iso});
    };

    handleHighlight = (event)=> {
        this.setState({highlight: event.target.name});
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
        const {selected, highlight} = this.state;
        return (<div className="mapdata">
            <div>
                <Map selected={selected} highlight={highlight} onSelect={this.handleSelect} />
                <h3>Highlight</h3>
                {this.renderHighlight(
                    <div onClick={this.handleHighlight}>
                        <button name="marriage">Immigration by marriage</button>
                        <button name="origin">Immigration by origin</button>
                        <button name="both">Both</button>
                    </div>
                )}
            </div>
            <div>
                <Selected iso={selected || 'total'} />
            </div>
        </div>);
    }
}
