import { useState } from "react";

// ─── DATA ───────────────────────────────────────────────
const STEPS = [
  {
    id: 1, label: "Submit Request", color: "#ec4899",
    actor: "User / Blazor UI",
    input: '{ templateId, parameters: { studyBtrId: "BTR-123", siteId: "SITE-001" } }',
    output: "report_requests row (status=Requested) + Pulsar message published",
    detail: "User nhấn Run Report trên UI. BFF insert vào DB và publish Pulsar event. Response ngay lập tức — không đợi.",
  },
  {
    id: 2, label: "Resolve Report Source", color: "#f59e0b",
    actor: "Worker → IReportSourceResolver → Report API",
    input: "requestId (string — Telerik report source key)",
    output: "Telerik.Reporting.Report object (in-memory, never saved)",
    detail: "Resolver gọi Report API GET /internal/report-source/{requestId} → nhận templateFields + parameters → build SQL (JOIN từ ReportingRelationships) → tạo Telerik Report object in code: SqlDataSource + Table + GroupHeader + TextBox bindings.",
    code: `// Resolver builds SQL từ templateFields:
SELECT s.site_name, s.site_country,
       COUNT(p.participant_maestro_id) AS enrollment_count
FROM  vw_report_site s
JOIN  vw_report_participant p 
      ON p.site_maestro_id = s.site_maestro_id
WHERE s.study_btr_id = @studyBtrId
GROUP BY s.site_name, s.site_country`,
  },
  {
    id: 3, label: "ReportProcessor.Process()", color: "#8b5cf6",
    actor: "Worker — Telerik ReportProcessor",
    input: "InstanceReportSource + ReportParameterCollection",
    output: "RenderingResult (rendered ReportDocument in Telerik internal format)",
    detail: "Telerik tự execute SqlDataSource → query Vista DB (D) → nhận rows → apply grouping/sorting → render từng section (ReportHeader, GroupHeader, Detail, Footer) → evaluate bindings (=Fields.site_name) → produce ReportDocument.",
    note: "⚡ Đây là bước block lâu nhất — SQL query D có thể mất nhiều phút. OK vì đây là Worker, không phải HTTP request.",
  },
  {
    id: 4, label: "Package → .TRDOC → S3", color: "#10b981",
    actor: "Worker — ReportPackager + IStorage",
    input: "RenderingResult từ Step 3",
    output: ".TRDOC binary stream → uploaded S3",
    detail: "ReportPackager.Package(renderingResult, stream) → serialize toàn bộ rendered document thành binary. .TRDOC là RENDERED document — không phải design file. Data đã bound xong, không cần DB nữa.",
    note: "📦 .TRDOC ≈ PDF nhưng interactive. Data query đã chạy xong. Viewer sau này không cần DB.",
  },
  {
    id: 5, label: "Viewer fetches .TRDOC", color: "#3b82f6",
    actor: "Blazor Viewer → Report Engine API",
    input: "reportId (S3 key = requestId)",
    output: "Interactive report in browser — pages served on demand",
    detail: "Viewer POST /api/reports/clients/{clientId}/instances → Engine lấy .TRDOC từ S3 → deserialize → ReportDocument in memory → trả instanceId. Viewer GET /pages/{n} → Engine extract page → trả JSON/image. KHÔNG query DB tại bước này.",
    note: "🚀 Engine API phải fast. Không có DB query. Chỉ serve từ .TRDOC đã render.",
  },
  {
    id: 6, label: "Export", color: "#f97316",
    actor: "Blazor Viewer → Report Engine API",
    input: "reportId + format (xlsx / pdf / csv)",
    output: "Binary file stream → browser download",
    detail: "Engine lấy .TRDOC từ S3 → ReportProcessor re-render với format-specific renderer: PDF (iTextSharp) / Excel (OpenXML) / CSV. Trả về HTTP response với Content-Disposition: attachment.",
    note: "📄 Vẫn không query DB — data trong .TRDOC rồi.",
  },
];

const NODES = [
  // Row 1
  { id: "ui",      x: 330, y: 30,  w: 160, h: 52, label: "Blazor UI",         sub: "Report Builder + Viewer",   color: "#ec4899", icon: "🖥" },
  // Row 2
  { id: "bff",     x: 330, y: 120, w: 160, h: 52, label: "Report API (BFF)",  sub: "Orchestrates, stores req",   color: "#f59e0b", icon: "⚡" },
  // Row 3
  { id: "pulsar",  x: 130, y: 210, w: 130, h: 52, label: "Pulsar",            sub: "Message queue",              color: "#64748b", icon: "📨" },
  { id: "db_req",  x: 530, y: 210, w: 130, h: 52, label: "report_requests",   sub: "DB — status tracking",       color: "#64748b", icon: "🗃" },
  // Row 4 — Worker
  { id: "worker",  x: 90,  y: 310, w: 640, h: 200, label: "WORKER SERVICE (separate process)", sub: "", color: "#8b5cf6", isGroup: true },
  { id: "resolver",x: 120, y: 350, w: 150, h: 60, label: "IReportSourceResolver", sub: "Calls Report API\nBuilds SQL", color: "#f59e0b", icon: "🔍" },
  { id: "rproc",   x: 320, y: 350, w: 150, h: 60, label: "ReportProcessor",   sub: "Executes + renders",         color: "#8b5cf6", icon: "⚙" },
  { id: "pack",    x: 520, y: 350, w: 130, h: 60, label: "ReportPackager",    sub: "→ .TRDOC",                   color: "#10b981", icon: "📦" },
  { id: "d_db",    x: 220, y: 440, w: 130, h: 52, label: "Vista DB (D)",      sub: "Big data, query here",       color: "#10b981", icon: "⚡" },
  // Row 5 — S3
  { id: "s3",      x: 330, y: 540, w: 160, h: 52, label: "S3 Storage",        sub: ".TRDOC files — TTL policy",  color: "#f97316", icon: "☁" },
  // Row 6 — Engine API
  { id: "engine",  x: 90,  y: 630, w: 640, h: 140, label: "REPORT ENGINE API — Telerik REST Service (separate process)", sub: "", color: "#3b82f6", isGroup: true },
  { id: "trdoc_r", x: 150, y: 668, w: 130, h: 52, label: "IStorage.GetAsync", sub: "Fetch .TRDOC from S3",      color: "#3b82f6", icon: "📥" },
  { id: "deser",   x: 330, y: 668, w: 150, h: 52, label: "Deserialize .TRDOC",sub: "ReportDocument in memory",  color: "#3b82f6", icon: "🔄" },
  { id: "export",  x: 530, y: 668, w: 140, h: 52, label: "PDF/Excel/CSV",     sub: "Format renderers",          color: "#f97316", icon: "📄" },
  // Row 7 — Viewer
  { id: "viewer",  x: 330, y: 800, w: 160, h: 52, label: "Telerik Viewer",    sub: "Blazor component",          color: "#ec4899", icon: "👁" },
];

const CONNS = [
  { f: "ui",       t: "bff",     label: "POST /reports/run",        color: "#ec4899" },
  { f: "bff",      t: "pulsar",  label: "publish message",          color: "#64748b" },
  { f: "bff",      t: "db_req",  label: "insert status=Requested",  color: "#64748b" },
  { f: "pulsar",   t: "resolver",label: "consume message",          color: "#64748b" },
  { f: "resolver", t: "bff",     label: "GET /internal/report-source", color: "#f59e0b", dashed: true },
  { f: "resolver", t: "rproc",   label: "InstanceReportSource",     color: "#8b5cf6" },
  { f: "rproc",    t: "d_db",    label: "SqlDataSource executes",   color: "#10b981" },
  { f: "d_db",     t: "rproc",   label: "DataTable result",         color: "#10b981" },
  { f: "rproc",    t: "pack",    label: "RenderingResult",          color: "#8b5cf6" },
  { f: "pack",     t: "s3",      label: "StoreAsync → .TRDOC",      color: "#10b981" },
  { f: "s3",       t: "trdoc_r", label: "GetAsync → .TRDOC",        color: "#3b82f6" },
  { f: "trdoc_r",  t: "deser",   label: "stream",                   color: "#3b82f6" },
  { f: "deser",    t: "export",  label: "ReportDocument",           color: "#f97316", dashed: true },
  { f: "deser",    t: "viewer",  label: "pages (JSON/image)",        color: "#ec4899" },
  { f: "viewer",   t: "export",  label: "Export request",           color: "#f97316", dashed: true },
];

function getCenter(id) {
  const n = NODES.find(n => n.id === id);
  if (!n) return { x: 0, y: 0 };
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
}

function Conn({ conn }) {
  const f = getCenter(conn.f);
  const t = getCenter(conn.t);
  const mx = (f.x + t.x) / 2;
  const my = (f.y + t.y) / 2;
  const dx = t.x - f.x, dy = t.y - f.y;
  const len = Math.sqrt(dx*dx + dy*dy);
  const ux = dx/len, uy = dy/len;
  const ah = 7;
  const ax1 = t.x - ah*(ux - 0.35*uy);
  const ay1 = t.y - ah*(uy + 0.35*ux);
  const ax2 = t.x - ah*(ux + 0.35*uy);
  const ay2 = t.y - ah*(uy - 0.35*ux);

  return (
    <g>
      <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
        stroke={conn.color} strokeWidth={1.5} opacity={0.6}
        strokeDasharray={conn.dashed ? "5 3" : undefined} />
      <polygon points={`${t.x},${t.y} ${ax1},${ay1} ${ax2},${ay2}`}
        fill={conn.color} opacity={0.7} />
      {conn.label && (
        <g>
          <rect x={mx - conn.label.length*2.9} y={my-8} width={conn.label.length*5.8} height={13}
            fill="#07090f" rx={3} opacity={0.9} />
          <text x={mx} y={my+1} textAnchor="middle" fontSize={8.5}
            fill={conn.color} fontFamily="monospace">{conn.label}</text>
        </g>
      )}
    </g>
  );
}

function Node({ node, active, onClick }) {
  if (node.isGroup) {
    return (
      <g>
        <rect x={node.x} y={node.y} width={node.w} height={node.h}
          rx={12} fill={node.color+"08"} stroke={node.color+"44"} strokeWidth={1.5}
          strokeDasharray="6 3" />
        <rect x={node.x} y={node.y} width={200} height={18} rx={4} fill={node.color+"22"} />
        <text x={node.x+8} y={node.y+13} fontSize={9} fill={node.color}
          fontFamily="monospace" fontWeight="bold">{node.label}</text>
      </g>
    );
  }
  const isActive = active === node.id;
  return (
    <g onClick={() => onClick(node.id)} style={{ cursor: "pointer" }}>
      {isActive && <rect x={node.x-4} y={node.y-4} width={node.w+8} height={node.h+8}
        rx={10} fill={node.color} opacity={0.12} />}
      <rect x={node.x} y={node.y} width={node.w} height={node.h}
        rx={7} fill="#0d1117" stroke={isActive ? node.color : node.color+"55"}
        strokeWidth={isActive ? 2 : 1} />
      <rect x={node.x} y={node.y} width={node.w} height={3} rx={7} fill={node.color} opacity={0.8} />
      <text x={node.x+22} y={node.y+node.h/2-4} fontSize={10} fill="white"
        fontFamily="monospace" fontWeight="bold">{node.label}</text>
      {node.sub && node.sub.split("\n").map((l,i) => (
        <text key={i} x={node.x+22} y={node.y+node.h/2+8+i*10}
          fontSize={8} fill={node.color} opacity={0.75} fontFamily="monospace">{l}</text>
      ))}
      <text x={node.x+12} y={node.y+node.h/2+5} fontSize={14} textAnchor="middle">{node.icon}</text>
    </g>
  );
}

// Step badge overlay numbers
const STEP_BADGES = [
  { x: 318, y: 28,  n: "①", color: "#ec4899" },
  { x: 318, y: 118, n: "①", color: "#ec4899" },
  { x: 108, y: 308, n: "②③④", color: "#8b5cf6" },
  { x: 318, y: 538, n: "④", color: "#10b981" },
  { x: 108, y: 628, n: "⑤⑥", color: "#3b82f6" },
  { x: 318, y: 798, n: "⑤", color: "#ec4899" },
];

export default function App() {
  const [active, setActive] = useState(null);
  const [activeStep, setActiveStep] = useState(null);

  const activeNode = NODES.find(n => n.id === active);

  return (
    <div style={{ minHeight: "100vh", background: "#060810", fontFamily: "'Courier New', monospace", display: "flex", flexDirection: "column", alignItems: "center", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 9, color: "#3b82f6", letterSpacing: 6, textTransform: "uppercase", marginBottom: 4 }}>Full Architecture — 6 Steps</div>
        <h1 style={{ fontSize: 20, color: "white", margin: 0, fontWeight: 700 }}>
          Pulsar → Worker → S3 → Engine API → Viewer
        </h1>
        <p style={{ fontSize: 11, color: "#4b5563", marginTop: 4 }}>Worker và Engine API là 2 process riêng biệt · Click node hoặc step để xem chi tiết</p>
      </div>

      <div style={{ display: "flex", gap: 20, width: "100%", maxWidth: 1100, alignItems: "flex-start" }}>
        {/* DIAGRAM */}
        <div style={{ flex: 1, background: "linear-gradient(135deg,#0a0f1a,#060810)", border: "1px solid #1e293b", borderRadius: 16, overflow: "hidden" }}>
          <svg width="100%" viewBox="0 0 820 880" style={{ display: "block" }}>
            <defs>
              <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0L0 0 0 40" fill="none" stroke="#0f172a" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="820" height="880" fill="url(#g)" />

            {/* Render groups first (behind) */}
            {NODES.filter(n => n.isGroup).map(n => <Node key={n.id} node={n} active={active} onClick={setActive} />)}
            {/* Connections */}
            {CONNS.map((c,i) => <Conn key={i} conn={c} />)}
            {/* Regular nodes */}
            {NODES.filter(n => !n.isGroup).map(n => <Node key={n.id} node={n} active={active} onClick={setActive} />)}

            {/* Step number badges */}
            {[
              { x: 405, y: 56, steps: [1], color: "#ec4899" },
              { x: 405, y: 146, steps: [1,2], color: "#f59e0b" },
              { x: 195, y: 236, steps: [1], color: "#64748b" },
              { x: 595, y: 236, steps: [1], color: "#64748b" },
              { x: 175, y: 376, steps: [2], color: "#f59e0b" },
              { x: 395, y: 376, steps: [3], color: "#8b5cf6" },
              { x: 585, y: 376, steps: [4], color: "#10b981" },
              { x: 285, y: 466, steps: [3], color: "#10b981" },
              { x: 405, y: 566, steps: [4], color: "#10b981" },
              { x: 215, y: 694, steps: [5], color: "#3b82f6" },
              { x: 405, y: 694, steps: [5], color: "#3b82f6" },
              { x: 600, y: 694, steps: [6], color: "#f97316" },
              { x: 405, y: 826, steps: [5], color: "#ec4899" },
            ].map((badge, i) => badge.steps.map(s => (
              <g key={`${i}-${s}`}>
                <circle cx={badge.x + 10} cy={badge.y - 6} r={9} fill={badge.color} opacity={0.9} />
                <text x={badge.x + 10} y={badge.y - 2} textAnchor="middle"
                  fontSize={9} fill="black" fontFamily="monospace" fontWeight="bold">{s}</text>
              </g>
            )))}

            {/* Two-process label */}
            <g>
              <rect x={715} y={308} width={88} height={140} rx={6} fill="#8b5cf611" stroke="#8b5cf633" strokeWidth={1}/>
              <text x={759} y={328} textAnchor="middle" fontSize={8} fill="#8b5cf6" fontFamily="monospace">PROCESS</text>
              <text x={759} y={340} textAnchor="middle" fontSize={8} fill="#8b5cf6" fontFamily="monospace">A</text>
              <text x={759} y={360} textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="monospace">Worker</text>
              <text x={759} y={372} textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="monospace">heavy CPU</text>
              <text x={759} y={384} textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="monospace">scale by</text>
              <text x={759} y={396} textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="monospace">queue depth</text>
              <text x={759} y={416} textAnchor="middle" fontSize={7} fill="#8b5cf644" fontFamily="monospace">≠</text>
              <rect x={715} y={628} width={88} height={140} rx={6} fill="#3b82f611" stroke="#3b82f633" strokeWidth={1}/>
              <text x={759} y={648} textAnchor="middle" fontSize={8} fill="#3b82f6" fontFamily="monospace">PROCESS</text>
              <text x={759} y={660} textAnchor="middle" fontSize={8} fill="#3b82f6" fontFamily="monospace">B</text>
              <text x={759} y={680} textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="monospace">Engine API</text>
              <text x={759} y={692} textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="monospace">must be fast</text>
              <text x={759} y={704} textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="monospace">scale by</text>
              <text x={759} y={716} textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="monospace">viewer count</text>
            </g>
          </svg>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Steps */}
          <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 9, color: "#4b5563", letterSpacing: 3, marginBottom: 10 }}>6 STEPS</div>
            {STEPS.map(step => (
              <div key={step.id} onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                style={{ cursor: "pointer", marginBottom: 8, padding: "6px 8px", borderRadius: 6,
                  background: activeStep === step.id ? step.color + "15" : "transparent",
                  border: `1px solid ${activeStep === step.id ? step.color + "44" : "transparent"}`,
                  transition: "all 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: step.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, color: "black", fontWeight: "bold", flexShrink: 0 }}>{step.id}</span>
                  <span style={{ fontSize: 10, color: activeStep === step.id ? step.color : "#9ca3af", fontWeight: activeStep === step.id ? "bold" : "normal" }}>
                    {step.label}
                  </span>
                </div>
                {activeStep === step.id && (
                  <div style={{ marginTop: 8, paddingLeft: 24 }}>
                    <div style={{ fontSize: 8.5, color: "#64748b", marginBottom: 4 }}>ACTOR</div>
                    <div style={{ fontSize: 9, color: step.color, marginBottom: 6 }}>{step.actor}</div>
                    <div style={{ fontSize: 8.5, color: "#64748b", marginBottom: 4 }}>DETAIL</div>
                    <div style={{ fontSize: 9, color: "#94a3b8", lineHeight: 1.5, marginBottom: 6 }}>{step.detail}</div>
                    {step.note && <div style={{ fontSize: 9, color: "#4b5563", fontStyle: "italic" }}>{step.note}</div>}
                    {step.code && (
                      <pre style={{ fontSize: 7.5, color: "#86efac", background: "#020408",
                        border: "1px solid #1e293b", borderRadius: 4, padding: 6,
                        overflow: "auto", whiteSpace: "pre", marginTop: 6 }}>{step.code}</pre>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Node detail */}
          {activeNode && !activeNode.isGroup && (
            <div style={{ background: "#0d1117", border: `1px solid ${activeNode.color}44`,
              borderRadius: 12, padding: 14, boxShadow: `0 0 20px ${activeNode.color}11` }}>
              <div style={{ fontSize: 9, color: activeNode.color, letterSpacing: 2, marginBottom: 6 }}>NODE</div>
              <div style={{ fontSize: 12, color: "white", fontWeight: "bold", marginBottom: 4 }}>{activeNode.label}</div>
              <div style={{ fontSize: 10, color: "#64748b" }}>{activeNode.sub}</div>
            </div>
          )}

          {/* Key insight */}
          <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 9, color: "#4b5563", letterSpacing: 3, marginBottom: 8 }}>KEY INSIGHT</div>
            {[
              { icon: "☁", color: "#10b981", text: "S3 = decoupling layer. Worker write, Engine read. Không biết nhau tồn tại." },
              { icon: "🔒", color: "#f59e0b", text: "Viewer không query DB. Data đã bound trong .TRDOC rồi." },
              { icon: "⚡", color: "#8b5cf6", text: "Worker có thể chậm 5-10 phút. Engine API phải < 500ms." },
              { icon: "📊", color: "#3b82f6", text: ".TRDOC ≠ design file. Là rendered document — như PDF nhưng interactive." },
            ].map(item => (
              <div key={item.text} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12 }}>{item.icon}</span>
                <span style={{ fontSize: 9, color: item.color, lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, fontSize: 9, color: "#1e293b", letterSpacing: 4 }}>
        WORKER (Process A) · ENGINE API (Process B) · S3 BRIDGE · TELERIK RENDER
      </div>
    </div>
  );
}
