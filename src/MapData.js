import React, { Component, cloneElement } from 'react';
import {Map} from './Map';
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
        .join(' ');
}

const CI4_COLS = [
    'Total',
    'Quota',
    'діячі науки та культури',
    'висококваліфіковані спеціалісти і робітники',
    'особи, які здійснили іноземну інвестицію в економіку України на суму не менше 100 (ста) тисяч доларів США',
    'повнорідні брати чи сестри, дід чи баба, онуки громадян України',
    'особи, які раніше перебували в громадянстві України',
    'батьки, чоловік (дружина) іммігранта та його неповнолітні діти',
    'біженці, а також їхні батьки, чоловіки (дружини) та неповнолітні діти, які проживають разом з ними',
    'особи, які постраждали від торгівлі людьми',
    'Non-quota',
    'один з  подружжя, якщо другий з подружжя, з яким він перебуває у шлюбі понад 2 роки, є громадянином України, дітям і батькам громадян України',
    'особи, які є опікунами чи піклувальниками громадян України, або перебувають під опікою чи піклуванням громадян України ',
    'особи, які мають право на набуття громадянства України за територіальним походженням',
    'особи, імміграція яких становить державний інтерес для України',
    'закордонні українці, подружжя закордонних українців, їх діти',
    'особи, які отримали посвідку на постійне проживання за Прикінцевими положеннями Закону України "Про імміграцію"',
    'особи, які отримали посвідку на постійне проживання відп. до ч. 16 ст. 4 ЗУ "Про правовий статус іноземців та осіб без громадянства"',
];
const CI5_COLS = [
    'Розглянуто справ про надання дозволу на імміграцію',
    'у т.ч. справ, що надійшли із-за кордону',
    'Відмовлено у видачі дозволу на імміграцію',
    'Видано дозволів на імміграцію',
    'діячам науки та культури, імміграція яких відповідає інтересам України',
    'висококваліфікованим спеціалістам і робітникам, гостра потреба в яких є відчутною для економіки України',
    'особам, які здійснили іноземну інвестицію в економіку України на суму не менше 100 (ста) тисяч доларів США',
    'особам, які є повнорідними братом чи сестрою, дідом чи бабою, онуком чи онукою громадян України',
    'особам, які раніше перебували в громадянстві України',
    'батькам, чоловіку (дружині) іммігранта та його неповнолітнім дітям',
    'особам, які безперервно прожили на території  України протягом трьох років від дня встановлення їм статусу особи, яка постраждала від торгівлі людьми',
    'одному з подружжя, якщо другий з подружжя, з яким він перебуває у шлюбі понад два роки, є громадянином України, дітям і батькам громадян України',
    'особам, які є опікунами чи піклувальниками громадян України або перебувають під опікою чи піклуванням громадян України',
    'особам, які мають право на набуття громадянства України за територіальним походженням',
    'особам, імміграція яких становить державний інтерес для України',
    'закордоним українцям, подружжям закордонних українців, їх дітям',
    'Оофрмлено посвідок на постійне проживання',
    'вперше, відповідно до пункту 3  пост. КМУ від 28.03.2012 № 251',
    'у порядку обміну, відповідно до пунктів 14, 16, абз. 1 пункту 22 пост. КМУ від 28.03.2012 № 251',
    'відповідно до Прикінцевих положень    ЗУ "Про імміграцію"',
    'відп. до ч. 16 ст. 4 ЗУ "Про правовий статус іноземців та обг"',
    'Відмовлено в оформленні посвідки на постійне проживання',
    'Скасовано дозволів на імміграцію',
    'прийняттям до громадянства України',
    'виїздом за кордон на постійне місце проживання',
    'інших причин',
    'Вилучено посвідок на постійне проживання',
];

class CI4 extends Component {
    render() {
        const {line} = this.props;
        const [, ...numbers] = line;
        return (<table>
            <tbody>
                {numbers.map((num, idx)=> (<tr key={idx}>
                    <td width={700}>{CI4_COLS[idx]}</td>
                    <td><strong>{formatNum(num) || '--'}</strong></td></tr>))}
            </tbody>
        </table>);
    }
}

class CI5 extends Component {
    render() {
        const {line} = this.props;
        const [, ...numbers] = line;
        return (<table>
            <tbody>
                {numbers.map((num, idx)=> (<tr key={idx}>
                    <td width={700}>{CI5_COLS[idx]}</td>
                    <td><strong>{formatNum(num) || '--'}</strong></td></tr>))}
            </tbody>
        </table>);
    }
}

const CONTAINER = {
    display: 'flex',
};


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
                <div>
                    <h2>Інформація  про кількість іммігрантів, які перебувають на обліку</h2>
                    {ci4 && (<CI4 line={ci4} />)}
                </div>

                <div>
                    <h2>Інформація про кількість виданих дозволів на імміграцію та посвідок на постійне проживання</h2>
                    {ci5 && (<CI5 line={ci5} />)}
                </div>
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
        return (<div style={CONTAINER}>
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
