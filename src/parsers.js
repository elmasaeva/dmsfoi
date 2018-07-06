export function packci4(ci4) {
    const [
        ,total,,
        cul, spec, inv, sibl, former, immsibl, ref, vict,
        ,
        marr, guard, torig, stint, zak, refg, ren,
    ] = ci4;

    return {total, cul, spec, inv, sibl, former, immsibl, ref, vict,
        marr, guard, torig, stint, zak, refg, ren};
}

export function packci5(ci5) {
    const [
        ,,,
        refused, total,
        cul, spec, inv, sibl, former, immsibl, vict,
        marr, guard, torig, stint, zak,
        pr,newpr,replacepr,
        refg, ren,
        refusedPr,
        recalled, rcit,  remigr, rother,
        recalledPr,
    ] = ci5;

    return {refused, total, cul, spec, inv, sibl, former, immsibl, vict,
        marr, guard, torig, stint, zak, refg, ren,
        pr, newpr, replacepr, refusedPr, recalled, rcit, remigr, rother,
        recalledPr};
}
