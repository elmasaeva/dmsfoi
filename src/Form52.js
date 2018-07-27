import compareAsc from 'date-fns/compare_asc';
import React, { Component } from 'react';
import F52UA51 from './data/F52_UA51_2017.json';
import F52UA26 from './data/F52_UA26_2017.json';
import {code, flag} from './flags';
import './Form52.css';

function query(iso) {
    if (iso === 'UA-51') return F52UA51;
    if (iso === 'UA-26') return F52UA26;
    return null;
}

function nform(n, form0, form1, form2) {
    return (n%10===1 && n%100!==11
        ? form0
        : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? form1 : form2
    );
}

function parseDate(input) {
    const [day, month, year] = input ? input.split('.').map(Number) : [];
    return day ? new Date(year, month - 1, day) : null;
}

function days(date) {
    return Math.floor(Number(date) / 1000 / 3600 / 24);
}

function daysFrom(date1, date2) {
    return days(date2) - days(date1);
}

function weeksFrom(date1, date2) {
    return Math.floor(daysFrom(date1, date2) / 7);
}

function formatPeriod(days) {
    const years = Math.floor(days / 365);
    let rdays = days % 365;
    const months = Math.round(rdays / 30);
    return [
        years ? `${years} ${nform(years, 'рік', 'роки', 'роки')}` : null,
        months ? `${months} ${nform(months, 'місяць', 'місяці', 'місяців')}` : null,
    ].filter((part)=> part).join(', ');
}

function range(start, end) {
    const ret = [];
    while (start < end) {
        ret.push(start);
        start ++;
    }
    return ret;
}

function Bar({line}) {
    if (line.sweeks < 0) return null
    if (line.eweeks < 0) return null
    if (!line.end) return null;
    const FACTOR = 11;
    const waitClass = {
        0: 'wait0',
        1: 'wait1',
        2: 'wait2',
        3: 'wait3',
        4: 'wait4',
    }[Math.floor(line.eweeks / 26)] || 'wait';
    return (<div className="line">
        <div style={{width: line.sweeks * FACTOR}} />
        <div style={{height: 20}}><pre>{line.sdate}</pre></div>
        <div className={waitClass} style={{width: line.eweeks * FACTOR}} >{line.fcit}, {line.reason}, {formatPeriod(line.edays)}</div>
        <div><pre>{line.edate} {line.dnum}</pre></div>
    </div>);
}

const REASONS = {
    'Перебування понад 2 роки в шлюбі з громадянином України': 'шлюб',
    'Безперервне проживання на законних підставах на території України протягом останніх п\'яти років.': '5р',
};
function reasonMap(reason) {
    return REASONS[reason] || reason;
}

function unpackLine(line) {
    if (line.length === 5) {
        const [fcit, sdate, reason, dnum, edate] = line;
        return {fcit, sdate, reason, dnum, edate};
    }
    if (line.length === 8) {
        const [nn, fcountry, fcit, sdate, reason, edateNum, rdate, notes] = line;
        const [dnum, edate] = edateNum === '-' ? [] : edateNum.split(' ');
        return {nn, fcit, fcountry, sdate, reason: reasonMap(reason), dnum, edate, rdate, notes};
    }
    return {};

}

function Row({line, full}) {
    const {nn, fcit, fcountry, sdate, reason, dnum, edate, rdate, notes} = unpackLine(line);
    return (<tr>
        <td>{nn || '—'}</td>
        {full && <td colSpan={2} />}
        {full && <td className="left">{flag(code())}&nbsp;{fcountry || '—'}</td>}
        <td className="left">{flag(code(fcit))}&nbsp;{fcit}</td>
        {full && <td colSpan={2} />}
        <td>{sdate}</td>
        {full && <td />}
        <td>{reason}</td>
        <td className="right">{dnum} {edate || '—'}</td>
        <td className="right">{rdate || '—'}</td>
        {full && <td colSpan={2} />}
        {full && <td className="right">{notes || '—'}</td>}
    </tr>);
}

function Header({full}) {
    return(<tr>
        <th>N з/п</th>
        {full && <th>Прізвище, ім'я, по батькові особи</th>}
        {full && <th>Дата народження особи</th>}
        {full && <th>Країна, з якої прибула особа</th>}
        <th>Громадянство особи</th>
        {full && <th>Серія, номер паспортного документа особи (дата і підстави для отримання дозволу на імміграцію в Україну)</th>}
        {full && <th>П. І. Б. дітей, які внесені до заяви батьків</th>}
        <th>Дата подання заяви та документів в територіальному підрозділі ДМС України</th>
        {full && <th>Адреса реєстрації місця проживання особи</th>}
        <th>Підстави для прийняття до громадянства України (зазначити умови прийняття до громадянства України)</th>
        <th>Дата прийняття до громадянства України (номер і дата указу Президента України</th>
        <th>Відмітка про виконання особою зобов'язання припинити іноземне громадянство (дата подання декларації, довідка про вихід)</th>
        {full && <th>Номер та дата видачі довідки про реєстрацію особи громадянином України</th>}
        {full && <th>Підпис особи про отримання довідки</th>}
        {full && <th>Примітки</th>}
    </tr>);
}

function Header2({full}) {
    const cols = full ? range(1, 16) : [1, 5, 8, 10, 11, 12];
    return (<tr>{cols.map((n)=> <th key={n}>{n}</th>)}</tr>)
}

export class Form52 extends Component {
    state = {full: false, bars: true};

    handleFull = ()=> {
        this.setState({full: !this.state.full});
    };

    handleBars = ()=> {
        this.setState({bars: !this.state.bars});
    };

    renderTable(lines, full) {
        return (
            <table>
                <thead>
                    <Header full={full} />
                    <Header2 full={full} />
                </thead>
                <tbody>
                    {lines.map((line, idx)=> (<Row full={full} line={line} key={idx} />))}
                </tbody>
            </table>
        );
    }

    renderBars(lines) {
        const y2016 = new Date(2016, 0, 1);
        const dates = lines
            .map(unpackLine)
            .map(({sdate, edate, rdate, ...rest})=> ({
                ...rest,
                start: parseDate(sdate), end: parseDate(edate),
                sdate, edate,
            }))
            .map(({start, end, ...rest})=> ({
                ...rest,
                start, end,
                sweeks: weeksFrom(y2016, start),
                eweeks: weeksFrom(start, end),
                edays: daysFrom(start, end),
            }))
            .sort((line1, line2)=> compareAsc(line1.start, line2.start));

        return (<div className="bars">
            {dates.map((line, idx)=> <Bar key={idx} line={line} />)}
        </div>);
    }

    render() {
        const {iso} = this.props;
        const {full, bars} = this.state;
        const lines = query(iso);
        if (!lines) {
            return null;
        }
        return (<div className="form52">
            <h2 onClick={this.handleBars}>
                Фактичний термін розгляду заяв про прийняття до громадянства України
            </h2>
            {bars ? this.renderBars(lines) : <p onClick={this.handleBars}>показати</p>}

            <h2 onClick={this.handleFull}>ЖУРНАЛ обліку заяв, що подаються особами для прийняття до громадянства України<br/>(стаття 9 Закону України "Про громадянство України")</h2>

            <section className="right">
                ЗАТВЕРДЖЕНО<br/>
                Наказ Міністерства внутрішніх справ України<br/>
                16.08.2012 N 715<br/><br/>

                Форма 52<br/>
            </section>
            <div className="clear" />


            <h3>{iso}</h3>

            {this.renderTable(lines, full)}

            <footer>
            * підстави для прийняття до громадянства:<br/>
            шлюб - на підставі шлюбу з громадяднином України більше двох років;
            <br/>
            біж. - на підставі проживання в Україні більше трьох років в статусі біженця;
            <br/>
            5р - на підставі проживання в Україні більше п'яти років після імміграції (отримання посвідки на постійне проживання);
            <br/>
            3р - на підставі проживання в Україні більше трьох років після імміграції (для осіб без громадянства).
            </footer>

    </div>);
    }
}
