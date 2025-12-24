const SlotLegend = () => {
  const legendItems = [
    { color: 'bg-primary/10 border border-primary text-primary', label: 'Available' },
    { color: 'bg-primary text-primary-foreground', label: 'Selected' },
    { color: 'bg-gray-400 text-white', label: 'Occupied' },
    { color: 'bg-gray-200 text-gray-500', label: 'Blocked' },
  ];

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <h3 className="font-semibold text-foreground mb-3">Legend</h3>
      <div className="grid grid-cols-2 gap-3">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded ${item.color} flex items-center justify-center text-xs font-semibold`}>
              A1
            </div>
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotLegend;