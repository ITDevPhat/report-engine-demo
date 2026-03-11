/** @format */

import { useState, useMemo } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const RAW_DATA = [
    {
        id: 'R01',
        order_id: 'CA-2016-152156',
        region: 'South',
        state: 'Kentucky',
        category: 'Furniture',
        sub_category: 'Bookcases',
        sales: 261.96,
        quantity: 2,
        discount: 0,
        profit: -9.13,
    },
    {
        id: 'R02',
        order_id: 'CA-2016-152156',
        region: 'South',
        state: 'Kentucky',
        category: 'Furniture',
        sub_category: 'Chairs',
        sales: 731.94,
        quantity: 3,
        discount: 0,
        profit: 219.58,
    },
    {
        id: 'R03',
        order_id: 'CA-2016-152156',
        region: 'South',
        state: 'Kentucky',
        category: 'Technology',
        sub_category: 'Phones',
        sales: 907.15,
        quantity: 5,
        discount: 0,
        profit: 90.72,
    },
    {
        id: 'R04',
        order_id: 'CA-2016-138688',
        region: 'West',
        state: 'California',
        category: 'Office Supplies',
        sub_category: 'Labels',
        sales: 14.62,
        quantity: 2,
        discount: 0,
        profit: 6.87,
    },
    {
        id: 'R05',
        order_id: 'US-2015-108966',
        region: 'West',
        state: 'California',
        category: 'Furniture',
        sub_category: 'Tables',
        sales: 957.58,
        quantity: 5,
        discount: 0.45,
        profit: -306.0,
    },
    {
        id: 'R06',
        order_id: 'US-2015-108966',
        region: 'West',
        state: 'California',
        category: 'Office Supplies',
        sub_category: 'Storage',
        sales: 22.37,
        quantity: 2,
        discount: 0,
        profit: 2.52,
    },
    {
        id: 'R07',
        order_id: 'CA-2014-115812',
        region: 'West',
        state: 'California',
        category: 'Furniture',
        sub_category: 'Furnishings',
        sales: 48.86,
        quantity: 7,
        discount: 0,
        profit: 14.17,
    },
    {
        id: 'R08',
        order_id: 'CA-2014-115812',
        region: 'West',
        state: 'California',
        category: 'Technology',
        sub_category: 'Accessories',
        sales: 114.9,
        quantity: 3,
        discount: 0,
        profit: 34.47,
    },
    {
        id: 'R09',
        order_id: 'CA-2014-115812',
        region: 'South',
        state: 'Florida',
        category: 'Office Supplies',
        sub_category: 'Art',
        sales: 7.28,
        quantity: 2,
        discount: 0,
        profit: 1.97,
    },
    {
        id: 'R10',
        order_id: 'US-2015-108966',
        region: 'South',
        state: 'Florida',
        category: 'Technology',
        sub_category: 'Machines',
        sales: 288.0,
        quantity: 2,
        discount: 0,
        profit: -5.76,
    },
    {
        id: 'R11',
        order_id: 'CA-2016-152156',
        region: 'South',
        state: 'Florida',
        category: 'Furniture',
        sub_category: 'Chairs',
        sales: 420.5,
        quantity: 2,
        discount: 0.2,
        profit: 55.2,
    },
    {
        id: 'R12',
        order_id: 'CA-2016-138688',
        region: 'West',
        state: 'Oregon',
        category: 'Technology',
        sub_category: 'Phones',
        sales: 675.2,
        quantity: 3,
        discount: 0,
        profit: 101.28,
    },
    {
        id: 'R13',
        order_id: 'US-2015-108966',
        region: 'West',
        state: 'Oregon',
        category: 'Office Supplies',
        sub_category: 'Binders',
        sales: 38.94,
        quantity: 3,
        discount: 0.2,
        profit: 5.45,
    },
    {
        id: 'R14',
        order_id: 'CA-2014-115812',
        region: 'East',
        state: 'New York',
        category: 'Technology',
        sub_category: 'Copiers',
        sales: 1299.0,
        quantity: 1,
        discount: 0,
        profit: 258.8,
    },
    {
        id: 'R15',
        order_id: 'CA-2016-152156',
        region: 'East',
        state: 'New York',
        category: 'Office Supplies',
        sub_category: 'Paper',
        sales: 55.98,
        quantity: 6,
        discount: 0.2,
        profit: 15.34,
    },
];

const DEF = {
    pageWidth: 850,
    pageHeight: 1100,
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 40,
    marginRight: 40,
    sections: [
        {
            type: 'ReportHeader',
            height: 60,
            groupName: null,
            items: [
                {
                    name: 'ReportTitle',
                    expression: '"Sales Performance Report"',
                    bounds: { x: 0, y: 0, w: 770, h: 30 },
                },
                {
                    name: 'SubTitle',
                    expression: '"Grouped by Region → State → Category"',
                    bounds: { x: 0, y: 32, w: 770, h: 20 },
                },
            ],
        },
        {
            type: 'GroupHeader',
            groupName: 'RegionGroup',
            height: 32,
            items: [
                {
                    name: 'RegionLabel',
                    expression: '"Region: "+Fields.region',
                    bounds: { x: 0, y: 4, w: 300, h: 24 },
                },
                {
                    name: 'RegionSales',
                    expression: '"$"+Sum(Fields.sales)',
                    bounds: { x: 500, y: 4, w: 130, h: 24 },
                },
            ],
        },
        {
            type: 'GroupHeader',
            groupName: 'StateGroup',
            height: 28,
            items: [
                {
                    name: 'StateLabel',
                    expression: 'Fields.state',
                    bounds: { x: 16, y: 4, w: 250, h: 20 },
                },
                {
                    name: 'StateSales',
                    expression: '"$"+Sum(Fields.sales)',
                    bounds: { x: 500, y: 4, w: 130, h: 20 },
                },
            ],
        },
        {
            type: 'GroupHeader',
            groupName: 'CategoryGroup',
            height: 24,
            items: [
                {
                    name: 'CatLabel',
                    expression: 'Fields.category',
                    bounds: { x: 32, y: 2, w: 200, h: 20 },
                },
            ],
        },
        {
            type: 'Detail',
            height: 20,
            groupName: null,
            items: [
                {
                    name: 'SubCat',
                    expression: 'Fields.sub_category',
                    bounds: { x: 48, y: 2, w: 180, h: 16 },
                },
                {
                    name: 'Sales',
                    expression: '"$"+Fields.sales',
                    bounds: { x: 500, y: 2, w: 120, h: 16 },
                },
                {
                    name: 'Profit',
                    expression: '"$"+Fields.profit',
                    bounds: { x: 630, y: 2, w: 120, h: 16 },
                },
            ],
        },
        {
            type: 'GroupFooter',
            groupName: 'CategoryGroup',
            height: 20,
            items: [
                {
                    name: 'CatSum',
                    expression: '"Subtotal $"+Sum(Fields.sales)',
                    bounds: { x: 32, y: 2, w: 260, h: 16 },
                },
            ],
        },
        {
            type: 'GroupFooter',
            groupName: 'StateGroup',
            height: 22,
            items: [
                {
                    name: 'StateSum',
                    expression: 'Fields.state+" Total $"+Sum(Fields.sales)',
                    bounds: { x: 16, y: 2, w: 280, h: 18 },
                },
            ],
        },
        {
            type: 'GroupFooter',
            groupName: 'RegionGroup',
            height: 28,
            items: [
                {
                    name: 'RegionSum',
                    expression: 'Fields.region+" Region $"+Sum(Fields.sales)',
                    bounds: { x: 0, y: 4, w: 300, h: 20 },
                },
            ],
        },
        {
            type: 'ReportFooter',
            height: 40,
            groupName: null,
            items: [
                {
                    name: 'GrandTotal',
                    expression: '"GRAND TOTAL $"+Sum(Fields.sales)',
                    bounds: { x: 0, y: 8, w: 400, h: 24 },
                },
            ],
        },
    ],
};

// ─── ENGINE ──────────────────────────────────────────────────────────────────

const f = (n) =>
    typeof n === 'number'
        ? n.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          })
        : (n ?? '');

function makeAgg(rows) {
    return {
        sales_sum: rows.reduce((s, r) => s + r.sales, 0),
        profit_sum: rows.reduce((s, r) => s + r.profit, 0),
        row_count: rows.length,
        order_count: new Set(rows.map((r) => r.order_id)).size,
    };
}

function buildCube(data) {
    const rMap = {};
    for (const row of data) {
        if (!rMap[row.region]) rMap[row.region] = {};
        if (!rMap[row.region][row.state]) rMap[row.region][row.state] = {};
        if (!rMap[row.region][row.state][row.category])
            rMap[row.region][row.state][row.category] = [];
        rMap[row.region][row.state][row.category].push(row);
    }
    const root = {
        id: 'root',
        dim: 'ROOT',
        val: '[ALL]',
        level: 0,
        agg: makeAgg(data),
        children: [],
    };
    for (const [region, sMap] of Object.entries(rMap)) {
        const regionRows = Object.values(sMap).flatMap((sm) =>
            Object.values(sm).flat(),
        );
        const rNode = {
            id: `r_${region}`,
            dim: 'Region',
            val: region,
            level: 1,
            agg: makeAgg(regionRows),
            children: [],
        };
        for (const [state, cMap] of Object.entries(sMap)) {
            const stateRows = Object.values(cMap).flat();
            const sNode = {
                id: `s_${state}`,
                dim: 'State',
                val: state,
                level: 2,
                agg: makeAgg(stateRows),
                children: [],
            };
            for (const [cat, catRows] of Object.entries(cMap)) {
                sNode.children.push({
                    id: `c_${cat}`,
                    dim: 'Category',
                    val: cat,
                    level: 3,
                    agg: makeAgg(catRows),
                    children: catRows.map((row) => ({
                        id: `leaf_${row.id}`,
                        dim: 'Detail',
                        val: row.sub_category,
                        level: 4,
                        agg: makeAgg([row]),
                        children: [],
                        raw: row,
                    })),
                });
            }
            rNode.children.push(sNode);
        }
        root.children.push(rNode);
    }
    return root;
}

let _id = 0;
const nid = () => `n${++_id}`;

function resolveExpr(expr, ctx) {
    if (!expr) return '';
    if (/^".*"$/.test(expr)) return expr.slice(1, -1);
    const a = ctx?._agg;
    if (expr === 'Fields.region') return ctx?.region ?? '';
    if (expr === 'Fields.state') return ctx?.state ?? '';
    if (expr === 'Fields.category') return ctx?.category ?? '';
    if (expr === 'Fields.sub_category') return ctx?.sub_category ?? '';
    if (expr === 'Fields.sales') return f(ctx?.sales);
    if (expr === 'Fields.profit') return f(ctx?.profit);
    if (expr.includes('Sum(Fields.sales)') && a) return `$${f(a.sales_sum)}`;
    if (expr.includes('Sum(Fields.profit)') && a) return `$${f(a.profit_sum)}`;
    if (expr.startsWith('"Region: "')) return `Region: ${ctx?.region ?? ''}`;
    if (expr.startsWith('"Subtotal')) return `Subtotal $${f(a?.sales_sum)}`;
    if (expr.includes('" Total $"'))
        return `${ctx?.state ?? ''} Total $${f(a?.sales_sum)}`;
    if (expr.includes('" Region $"'))
        return `${ctx?.region ?? ''} Region $${f(a?.sales_sum)}`;
    if (expr.startsWith('"GRAND')) return `GRAND TOTAL $${f(a?.sales_sum)}`;
    return expr;
}

function mkItems(sec, ctx, agg) {
    return sec.items.map((item) => ({
        id: nid(),
        type: 'TextBox',
        defRef: item.name,
        ctx: ctx ? { ...ctx, _agg: agg } : { _agg: agg },
        val: resolveExpr(
            item.expression,
            ctx ? { ...ctx, _agg: agg } : { _agg: agg },
        ),
        expr: item.expression,
        agg,
        bounds: { x: item.bounds.x, y: 0, w: item.bounds.w, h: item.bounds.h },
        children: [],
    }));
}

function getSec(type, gn) {
    return DEF.sections.find(
        (s) => s.type === type && (gn ? s.groupName === gn : true),
    );
}

function buildPT(cube) {
    _id = 0;
    const ml = DEF.marginLeft,
        mw = DEF.pageWidth - DEF.marginLeft - DEF.marginRight;
    const root = {
        id: nid(),
        type: 'Report',
        defRef: 'Report',
        ctx: { _agg: cube.agg },
        val: 'Report',
        agg: cube.agg,
        bounds: { x: 0, y: 0, w: DEF.pageWidth, h: 0 },
        children: [],
    };

    const rh = getSec('ReportHeader');
    root.children.push({
        id: nid(),
        type: 'ReportHeader',
        defRef: 'ReportHeader',
        ctx: { _agg: cube.agg },
        val: 'Report Header',
        agg: cube.agg,
        bounds: { x: ml, y: DEF.marginTop, w: mw, h: rh.height },
        children: mkItems(rh, null, cube.agg),
    });

    for (const rNode of cube.children) {
        const rCtx = { region: rNode.val, _agg: rNode.agg };
        const rhd = getSec('GroupHeader', 'RegionGroup'),
            rfd = getSec('GroupFooter', 'RegionGroup');
        const rg = {
            id: nid(),
            type: 'Group',
            defRef: 'RegionGroup',
            ctx: rCtx,
            val: rNode.val,
            agg: rNode.agg,
            bounds: { x: ml, y: 0, w: mw, h: 0 },
            children: [
                {
                    id: nid(),
                    type: 'GroupHeader',
                    defRef: 'RegionGroup.Header',
                    ctx: rCtx,
                    val: `Region: ${rNode.val}`,
                    agg: rNode.agg,
                    bounds: { x: ml, y: 0, w: mw, h: rhd.height },
                    children: mkItems(rhd, rCtx, rNode.agg),
                },
            ],
        };

        for (const sNode of rNode.children) {
            const sCtx = {
                region: rNode.val,
                state: sNode.val,
                _agg: sNode.agg,
            };
            const shd = getSec('GroupHeader', 'StateGroup'),
                sfd = getSec('GroupFooter', 'StateGroup');
            const sg = {
                id: nid(),
                type: 'Group',
                defRef: 'StateGroup',
                ctx: sCtx,
                val: sNode.val,
                agg: sNode.agg,
                bounds: { x: ml + 16, y: 0, w: mw - 16, h: 0 },
                children: [
                    {
                        id: nid(),
                        type: 'GroupHeader',
                        defRef: 'StateGroup.Header',
                        ctx: sCtx,
                        val: sNode.val,
                        agg: sNode.agg,
                        bounds: { x: ml + 16, y: 0, w: mw - 16, h: shd.height },
                        children: mkItems(shd, sCtx, sNode.agg),
                    },
                ],
            };

            for (const cNode of sNode.children) {
                const cCtx = {
                    region: rNode.val,
                    state: sNode.val,
                    category: cNode.val,
                    _agg: cNode.agg,
                };
                const chd = getSec('GroupHeader', 'CategoryGroup'),
                    cfd = getSec('GroupFooter', 'CategoryGroup'),
                    det = getSec('Detail');
                const cg = {
                    id: nid(),
                    type: 'Group',
                    defRef: 'CategoryGroup',
                    ctx: cCtx,
                    val: cNode.val,
                    agg: cNode.agg,
                    bounds: { x: ml + 32, y: 0, w: mw - 32, h: 0 },
                    children: [
                        {
                            id: nid(),
                            type: 'GroupHeader',
                            defRef: 'CategoryGroup.Header',
                            ctx: cCtx,
                            val: cNode.val,
                            agg: cNode.agg,
                            bounds: {
                                x: ml + 32,
                                y: 0,
                                w: mw - 32,
                                h: chd.height,
                            },
                            children: mkItems(chd, cCtx, cNode.agg),
                        },
                    ],
                };
                for (const leaf of cNode.children) {
                    const rowCtx = { ...leaf.raw, _agg: leaf.agg };
                    cg.children.push({
                        id: nid(),
                        type: 'Detail',
                        defRef: 'Detail',
                        ctx: rowCtx,
                        val: leaf.raw.sub_category,
                        agg: leaf.agg,
                        bounds: { x: ml + 48, y: 0, w: mw - 48, h: det.height },
                        children: mkItems(det, rowCtx, leaf.agg),
                        raw: leaf.raw,
                    });
                }
                cg.children.push({
                    id: nid(),
                    type: 'GroupFooter',
                    defRef: 'CategoryGroup.Footer',
                    ctx: cCtx,
                    val: `Subtotal`,
                    agg: cNode.agg,
                    bounds: { x: ml + 32, y: 0, w: mw - 32, h: cfd.height },
                    children: mkItems(cfd, cCtx, cNode.agg),
                });
                sg.children.push(cg);
            }
            sg.children.push({
                id: nid(),
                type: 'GroupFooter',
                defRef: 'StateGroup.Footer',
                ctx: sCtx,
                val: `${sNode.val} Total`,
                agg: sNode.agg,
                bounds: { x: ml + 16, y: 0, w: mw - 16, h: sfd.height },
                children: mkItems(sfd, sCtx, sNode.agg),
            });
            rg.children.push(sg);
        }
        rg.children.push({
            id: nid(),
            type: 'GroupFooter',
            defRef: 'RegionGroup.Footer',
            ctx: rCtx,
            val: `${rNode.val} Total`,
            agg: rNode.agg,
            bounds: { x: ml, y: 0, w: mw, h: rfd.height },
            children: mkItems(rfd, rCtx, rNode.agg),
        });
        root.children.push(rg);
    }

    const rf = getSec('ReportFooter');
    root.children.push({
        id: nid(),
        type: 'ReportFooter',
        defRef: 'ReportFooter',
        ctx: { _agg: cube.agg },
        val: 'Report Footer',
        agg: cube.agg,
        bounds: { x: ml, y: 0, w: mw, h: rf.height },
        children: mkItems(rf, null, cube.agg),
    });
    return root;
}

function runLayout(root) {
    function measure(n) {
        n._m = true;
        n.children.forEach(measure);
    }
    function arrange(n, py) {
        n.bounds.y = py;
        if (n.type === 'TextBox') {
            n._a = true;
            return n.bounds.h || 16;
        }
        let ly = 0;
        n.children.forEach((c) => {
            ly += arrange(c, py + ly);
        });
        n.bounds.h = n.bounds.h || ly;
        n._a = true;
        return n.bounds.h || ly;
    }
    measure(root);
    root._totalH = arrange(root, DEF.marginTop);
    return root;
}

function buildPages(root) {
    const usable = DEF.pageHeight - DEF.marginTop - DEF.marginBottom;
    const pages = [{ num: 1, els: [], used: 0 }];
    let cur = pages[0];
    function collect(n, depth) {
        for (const c of n.children) {
            if (c.type === 'TextBox') continue;
            const h = c.bounds.h || 20;
            if (cur.used + h > usable && cur.els.length > 0) {
                cur = { num: pages.length + 1, els: [], used: 0 };
                pages.push(cur);
            }
            cur.els.push({ ...c, depth });
            cur.used += h;
            collect(c, depth + 1);
        }
    }
    collect(root, 0);
    return pages;
}

function countN(n) {
    return !n ? 0 : 1 + (n.children || []).reduce((s, c) => s + countN(c), 0);
}

// ─── UI ──────────────────────────────────────────────────────────────────────

const TYPE_STYLE = {
    Report: 'bg-slate-800 text-slate-400 border-slate-600',
    ReportHeader: 'bg-cyan-950 text-cyan-400 border-cyan-800',
    ReportFooter: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    Group: 'bg-violet-950 text-violet-400 border-violet-800',
    GroupHeader: 'bg-indigo-950 text-indigo-400 border-indigo-800',
    GroupFooter: 'bg-indigo-950 text-indigo-500 border-indigo-900',
    Detail: 'bg-slate-900 text-slate-400 border-slate-700',
    TextBox: 'bg-slate-950 text-slate-600 border-slate-800',
};

const Pill = ({ label, type }) => {
    const cls =
        TYPE_STYLE[type] || 'bg-slate-800 text-slate-400 border-slate-600';
    return (
        <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${cls}`}
        >
            {label}
        </span>
    );
};

// Stage 0 ────────────────────────────────────────────────────────────────────

function Stage0() {
    const totalSales = RAW_DATA.reduce((s, r) => s + r.sales, 0);
    const totalProfit = RAW_DATA.reduce((s, r) => s + r.profit, 0);
    return (
        <div className="space-y-3">
            <p className="text-xs text-slate-500">
                SqlDataSource executes → returns{' '}
                <span className="text-white">{RAW_DATA.length} flat rows</span>.
                No hierarchy, no aggregates yet.
            </p>
            <div className="overflow-auto rounded border border-slate-700">
                <table className="w-full text-xs font-mono">
                    <thead>
                        <tr className="bg-slate-800 border-b border-slate-700">
                            {[
                                '#',
                                'Region',
                                'State',
                                'Category',
                                'Sub-Category',
                                'Sales',
                                'Profit',
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="text-left px-3 py-2 text-slate-400 font-normal whitespace-nowrap"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {RAW_DATA.map((r, i) => (
                            <tr
                                key={r.id}
                                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                            >
                                <td className="px-3 py-1.5 text-slate-600">
                                    {i + 1}
                                </td>
                                <td className="px-3 py-1.5 text-violet-400">
                                    {r.region}
                                </td>
                                <td className="px-3 py-1.5 text-blue-400">
                                    {r.state}
                                </td>
                                <td className="px-3 py-1.5 text-amber-400">
                                    {r.category}
                                </td>
                                <td className="px-3 py-1.5 text-slate-300">
                                    {r.sub_category}
                                </td>
                                <td className="px-3 py-1.5 text-emerald-400 text-right">
                                    ${f(r.sales)}
                                </td>
                                <td
                                    className={`px-3 py-1.5 text-right ${r.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                                >
                                    ${f(r.profit)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-slate-800 border-t border-slate-600">
                            <td
                                colSpan={5}
                                className="px-3 py-1.5 text-slate-500 text-xs"
                            >
                                Total ({RAW_DATA.length} rows)
                            </td>
                            <td className="px-3 py-1.5 text-emerald-400 text-right font-bold">
                                ${f(totalSales)}
                            </td>
                            <td
                                className={`px-3 py-1.5 text-right font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                            >
                                ${f(totalProfit)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

// Stage 1 ────────────────────────────────────────────────────────────────────

function CubeRow({ node, depth = 0 }) {
    const [open, setOpen] = useState(depth < 2);
    const has = node.children?.length > 0;
    const indent = depth * 20;
    const dimColor =
        [
            'text-slate-400',
            'text-violet-400',
            'text-blue-400',
            'text-amber-400',
            'text-slate-500',
        ][depth] || 'text-slate-500';

    return (
        <>
            <tr
                className="border-b border-slate-800 hover:bg-slate-800/30 cursor-pointer transition-colors"
                onClick={() => has && setOpen((o) => !o)}
            >
                <td className="py-1.5 px-3">
                    <div
                        className="flex items-center gap-1.5"
                        style={{ paddingLeft: indent }}
                    >
                        <span className="text-slate-600 w-3 text-center text-xs">
                            {has ? (open ? '▾' : '▸') : '·'}
                        </span>
                        <span className={`text-xs font-mono ${dimColor}`}>
                            {node.dim}
                        </span>
                        <span className="text-xs text-white">{node.val}</span>
                    </div>
                </td>
                <td className="py-1.5 px-3 text-xs font-mono text-emerald-400 text-right">
                    ${f(node.agg.sales_sum)}
                </td>
                <td
                    className={`py-1.5 px-3 text-xs font-mono text-right ${node.agg.profit_sum >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                >
                    ${f(node.agg.profit_sum)}
                </td>
                <td className="py-1.5 px-3 text-xs font-mono text-sky-400 text-center">
                    {node.agg.row_count}
                </td>
                <td className="py-1.5 px-3 text-xs font-mono text-slate-500 text-center">
                    {node.agg.order_count}
                </td>
            </tr>
            {open &&
                has &&
                node.children.map((c) => (
                    <CubeRow key={c.id} node={c} depth={depth + 1} />
                ))}
        </>
    );
}

function Stage1({ cube }) {
    const total = useMemo(() => countN(cube), [cube]);
    return (
        <div className="space-y-3">
            <p className="text-xs text-slate-500">
                CubeBuilder scans {RAW_DATA.length} rows →{' '}
                <span className="text-white">{total} nodes</span>. Aggregates
                cached at every level. Click to expand.
            </p>
            <div className="rounded border border-slate-700 overflow-auto max-h-96">
                <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-slate-800 border-b border-slate-700">
                        <tr>
                            {[
                                'Dimension / Value',
                                'Sales Σ',
                                'Profit Σ',
                                'Rows',
                                'Orders',
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="text-left px-3 py-2 text-slate-400 font-normal"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <CubeRow node={cube} depth={0} />
                    </tbody>
                </table>
            </div>
            <div className="text-xs text-slate-500 bg-slate-800/40 rounded p-3 border border-slate-700">
                💡 Aggregates are{' '}
                <span className="text-white">cached at every node</span> —
                GroupFooter reads from cache directly, zero re-scan.
            </div>
        </div>
    );
}

// Stage 2 ────────────────────────────────────────────────────────────────────

function ProcRow({ node, depth = 0 }) {
    const [open, setOpen] = useState(depth < 1);
    const [det, setDet] = useState(false);
    const has = node.children?.length > 0;
    const isTB = node.type === 'TextBox';
    const indent = depth * 16;

    return (
        <>
            <tr
                className="border-b border-slate-800 hover:bg-slate-800/30 cursor-pointer transition-colors"
                onClick={() => (has ? setOpen((o) => !o) : setDet((d) => !d))}
            >
                <td className="py-1.5 px-3">
                    <div
                        className="flex items-center gap-1.5"
                        style={{ paddingLeft: indent }}
                    >
                        <span className="text-slate-600 w-3 text-center text-xs">
                            {has ? (open ? '▾' : '▸') : isTB ? '·' : '·'}
                        </span>
                        <Pill label={node.type} type={node.type} />
                    </div>
                </td>
                <td className="py-1.5 px-3 text-xs font-mono text-slate-500">
                    {node.defRef}
                </td>
                <td className="py-1.5 px-3 text-xs text-slate-300 max-w-xs truncate">
                    {String(node.val || '').slice(0, 50)}
                </td>
                <td className="py-1.5 px-3 text-xs font-mono text-slate-600 text-right">
                    {node.agg ? `$${f(node.agg.sales_sum)}` : ''}
                </td>
            </tr>
            {isTB && det && (
                <tr className="bg-slate-900/50 border-b border-slate-800">
                    <td
                        colSpan={4}
                        className="px-3 py-1.5 text-[10px] font-mono text-slate-500"
                        style={{ paddingLeft: indent + 32 }}
                    >
                        expr:{' '}
                        <span className="text-amber-400">{node.expr}</span>
                        <span className="ml-4">
                            bounds: x={node.bounds?.x} w={node.bounds?.w}
                        </span>
                    </td>
                </tr>
            )}
            {open &&
                has &&
                node.children.map((c) => (
                    <ProcRow key={c.id} node={c} depth={depth + 1} />
                ))}
        </>
    );
}

function Stage2({ pt }) {
    const total = useMemo(() => countN(pt), [pt]);
    return (
        <div className="space-y-3">
            <p className="text-xs text-slate-500">
                ReportDefinition × CubeHierarchy →{' '}
                <span className="text-white">{total} processing nodes</span>.
                All expressions resolved. Click TextBox rows to see expression
                detail.
            </p>
            <div className="rounded border border-slate-700 overflow-auto max-h-96">
                <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-slate-800 border-b border-slate-700">
                        <tr>
                            {[
                                'Node Type',
                                'Definition Ref',
                                'Resolved Value',
                                'Sales Cache',
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="text-left px-3 py-2 text-slate-400 font-normal"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <ProcRow node={pt} depth={0} />
                    </tbody>
                </table>
            </div>
            <div className="text-xs text-slate-500 bg-slate-800/40 rounded p-3 border border-slate-700">
                💡 {RAW_DATA.length} rows →{' '}
                <span className="text-white">{total} nodes</span>. This
                expansion lives entirely in RAM — larger datasets =
                proportionally more memory.
            </div>
        </div>
    );
}

// Stage 3 ────────────────────────────────────────────────────────────────────

function LayoutRow({ node, depth = 0 }) {
    const [open, setOpen] = useState(depth < 1);
    const has = node.children?.filter((c) => c.type !== 'TextBox').length > 0;
    if (node.type === 'TextBox') return null;
    return (
        <>
            <tr
                className="border-b border-slate-800 hover:bg-slate-800/30 cursor-pointer transition-colors"
                onClick={() => has && setOpen((o) => !o)}
            >
                <td className="py-1.5 px-3">
                    <div
                        className="flex items-center gap-1.5"
                        style={{ paddingLeft: depth * 16 }}
                    >
                        <span className="text-slate-600 w-3 text-center text-xs">
                            {has ? (open ? '▾' : '▸') : '·'}
                        </span>
                        <Pill label={node.type} type={node.type} />
                    </div>
                </td>
                <td className="py-1.5 px-3 text-xs font-mono text-slate-500">
                    {node.defRef}
                </td>
                <td className="py-1.5 px-3 text-xs font-mono text-slate-400 text-right">
                    {node.bounds?.x}
                </td>
                <td className="py-1.5 px-3 text-xs font-mono text-slate-400 text-right">
                    {node.bounds?.y}
                </td>
                <td className="py-1.5 px-3 text-xs font-mono text-cyan-400 text-right">
                    {node.bounds?.w}
                </td>
                <td className="py-1.5 px-3 text-xs font-mono text-amber-400 text-right">
                    {node.bounds?.h}
                </td>
                <td className="py-1.5 px-3">
                    <div className="flex gap-1">
                        {node._m && (
                            <span className="text-[10px] text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded">
                                measured
                            </span>
                        )}
                        {node._a && (
                            <span className="text-[10px] text-green-400 bg-green-950 px-1.5 py-0.5 rounded">
                                arranged
                            </span>
                        )}
                    </div>
                </td>
            </tr>
            {open &&
                has &&
                node.children.map((c) => (
                    <LayoutRow key={c.id} node={c} depth={depth + 1} />
                ))}
        </>
    );
}

function Stage3({ pt }) {
    const usable = DEF.pageHeight - DEF.marginTop - DEF.marginBottom;
    const estPages = Math.ceil((pt._totalH || 0) / usable);
    return (
        <div className="space-y-3">
            <p className="text-xs text-slate-500">
                Measure phase → Arrange phase → assigns x/y on infinite canvas.
                Total height: <span className="text-white">{pt._totalH}px</span>{' '}
                · Page usable: {usable}px →{' '}
                <span className="text-white">~{estPages} pages</span>
            </p>
            <div className="rounded border border-slate-700 overflow-auto max-h-96">
                <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-slate-800 border-b border-slate-700">
                        <tr>
                            {[
                                'Node',
                                'Def Ref',
                                'X',
                                'Y',
                                'W',
                                'H',
                                'Phase',
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="text-left px-3 py-2 text-slate-400 font-normal"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <LayoutRow node={pt} depth={0} />
                    </tbody>
                </table>
            </div>
            <div className="text-xs text-slate-500 bg-slate-800/40 rounded p-3 border border-slate-700">
                💡 No page breaks yet — layout is on an infinite vertical
                canvas. Paging Engine handles splits next.
            </div>
        </div>
    );
}

// Stage 4 ────────────────────────────────────────────────────────────────────

function Stage4({ pages }) {
    const [sel, setSel] = useState(0);
    const page = pages[sel];
    const usable = DEF.pageHeight - DEF.marginTop - DEF.marginBottom;

    return (
        <div className="space-y-3">
            <p className="text-xs text-slate-500">
                Layout tree sliced into{' '}
                <span className="text-white">{pages.length} pages</span> of{' '}
                {usable}px each.
            </p>
            <div className="flex gap-3">
                {/* Page selector */}
                <div className="shrink-0 flex flex-col gap-1">
                    {pages.map((p, i) => (
                        <button
                            key={i}
                            onClick={() => setSel(i)}
                            className={`text-left px-3 py-2 rounded text-xs font-mono border transition-all ${i === sel ? 'bg-slate-700 border-slate-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}
                        >
                            <div className="font-bold">Page {p.num}</div>
                            <div className="text-[10px] text-slate-600">
                                {p.els.length} els · {p.used.toFixed(0)}px
                            </div>
                            <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-cyan-600 rounded-full"
                                    style={{
                                        width: `${Math.min(100, (p.used / usable) * 100)}%`,
                                    }}
                                />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Elements list */}
                <div className="flex-1 rounded border border-slate-700 overflow-auto max-h-80">
                    <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-3 py-2 flex gap-3 text-xs text-slate-400">
                        <span className="font-bold text-white">
                            Page {page.num}
                        </span>
                        <span>{page.els.length} elements</span>
                        <span>
                            {page.used.toFixed(0)} / {usable}px
                        </span>
                    </div>
                    {page.els.map((el, i) => (
                        <div
                            key={el.id}
                            className="flex items-center gap-2 px-3 py-1.5 border-b border-slate-800 hover:bg-slate-800/30 text-xs"
                        >
                            <span className="text-slate-700 w-5 text-right shrink-0">
                                {i + 1}
                            </span>
                            <Pill label={el.type} type={el.type} />
                            <span className="text-slate-500 truncate flex-1 font-mono">
                                {String(el.val || '').slice(0, 50)}
                            </span>
                            <span className="text-slate-700 shrink-0">
                                {el.height}px
                            </span>
                        </div>
                    ))}
                    {sel < pages.length - 1 && (
                        <div className="px-3 py-2 border-t-2 border-dashed border-red-800/60 bg-red-950/10 text-xs text-red-500/70 font-mono text-center">
                            ─── page break → Page {page.num + 1} ───
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Stage 5 ────────────────────────────────────────────────────────────────────

function Stage5({ pages }) {
    const [fmt, setFmt] = useState('PDF');

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <p className="text-xs text-slate-500 flex-1">
                    Renderer iterates paging tree → emits primitives. No
                    recomputation.
                </p>
                <div className="flex gap-1">
                    {['PDF', 'HTML', 'Excel'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFmt(f)}
                            className={`text-xs font-mono px-3 py-1 rounded border transition-all ${fmt === f ? 'bg-slate-200 text-slate-900 border-transparent' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {fmt === 'PDF' && (
                <div className="overflow-auto max-h-[500px] space-y-4 p-1">
                    {pages.map((page) => (
                        <div
                            key={page.num}
                            style={{
                                background: '#fff',
                                color: '#111',
                                fontFamily: 'Georgia,serif',
                                fontSize: 11,
                                padding: '28px 32px',
                                maxWidth: 640,
                                margin: '0 auto',
                                boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
                                borderRadius: 3,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 8,
                                    color: '#999',
                                    fontFamily: 'monospace',
                                    textAlign: 'right',
                                    marginBottom: 6,
                                }}
                            >
                                Page {page.num}/{pages.length}
                            </div>
                            {page.els.map((el) => {
                                const ref = el.defRef;
                                if (ref === 'ReportHeader')
                                    return (
                                        <div
                                            key={el.id}
                                            style={{
                                                borderBottom:
                                                    '2px solid #1e293b',
                                                paddingBottom: 10,
                                                marginBottom: 14,
                                                textAlign: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: 17,
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Sales Performance Report
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 9,
                                                    color: '#888',
                                                    marginTop: 3,
                                                }}
                                            >
                                                Region → State → Category
                                            </div>
                                        </div>
                                    );
                                if (ref === 'ReportFooter')
                                    return (
                                        <div
                                            key={el.id}
                                            style={{
                                                borderTop: '2px solid #1e293b',
                                                paddingTop: 10,
                                                marginTop: 8,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <b>GRAND TOTAL</b>
                                            <b style={{ color: '#065f46' }}>
                                                ${f(el.agg?.sales_sum)}
                                            </b>
                                        </div>
                                    );
                                if (ref === 'RegionGroup.Header')
                                    return (
                                        <div
                                            key={el.id}
                                            style={{
                                                background: '#ede9fe',
                                                borderLeft: '3px solid #7c3aed',
                                                padding: '4px 8px',
                                                margin: '10px 0 2px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                color: '#5b21b6',
                                            }}
                                        >
                                            <span>▸ {el.ctx?.region}</span>
                                            <span>${f(el.agg?.sales_sum)}</span>
                                        </div>
                                    );
                                if (ref === 'RegionGroup.Footer')
                                    return (
                                        <div
                                            key={el.id}
                                            style={{
                                                background: '#ede9fe',
                                                padding: '3px 8px',
                                                marginBottom: 6,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: 10,
                                                color: '#6d28d9',
                                            }}
                                        >
                                            <span>
                                                {el.ctx?.region} Region Total
                                            </span>
                                            <b>${f(el.agg?.sales_sum)}</b>
                                        </div>
                                    );
                                if (ref === 'StateGroup.Header')
                                    return (
                                        <div
                                            key={el.id}
                                            style={{
                                                background: '#dbeafe',
                                                padding: '3px 8px 3px 16px',
                                                marginBottom: 1,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: 10,
                                                color: '#1d4ed8',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            <span>• {el.ctx?.state}</span>
                                            <span>${f(el.agg?.sales_sum)}</span>
                                        </div>
                                    );
                                if (ref === 'StateGroup.Footer')
                                    return (
                                        <div
                                            key={el.id}
                                            style={{
                                                background: '#eff6ff',
                                                padding: '2px 8px 2px 16px',
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                fontSize: 9,
                                                color: '#1d4ed8',
                                            }}
                                        >
                                            <span>
                                                {el.ctx?.state} Total:{' '}
                                                <b>${f(el.agg?.sales_sum)}</b>
                                            </span>
                                        </div>
                                    );
                                if (ref === 'CategoryGroup.Header')
                                    return (
                                        <div
                                            key={el.id}
                                            style={{
                                                padding: '1px 8px 1px 30px',
                                                color: '#92400e',
                                                fontSize: 9,
                                                fontStyle: 'italic',
                                            }}
                                        >
                                            {el.ctx?.category}
                                        </div>
                                    );
                                if (ref === 'CategoryGroup.Footer')
                                    return (
                                        <div
                                            key={el.id}
                                            style={{
                                                padding: '1px 8px 3px 30px',
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                fontSize: 9,
                                                color: '#92400e',
                                            }}
                                        >
                                            <span>
                                                Subtotal{' '}
                                                <b>${f(el.agg?.sales_sum)}</b>
                                            </span>
                                        </div>
                                    );
                                if (el.type === 'Detail')
                                    return (
                                        <div
                                            key={el.id}
                                            style={{
                                                display: 'flex',
                                                padding: '1.5px 8px 1.5px 44px',
                                                fontSize: 9,
                                                borderBottom:
                                                    '1px solid #f1f5f9',
                                                color: '#334155',
                                            }}
                                        >
                                            <span style={{ flex: 1 }}>
                                                {el.ctx?.sub_category}
                                            </span>
                                            <span
                                                style={{
                                                    width: 64,
                                                    textAlign: 'right',
                                                }}
                                            >
                                                ${f(el.ctx?.sales)}
                                            </span>
                                            <span
                                                style={{
                                                    width: 64,
                                                    textAlign: 'right',
                                                    color:
                                                        el.ctx?.profit >= 0
                                                            ? '#065f46'
                                                            : '#b91c1c',
                                                }}
                                            >
                                                ${f(el.ctx?.profit)}
                                            </span>
                                        </div>
                                    );
                                return null;
                            })}
                        </div>
                    ))}
                </div>
            )}

            {fmt === 'HTML' && (
                <div className="font-mono text-xs bg-slate-950 rounded border border-slate-700 p-4 overflow-auto max-h-[500px]">
                    <div className="text-slate-600 mb-2">
                        {'<!-- Telerik HTML5 Rendering Extension -->'}
                    </div>
                    {pages.map((page) => (
                        <div key={page.num} className="mb-4">
                            <div className="text-yellow-500">{`<div class="trv-page" data-page="${page.num}">`}</div>
                            {page.els.map((el) => (
                                <div
                                    key={el.id}
                                    className="ml-4"
                                    style={{
                                        paddingLeft: `${(el.depth || 0) * 8}px`,
                                    }}
                                >
                                    <span className="text-blue-400">
                                        {'  <div'}
                                    </span>
                                    <span className="text-violet-400">{` class="trv-${el.type.toLowerCase()}"`}</span>
                                    <span className="text-slate-500">{` data-def="${el.defRef}"`}</span>
                                    <span className="text-blue-400">{'>'}</span>
                                    <span className="text-slate-300">
                                        {String(el.val || '').slice(0, 55)}
                                    </span>
                                    <span className="text-blue-400">
                                        {'</div>'}
                                    </span>
                                </div>
                            ))}
                            <div className="text-yellow-500">{'</div>'}</div>
                            {page.num < pages.length && (
                                <div className="text-red-600/50 text-center my-1">
                                    {'<!-- PAGE BREAK -->'}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {fmt === 'Excel' && (
                <div className="rounded border border-slate-700 overflow-auto max-h-[500px]">
                    <div className="bg-slate-800 border-b border-slate-700 px-3 py-1.5 text-xs text-slate-400">
                        Excel renderer creates spacer rows/cols for pixel
                        alignment ·{pages.reduce((s, p) => s + p.els.length, 0)}{' '}
                        data rows → est.{' '}
                        {pages.reduce((s, p) => s + p.els.length, 0) * 3} Excel
                        rows
                    </div>
                    <table className="w-full text-xs font-mono">
                        <thead className="bg-emerald-950/60 sticky top-0">
                            <tr>
                                {[
                                    '#',
                                    'Type',
                                    'Region',
                                    'State',
                                    'Category',
                                    'Sales',
                                    'Profit',
                                ].map((h, i) => (
                                    <th
                                        key={h}
                                        className="text-left px-3 py-1.5 text-emerald-400 border-b border-emerald-900/40 font-normal"
                                    >
                                        {['', 'A', 'B', 'C', 'D', 'E', 'F'][i]}:{' '}
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pages
                                .flatMap((p) => p.els)
                                .slice(0, 50)
                                .map((el, i) => (
                                    <tr
                                        key={el.id}
                                        className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="px-3 py-1 text-slate-700">
                                            {i + 1}
                                        </td>
                                        <td className="px-3 py-1">
                                            <Pill
                                                label={el.type}
                                                type={el.type}
                                            />
                                        </td>
                                        <td className="px-3 py-1 text-violet-400">
                                            {el.ctx?.region ?? ''}
                                        </td>
                                        <td className="px-3 py-1 text-blue-400">
                                            {el.ctx?.state ?? ''}
                                        </td>
                                        <td className="px-3 py-1 text-amber-400">
                                            {el.ctx?.category ?? ''}
                                        </td>
                                        <td className="px-3 py-1 text-right text-emerald-400">
                                            {el.type === 'Detail' &&
                                            el.ctx?.sales
                                                ? `$${f(el.ctx.sales)}`
                                                : el.agg
                                                  ? `$${f(el.agg.sales_sum)}`
                                                  : ''}
                                        </td>
                                        <td
                                            className={`px-3 py-1 text-right ${(el.type === 'Detail' ? (el.ctx?.profit ?? 0) : (el.agg?.profit_sum ?? 0)) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                                        >
                                            {el.type === 'Detail' &&
                                            el.ctx?.profit != null
                                                ? `$${f(el.ctx.profit)}`
                                                : el.agg
                                                  ? `$${f(el.agg.profit_sum)}`
                                                  : ''}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

const STAGES = [
    { id: 'raw', label: 'Raw Dataset', desc: 'SqlDataSource output' },
    { id: 'cube', label: 'Cube Builder', desc: 'OLAP hierarchy' },
    { id: 'tree', label: 'Processing Tree', desc: 'Expanded nodes' },
    { id: 'layout', label: 'Layout Engine', desc: 'Measure + Arrange' },
    { id: 'paging', label: 'Paging Tree', desc: 'Page breaks' },
    { id: 'render', label: 'Renderer', desc: 'PDF / HTML / Excel' },
];

export default function AppV2() {
    const [stage, setStage] = useState('raw');

    const cube = useMemo(() => buildCube(RAW_DATA), []);
    const ptRaw = useMemo(() => buildPT(cube), [cube]);
    const ptLayout = useMemo(() => {
        const t = buildPT(cube);
        runLayout(t);
        return t;
    }, [cube]);
    const pages = useMemo(() => buildPages(ptLayout), [ptLayout]);

    const pt = ['layout', 'paging', 'render'].includes(stage)
        ? ptLayout
        : ptRaw;
    const cubeN = useMemo(() => countN(cube), [cube]);
    const ptN = useMemo(() => countN(pt), [pt]);

    return (
        <div
            className="min-h-screen bg-slate-950 text-slate-100"
            style={{
                fontFamily:
                    "ui-monospace,'Cascadia Code','Fira Code',monospace",
            }}
        >
            {/* Header */}
            <div className="border-b border-slate-800 px-6 py-4 flex items-center gap-6">
                <div>
                    <div className="text-sm font-bold text-white">
                        Telerik Report Engine
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                        Processing Pipeline · {RAW_DATA.length} rows · Region →
                        State → Category
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-4 text-xs text-slate-500">
                    <span>
                        Cube <span className="text-slate-300">{cubeN}</span>
                    </span>
                    <span>·</span>
                    <span>
                        Proc nodes <span className="text-slate-300">{ptN}</span>
                    </span>
                    <span>·</span>
                    <span>
                        Pages{' '}
                        <span className="text-slate-300">{pages.length}</span>
                    </span>
                    <span>·</span>
                    <span>
                        RAM est.{' '}
                        <span className="text-slate-300">
                            {((ptN * 2048) / 1024).toFixed(0)} KB
                        </span>
                    </span>
                </div>
            </div>

            {/* Pipeline + Tabs */}
            <div className="border-b border-slate-800 px-6">
                <div className="flex gap-0">
                    {STAGES.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => setStage(s.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-xs border-b-2 transition-all ${stage === s.id ? 'border-white text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        >
                            <span className="text-slate-600">{i}</span>
                            <span>{s.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Stage subtitle */}
            <div className="px-6 py-3 border-b border-slate-800/50 flex items-center gap-2 text-xs text-slate-600">
                {STAGES.map((s, i) => (
                    <span key={s.id} className="flex items-center gap-2">
                        <span
                            className={stage === s.id ? 'text-slate-300' : ''}
                        >
                            {stage === s.id && (
                                <span className="text-white mr-1">
                                    {s.label}:
                                </span>
                            )}
                            {stage === s.id && s.desc}
                            {stage !== s.id && s.label}
                        </span>
                        {i < STAGES.length - 1 && (
                            <span className="text-slate-800">→</span>
                        )}
                    </span>
                ))}
            </div>

            {/* Content */}
            <div className="px-6 py-5 max-w-5xl">
                {stage === 'raw' && <Stage0 />}
                {stage === 'cube' && <Stage1 cube={cube} />}
                {stage === 'tree' && <Stage2 pt={ptRaw} />}
                {stage === 'layout' && <Stage3 pt={ptLayout} />}
                {stage === 'paging' && <Stage4 pages={pages} />}
                {stage === 'render' && <Stage5 pages={pages} />}
            </div>
        </div>
    );
}
