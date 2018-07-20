const COUNTRIES = {
    'Туреччина': 'tr',
    'Сирія': 'sy',
    'Афганістан': 'af',
    'Молдова': 'md',
    'Азербайджан': 'az',
    'Вірменія': 'am',
    'Судан': 'sd',
    'Йорданія': 'jo',
    'Ірак': 'iq',
    'Казахстан': 'kz',
    'Грузія': 'ge',
    'Ангола': 'ao',
    'Пакістан': 'pk',
    'Ємен': 'ye',
    'Конго': 'cg',
    'Непал': 'np',
    'Ліван': 'lb',
    'Бангладеш': 'bd',
    'Камерун': 'cm',
    'Єгипет': 'eg',
    'Алжир': 'dz',
    'Індія': 'in',
    'Ефіопія': 'et',
    'Іран': 'ir',
    'Узбекистан': 'uz',
    'ОБГ': 'un',
};

export function code(name) {
    return COUNTRIES[name];
}

export function flag(code) {
    const OFFSET = 0x1f185;
    return code ? String.fromCodePoint(OFFSET + code.charCodeAt(0)) + String.fromCodePoint(OFFSET + code.charCodeAt(1)) : null;
}


