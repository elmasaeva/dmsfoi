function packci4(ci4) {
    const [
        code, total,,
        cul, spec, inv, sibl, former, immsibl, ref, vict,
        ,
        marr, guard, torig, stint, zak, refg, ren,
    ] = ci4;

    return {code, total, cul, spec, inv, sibl, former, immsibl, ref, vict,
        marr, guard, torig, stint, zak, refg, ren};
}

function packci5(ci5) {
    const [
        code,,,
        refused, total,
        cul, spec, inv, sibl, former, immsibl, vict,
        marr, guard, torig, stint, zak,
        pr,newpr,replacepr,
        refg, ren,
        refusedPr,
        recalled, rcit,  remigr, rother,
        recalledPr,
    ] = ci5;

    return {code, refused, total, cul, spec, inv, sibl, former, immsibl, vict,
        marr, guard, torig, stint, zak, refg, ren,
        pr, newpr, replacepr, refusedPr, recalled, rcit, remigr, rother,
        recalledPr};
}

function population(p) {
    const [code, ondate, average, ondateP, averageP] = p;
    return {code, ondate, average, ondateP, averageP};
}

module.exports = {packci4, packci5, population};
