/** @format */

import { useState, useEffect } from 'react';

const RAW_DATA = [
    {
        order_id: 'CA-2016-152156',
        region: 'South',
        state: 'Kentucky',
        category: 'Furniture',
        sub_category: 'Bookcases',
        sales: 261.96,
        profit: -9.13,
    },
    {
        order_id: 'CA-2016-152156',
        region: 'South',
        state: 'Kentucky',
        category: 'Furniture',
        sub_category: 'Chairs',
        sales: 731.94,
        profit: 219.58,
    },
    {
        order_id: 'CA-2016-138688',
        region: 'West',
        state: 'California',
        category: 'Office Supplies',
        sub_category: 'Labels',
        sales: 14.62,
        profit: 6.87,
    },
    {
        order_id: 'US-2015-108966',
        region: 'West',
        state: 'California',
        category: 'Furniture',
        sub_category: 'Tables',
        sales: 957.58,
        profit: -306.0,
    },
    {
        order_id: 'US-2015-108966',
        region: 'West',
        state: 'California',
        category: 'Office Supplies',
        sub_category: 'Storage',
        sales: 22.37,
        profit: 2.52,
    },
    {
        order_id: 'CA-2014-115812',
        region: 'West',
        state: 'California',
        category: 'Furniture',
        sub_category: 'Furnishings',
        sales: 48.86,
        profit: 14.17,
    },
    {
        order_id: 'CA-2014-115812',
        region: 'South',
        state: 'Florida',
        category: 'Office Supplies',
        sub_category: 'Art',
        sales: 7.28,
        profit: 1.97,
    },
    {
        order_id: 'CA-2016-152156',
        region: 'South',
        state: 'Kentucky',
        category: 'Technology',
        sub_category: 'Phones',
        sales: 907.15,
        profit: 90.72,
    },
    {
        order_id: 'CA-2014-115812',
        region: 'West',
        state: 'California',
        category: 'Technology',
        sub_category: 'Accessories',
        sales: 114.9,
        profit: 34.47,
    },
    {
        order_id: 'US-2015-108966',
        region: 'South',
        state: 'Florida',
        category: 'Technology',
        sub_category: 'Machines',
        sales: 288.0,
        profit: -5.76,
    },
];

const STAGES = ['raw', 'cube', 'tree', 'render'];

const STAGE_LABELS = {
    raw: 'Stage 0 — Raw Dataset',
    cube: 'Stage 1 — Build OLAP Cube',
    tree: 'Stage 2 — Processing Tree',
    render: 'Stage 3 — Rendered Output',
};

const fmt = (n) =>
    n?.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

// Build the cube from raw data
function buildCube(data) {
    const cube = {};
    for (const row of data) {
        const r = row.region;
        const s = row.state;
        const c = row.category;
        if (!cube[r]) cube[r] = { sales: 0, profit: 0, states: {} };
        cube[r].sales += row.sales;
        cube[r].profit += row.profit;
        if (!cube[r].states[s])
            cube[r].states[s] = { sales: 0, profit: 0, categories: {} };
        cube[r].states[s].sales += row.sales;
        cube[r].states[s].profit += row.profit;
        if (!cube[r].states[s].categories[c])
            cube[r].states[s].categories[c] = { sales: 0, profit: 0, rows: [] };
        cube[r].states[s].categories[c].sales += row.sales;
        cube[r].states[s].categories[c].profit += row.profit;
        cube[r].states[s].categories[c].rows.push(row);
    }
    // root totals
    const root = { sales: 0, profit: 0 };
    for (const row of data) {
        root.sales += row.sales;
        root.profit += row.profit;
    }
    return { root, regions: cube };
}

function RawTable() {
    return (
        <div className="overflow-auto">
            <p className="text-xs text-slate-400 mb-3 font-mono">
                SELECT region, state, category, sub_category, sales, profit FROM
                orders —{' '}
                <span className="text-emerald-400">10 rows returned</span>
            </p>
            <table className="w-full text-xs font-mono border-collapse">
                <thead>
                    <tr className="border-b border-slate-600">
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
                                className="text-left px-2 py-1.5 text-slate-400 whitespace-nowrap"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {RAW_DATA.map((r, i) => (
                        <tr
                            key={i}
                            className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                        >
                            <td className="px-2 py-1 text-slate-500">
                                {i + 1}
                            </td>
                            <td className="px-2 py-1 text-purple-300">
                                {r.region}
                            </td>
                            <td className="px-2 py-1 text-blue-300">
                                {r.state}
                            </td>
                            <td className="px-2 py-1 text-yellow-300">
                                {r.category}
                            </td>
                            <td className="px-2 py-1 text-slate-300">
                                {r.sub_category}
                            </td>
                            <td className="px-2 py-1 text-emerald-400 text-right">
                                {fmt(r.sales)}
                            </td>
                            <td
                                className={`px-2 py-1 text-right ${r.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                            >
                                {fmt(r.profit)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 p-3 bg-slate-700/40 rounded-lg border border-slate-600 text-xs text-slate-400">
                <span className="text-yellow-300 font-semibold">Lưu ý:</span>{' '}
                Đây là flat table — không có hierarchy, không có aggregate.
                Telerik nhận đúng cái này và bắt đầu xử lý.
            </div>
        </div>
    );
}

function CubeView() {
    const cube = buildCube(RAW_DATA);
    const [expanded, setExpanded] = useState({ South: true, West: true });
    const [expandedState, setExpandedState] = useState({});

    const toggle = (key) => setExpanded((p) => ({ ...p, [key]: !p[key] }));
    const toggleState = (key) =>
        setExpandedState((p) => ({ ...p, [key]: !p[key] }));

    return (
        <div>
            <p className="text-xs text-slate-400 mb-3 font-mono">
                Engine quét 10 rows → phân loại theo{' '}
                <span className="text-purple-300">Region</span> →{' '}
                <span className="text-blue-300">State</span> →{' '}
                <span className="text-yellow-300">Category</span> → cache
                measures
            </p>

            {/* Root node */}
            <div className="mb-3 p-3 bg-slate-600/50 border border-slate-500 rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs font-mono">
                        ROOT
                    </span>
                    <span className="text-white font-bold text-sm">
                        [ ALL ]
                    </span>
                    <span className="ml-auto text-xs font-mono">
                        <span className="text-emerald-400">
                            Sales={fmt(cube.root.sales)}
                        </span>
                        <span className="mx-2 text-slate-500">|</span>
                        <span
                            className={
                                cube.root.profit >= 0
                                    ? 'text-emerald-400'
                                    : 'text-red-400'
                            }
                        >
                            Profit={fmt(cube.root.profit)}
                        </span>
                        <span className="ml-2 text-slate-400">
                            ← Grand Total cached
                        </span>
                    </span>
                </div>
            </div>

            {/* Region nodes */}
            {Object.entries(cube.regions).map(([region, rData]) => (
                <div key={region} className="mb-2 ml-4">
                    <div
                        className="flex items-center gap-2 p-2 bg-purple-900/40 border border-purple-700/50 rounded-lg cursor-pointer hover:bg-purple-900/60 transition-colors"
                        onClick={() => toggle(region)}
                    >
                        <span className="text-purple-400 text-xs">
                            {expanded[region] ? '▼' : '▶'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            REGION_GROUP
                        </span>
                        <span className="text-purple-300 font-semibold">
                            {region}
                        </span>
                        <span className="ml-auto text-xs font-mono">
                            <span className="text-emerald-400">
                                Sales={fmt(rData.sales)}
                            </span>
                            <span className="mx-2 text-slate-500">|</span>
                            <span
                                className={
                                    rData.profit >= 0
                                        ? 'text-emerald-400'
                                        : 'text-red-400'
                                }
                            >
                                Profit={fmt(rData.profit)}
                            </span>
                            <span className="ml-2 text-slate-500">
                                ← cached
                            </span>
                        </span>
                    </div>

                    {expanded[region] &&
                        Object.entries(rData.states).map(([state, sData]) => (
                            <div key={state} className="mt-1 ml-6">
                                <div
                                    className="flex items-center gap-2 p-2 bg-blue-900/40 border border-blue-700/50 rounded-lg cursor-pointer hover:bg-blue-900/60 transition-colors"
                                    onClick={() =>
                                        toggleState(`${region}-${state}`)
                                    }
                                >
                                    <span className="text-blue-400 text-xs">
                                        {expandedState[`${region}-${state}`]
                                            ? '▼'
                                            : '▶'}
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono">
                                        STATE_GROUP
                                    </span>
                                    <span className="text-blue-300 font-semibold">
                                        {state}
                                    </span>
                                    <span className="ml-auto text-xs font-mono">
                                        <span className="text-emerald-400">
                                            Sales={fmt(sData.sales)}
                                        </span>
                                        <span className="mx-2 text-slate-500">
                                            |
                                        </span>
                                        <span
                                            className={
                                                sData.profit >= 0
                                                    ? 'text-emerald-400'
                                                    : 'text-red-400'
                                            }
                                        >
                                            Profit={fmt(sData.profit)}
                                        </span>
                                        <span className="ml-2 text-slate-500">
                                            ← cached
                                        </span>
                                    </span>
                                </div>

                                {expandedState[`${region}-${state}`] &&
                                    Object.entries(sData.categories).map(
                                        ([cat, cData]) => (
                                            <div
                                                key={cat}
                                                className="mt-1 ml-6"
                                            >
                                                <div className="flex items-center gap-2 p-2 bg-yellow-900/30 border border-yellow-700/40 rounded-lg">
                                                    <span className="text-xs text-slate-400 font-mono">
                                                        CATEGORY_GROUP
                                                    </span>
                                                    <span className="text-yellow-300 font-semibold">
                                                        {cat}
                                                    </span>
                                                    <span className="ml-auto text-xs font-mono">
                                                        <span className="text-emerald-400">
                                                            Sales=
                                                            {fmt(cData.sales)}
                                                        </span>
                                                        <span className="mx-2 text-slate-500">
                                                            |
                                                        </span>
                                                        <span
                                                            className={
                                                                cData.profit >=
                                                                0
                                                                    ? 'text-emerald-400'
                                                                    : 'text-red-400'
                                                            }
                                                        >
                                                            Profit=
                                                            {fmt(cData.profit)}
                                                        </span>
                                                    </span>
                                                </div>
                                                {cData.rows.map((row, i) => (
                                                    <div
                                                        key={i}
                                                        className="ml-6 mt-0.5 flex items-center gap-2 p-1.5 bg-slate-700/30 border border-slate-600/30 rounded text-xs font-mono"
                                                    >
                                                        <span className="text-slate-500">
                                                            DETAIL_ROW
                                                        </span>
                                                        <span className="text-slate-300">
                                                            {row.sub_category}
                                                        </span>
                                                        <span className="ml-auto text-emerald-400">
                                                            {fmt(row.sales)}
                                                        </span>
                                                        <span
                                                            className={
                                                                row.profit >= 0
                                                                    ? 'text-emerald-400'
                                                                    : 'text-red-400'
                                                            }
                                                        >
                                                            {fmt(row.profit)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ),
                                    )}
                            </div>
                        ))}
                </div>
            ))}

            <div className="mt-4 p-3 bg-slate-700/40 rounded-lg border border-slate-600 text-xs text-slate-400">
                <span className="text-yellow-300 font-semibold">
                    Key insight:
                </span>{' '}
                Measures được{' '}
                <span className="text-emerald-400">cache tại mỗi node</span> —
                khi render group footer, Telerik lấy từ cache, không scan lại
                dataset. Click vào các node để expand.
            </div>
        </div>
    );
}

function TreeView() {
    const cube = buildCube(RAW_DATA);
    const [step, setStep] = useState(0);

    const nodes = [];
    nodes.push({
        indent: 0,
        type: 'REPORT_HEADER',
        label: 'Report Header',
        value: '"Sales Performance Report"',
        color: 'text-slate-300',
        bg: 'bg-slate-600/40 border-slate-500',
    });
    Object.entries(cube.regions).forEach(([region, rData]) => {
        nodes.push({
            indent: 1,
            type: 'GROUP_HEADER',
            label: `GroupHeader [${region}]`,
            value: `Region="${region}" | Sales=${fmt(rData.sales)}`,
            color: 'text-purple-300',
            bg: 'bg-purple-900/30 border-purple-700/40',
        });
        Object.entries(rData.states).forEach(([state, sData]) => {
            nodes.push({
                indent: 2,
                type: 'GROUP_HEADER',
                label: `GroupHeader [${state}]`,
                value: `State="${state}" | Sales=${fmt(sData.sales)}`,
                color: 'text-blue-300',
                bg: 'bg-blue-900/30 border-blue-700/40',
            });
            Object.entries(sData.categories).forEach(([cat, cData]) => {
                nodes.push({
                    indent: 3,
                    type: 'GROUP_HEADER',
                    label: `GroupHeader [${cat}]`,
                    value: `Category="${cat}" | Sales=${fmt(cData.sales)}`,
                    color: 'text-yellow-300',
                    bg: 'bg-yellow-900/20 border-yellow-700/30',
                });
                cData.rows.forEach((row) => {
                    nodes.push({
                        indent: 4,
                        type: 'DETAIL',
                        label: 'Detail',
                        value: `${row.sub_category} | ${fmt(row.sales)} | ${fmt(row.profit)}`,
                        color: 'text-slate-300',
                        bg: 'bg-slate-700/20 border-slate-600/30',
                    });
                });
                nodes.push({
                    indent: 3,
                    type: 'GROUP_FOOTER',
                    label: `GroupFooter [${cat}]`,
                    value: `SUM Sales=${fmt(cData.sales)} | SUM Profit=${fmt(cData.profit)}`,
                    color: 'text-yellow-400',
                    bg: 'bg-yellow-900/20 border-yellow-700/30',
                });
            });
            nodes.push({
                indent: 2,
                type: 'GROUP_FOOTER',
                label: `GroupFooter [${state}]`,
                value: `SUM Sales=${fmt(sData.sales)} | SUM Profit=${fmt(sData.profit)}`,
                color: 'text-blue-400',
                bg: 'bg-blue-900/30 border-blue-700/40',
            });
        });
        nodes.push({
            indent: 1,
            type: 'GROUP_FOOTER',
            label: `GroupFooter [${region}]`,
            value: `SUM Sales=${fmt(rData.sales)} | SUM Profit=${fmt(rData.profit)}`,
            color: 'text-purple-400',
            bg: 'bg-purple-900/30 border-purple-700/40',
        });
    });
    nodes.push({
        indent: 0,
        type: 'REPORT_FOOTER',
        label: 'Report Footer',
        value: `GRAND TOTAL Sales=${fmt(cube.root.sales)} | Profit=${fmt(cube.root.profit)}`,
        color: 'text-emerald-300',
        bg: 'bg-emerald-900/30 border-emerald-700/40',
    });

    const visible = step === 0 ? nodes : nodes.slice(0, step);

    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <p className="text-xs text-slate-400 font-mono flex-1">
                    Processing Tree = {nodes.length} nodes | OLAP Cube → resolve
                    expressions → assign positions
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setStep(0)}
                        className="text-xs px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-slate-300 transition-colors"
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStep((s) => Math.max(1, s - 1))}
                        className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
                    >
                        ← Prev
                    </button>
                    <span className="text-xs text-slate-400 font-mono w-16 text-center">
                        {step === 0 ? 'all' : `${step}/${nodes.length}`}
                    </span>
                    <button
                        onClick={() =>
                            setStep((s) =>
                                Math.min(nodes.length, s === 0 ? 1 : s + 1),
                            )
                        }
                        className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
                    >
                        Next →
                    </button>
                </div>
            </div>

            <div className="space-y-0.5 max-h-96 overflow-y-auto pr-1">
                {visible.map((node, i) => (
                    <div
                        key={i}
                        className={`flex items-start gap-2 p-1.5 border rounded text-xs font-mono transition-all ${node.bg}`}
                        style={{ marginLeft: `${node.indent * 24}px` }}
                    >
                        <span className="text-slate-500 w-28 shrink-0">
                            {node.type}
                        </span>
                        <span className={`${node.color} w-44 shrink-0`}>
                            {node.label}
                        </span>
                        <span className="text-slate-400">{node.value}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-3 bg-slate-700/40 rounded-lg border border-slate-600 text-xs text-slate-400">
                <span className="text-yellow-300 font-semibold">Tổng:</span>{' '}
                {nodes.length} processing nodes từ 10 raw rows. Tất cả
                expressions đã được resolve, styles đã được apply. Tree này sống
                trong <span className="text-red-400">RAM suốt lifecycle</span> —
                chưa biết page size, chưa biết page break. Dùng{' '}
                <span className="text-emerald-400">Next →</span> để xem engine
                build từng node một.
            </div>
        </div>
    );
}

function RenderView() {
    const cube = buildCube(RAW_DATA);

    return (
        <div>
            <p className="text-xs text-slate-400 mb-3 font-mono">
                Processing Tree → Rendering Extension → PDF/Excel/HTML | Page
                size applied | Page breaks calculated
            </p>

            <div className="bg-white text-gray-900 rounded-lg p-6 text-sm shadow-xl max-h-[500px] overflow-y-auto">
                {/* Report Header */}
                <div className="border-b-2 border-gray-800 pb-3 mb-4">
                    <h1 className="text-lg font-bold text-center text-gray-800">
                        Sales Performance Report
                    </h1>
                    <p className="text-xs text-center text-gray-500 mt-1">
                        Generated by Telerik Rendering Engine
                    </p>
                </div>

                {Object.entries(cube.regions).map(([region, rData]) => (
                    <div key={region} className="mb-6">
                        {/* Region Group Header */}
                        <div className="bg-purple-100 border-l-4 border-purple-600 px-3 py-2 mb-2">
                            <span className="font-bold text-purple-800 text-sm">
                                Region: {region}
                            </span>
                            <span className="ml-4 text-xs text-purple-600">
                                Total Sales: ${fmt(rData.sales)}
                            </span>
                        </div>

                        {Object.entries(rData.states).map(([state, sData]) => (
                            <div key={state} className="ml-4 mb-3">
                                {/* State Group Header */}
                                <div className="bg-blue-50 border-l-4 border-blue-400 px-3 py-1.5 mb-1">
                                    <span className="font-semibold text-blue-800 text-xs">
                                        State: {state}
                                    </span>
                                    <span className="ml-4 text-xs text-blue-600">
                                        Sales: ${fmt(sData.sales)}
                                    </span>
                                </div>

                                {Object.entries(sData.categories).map(
                                    ([cat, cData]) => (
                                        <div key={cat} className="ml-4 mb-2">
                                            {/* Category Group Header */}
                                            <div className="bg-yellow-50 px-2 py-1 mb-0.5">
                                                <span className="font-medium text-yellow-800 text-xs">
                                                    ▸ {cat}
                                                </span>
                                            </div>

                                            {/* Detail rows */}
                                            <table className="w-full text-xs ml-2">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="text-left py-0.5 text-gray-500">
                                                            Sub-Category
                                                        </th>
                                                        <th className="text-right py-0.5 text-gray-500">
                                                            Sales
                                                        </th>
                                                        <th className="text-right py-0.5 text-gray-500">
                                                            Profit
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cData.rows.map(
                                                        (row, i) => (
                                                            <tr
                                                                key={i}
                                                                className="border-b border-gray-100"
                                                            >
                                                                <td className="py-0.5 text-gray-700">
                                                                    {
                                                                        row.sub_category
                                                                    }
                                                                </td>
                                                                <td className="py-0.5 text-right text-gray-800">
                                                                    $
                                                                    {fmt(
                                                                        row.sales,
                                                                    )}
                                                                </td>
                                                                <td
                                                                    className={`py-0.5 text-right font-medium ${row.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}
                                                                >
                                                                    $
                                                                    {fmt(
                                                                        row.profit,
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>

                                            {/* Category Footer */}
                                            <div className="ml-2 flex justify-end gap-4 text-xs bg-yellow-50 px-2 py-0.5 border-t border-yellow-200">
                                                <span className="text-yellow-700 font-medium">
                                                    {cat} Total:
                                                </span>
                                                <span className="text-gray-700 font-semibold">
                                                    ${fmt(cData.sales)}
                                                </span>
                                                <span
                                                    className={`font-semibold ${cData.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}
                                                >
                                                    ${fmt(cData.profit)}
                                                </span>
                                            </div>
                                        </div>
                                    ),
                                )}

                                {/* State Footer */}
                                <div className="ml-4 flex justify-end gap-4 text-xs bg-blue-50 border border-blue-200 rounded px-3 py-1">
                                    <span className="text-blue-700 font-medium">
                                        {state} Subtotal:
                                    </span>
                                    <span className="font-bold">
                                        ${fmt(sData.sales)}
                                    </span>
                                    <span
                                        className={`font-bold ${sData.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}
                                    >
                                        ${fmt(sData.profit)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Region Footer */}
                        <div className="bg-purple-100 border border-purple-300 rounded px-3 py-1.5 flex justify-end gap-4 text-xs">
                            <span className="text-purple-700 font-bold">
                                {region} Region Total:
                            </span>
                            <span className="font-bold text-purple-800">
                                ${fmt(rData.sales)}
                            </span>
                            <span
                                className={`font-bold ${rData.profit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}
                            >
                                ${fmt(rData.profit)}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Report Footer */}
                <div className="border-t-2 border-gray-800 pt-3 mt-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                            Telerik Rendering Engine — PDF Output
                        </span>
                        <div className="flex gap-6 text-sm font-bold">
                            <span className="text-gray-700">GRAND TOTAL:</span>
                            <span className="text-gray-900">
                                ${fmt(cube.root.sales)}
                            </span>
                            <span
                                className={
                                    cube.root.profit >= 0
                                        ? 'text-emerald-700'
                                        : 'text-red-600'
                                }
                            >
                                ${fmt(cube.root.profit)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-3 bg-slate-700/40 rounded-lg border border-slate-600 text-xs text-slate-400">
                <span className="text-yellow-300 font-semibold">
                    Render stage:
                </span>{' '}
                Processing Tree → pixel positions tính xong → page breaks
                applied → output ra PDF/Excel/HTML. Tất cả subtotals lấy từ{' '}
                <span className="text-emerald-400">OLAP cube cache</span> —
                không tính lại.
            </div>
        </div>
    );
}

export default function App() {
    const [stage, setStage] = useState('raw');
    const [animating, setAnimating] = useState(false);

    const currentIdx = STAGES.indexOf(stage);

    const goTo = (s) => {
        if (s === stage) return;
        setAnimating(true);
        setTimeout(() => {
            setStage(s);
            setAnimating(false);
        }, 150);
    };

    const next = () => {
        if (currentIdx < STAGES.length - 1) goTo(STAGES[currentIdx + 1]);
    };
    const prev = () => {
        if (currentIdx > 0) goTo(STAGES[currentIdx - 1]);
    };

    return (
        <div
            style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
            className="min-h-screen bg-slate-900 text-slate-100 p-4"
        >
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-white tracking-tight">
                        Telerik Report Engine — Processing Pipeline
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">
                        Demo với Superstore dataset thật · 10 rows · Group:
                        Region → State → Category
                    </p>
                </div>

                {/* Stage Navigator */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    {STAGES.map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <button
                                onClick={() => goTo(s)}
                                className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                                    stage === s
                                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/50'
                                        : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                            >
                                {STAGE_LABELS[s]}
                            </button>
                            {i < STAGES.length - 1 && (
                                <span className="text-slate-600 text-sm">
                                    →
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Memory / Stats bar */}
                <div className="flex gap-3 mb-4 text-xs font-mono">
                    {[
                        {
                            label: 'Rows in',
                            value: '10',
                            color: 'text-blue-400',
                        },
                        {
                            label: 'OLAP nodes',
                            value: stage === 'raw' ? '0' : '15',
                            color: 'text-purple-400',
                        },
                        {
                            label: 'Processing nodes',
                            value:
                                stage === 'raw' || stage === 'cube'
                                    ? '0'
                                    : '31',
                            color: 'text-yellow-400',
                        },
                        {
                            label: 'RAM est.',
                            value:
                                stage === 'raw'
                                    ? '~2KB'
                                    : stage === 'cube'
                                      ? '~10KB'
                                      : '~20KB',
                            color: 'text-red-400',
                        },
                    ].map((m) => (
                        <div
                            key={m.label}
                            className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded px-3 py-1.5"
                        >
                            <span className="text-slate-500">{m.label}:</span>
                            <span className={m.color + ' font-bold'}>
                                {m.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div
                    className={`bg-slate-800 border border-slate-700 rounded-xl p-5 transition-opacity duration-150 ${animating ? 'opacity-0' : 'opacity-100'}`}
                >
                    {stage === 'raw' && <RawTable />}
                    {stage === 'cube' && <CubeView />}
                    {stage === 'tree' && <TreeView />}
                    {stage === 'render' && <RenderView />}
                </div>

                {/* Nav buttons */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={prev}
                        disabled={currentIdx === 0}
                        className="px-4 py-2 text-xs font-mono bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-slate-300 transition-colors"
                    >
                        ← Previous Stage
                    </button>
                    <span className="text-xs text-slate-500 font-mono">
                        {currentIdx + 1} / {STAGES.length}
                    </span>
                    <button
                        onClick={next}
                        disabled={currentIdx === STAGES.length - 1}
                        className="px-4 py-2 text-xs font-mono bg-emerald-700 hover:bg-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                    >
                        Next Stage →
                    </button>
                </div>
            </div>
        </div>
    );
}
