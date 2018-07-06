export function packci4(ci4) {
    const [
        ,total,,
        cul, spec, inv, sibl, ren, immsibl, ref, vict,
        ,
        marr, guard, torig, stint, zak, trans, st416,
    ] = ci4;

    return {total, cul, spec, inv, sibl, ren, immsibl, ref, vict,
        marr, guard, torig, stint, zak, trans, st416};
}

export function packci5(ci5) {
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
