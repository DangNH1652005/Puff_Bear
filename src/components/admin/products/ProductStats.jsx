export default function ProductStats({ stats }) {
  return (
    <div className="row g-3 mb-4">
      {[
        {
          label: "Tổng sản phẩm",
          value: stats.total ?? "…",
          icon: "🧸",
          color: "blue",
        },
        {
          label: "Đang bán",
          value: stats.active ?? "…",
          icon: "🌸",
          color: "green",
        },
        {
          label: "Sắp hết hàng",
          value: stats.lowStock ?? "…",
          icon: "🌼",
          color: "orange",
        },
        {
          label: "Ngừng bán",
          value: stats.inactive ?? "…",
          icon: "🥀",
          color: "gray",
        },
      ].map((c) => (
        <div className="col-md-3 col-sm-6" key={c.label}>
          <div className={`ap-stat-card ap-stat-${c.color}`}>
            <div>
              <span className="ap-stat-emoji">{c.icon}</span>
              <div className="ap-stat-value">{c.value}</div>
              <div className="ap-stat-label">{c.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
