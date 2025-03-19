import React from 'react';

const CompareView = ({ items, onRemoveItem }) => {
  if (!items || items.length === 0) {
    return (
      <div className="compare-empty">
        <h2>Compare PC Cases</h2>
        <p>Add PC cases to compare them side by side.</p>
      </div>
    );
  }

  // Define the specifications that we want to compare
  const specsToCompare = [
    { key: 'formFactor', label: 'Form Factor' },
    { key: 'color', label: 'Color' },
    { key: 'with_psu', label: 'Includes Power Supply', transform: val => val ? 'Yes' : 'No' },
    { key: 'case_material', label: 'Material' },
    { key: 'max_gpu_length', label: 'Max GPU Length (mm)' },
    { key: 'max_cpu_cooler_height', label: 'Max CPU Cooler Height (mm)' },
    { key: 'dimensions', label: 'Dimensions' },
    { key: 'front_ports', label: 'Front Ports' },
    { key: 'internal_3_5_bays', label: '3.5" Bays', accessor: item => item.bigDriveBays || (item.v2Fields?.internal_3_5_bays || 'N/A') },
    { key: 'internal_2_5_bays', label: '2.5" Bays', accessor: item => item.smallDriveBays || (item.v2Fields?.internal_2_5_bays || 'N/A') },
    { key: 'xs_drive_bays', label: 'Extra Drive Bays' },
    { key: 'expansion_slots', label: 'Expansion Slots', accessor: item => item.v2Fields?.expansion_slots || 'N/A' },
    { key: 'weight', label: 'Weight', accessor: item => {
      // Try to get the weight from various sources
      if (item.weight) return `${item.weight} ${item.weight_unit || 'kg'}`;
      if (item.amzn_weight) return `${item.amzn_weight} ${item.amzn_weight_unit || 'kg'}`;
      return 'N/A';
    }},
  ];

  // Function to get the value for a spec
  const getSpecValue = (item, spec) => {
    if (spec.accessor) {
      return spec.accessor(item);
    }
    
    if (spec.transform) {
      return spec.transform(item[spec.key]);
    }
    
    return item[spec.key] || 'N/A';
  };

  // Function to get a price string
  const getPriceString = (item) => {
    if (item.price) return `$${item.price.toFixed(2)}`;
    if (item.amazonUSPrice) return `$${item.amazonUSPrice.toFixed(2)}`;
    
    const lowestPrices = item.v2_lowest_prices;
    if (lowestPrices?.US) return `$${lowestPrices.US.toFixed(2)}`;
    
    return '$0.00';
  };

  return (
    <div className="compare-container">
      <h2>Compare PC Cases</h2>
      <div className="compare-grid">
        <div className="compare-row compare-header">
          <div className="compare-cell spec-label">Specification</div>
          {items.map((item) => (
            <div key={item.buildcores_id} className="compare-cell">
              <div className="item-header">
                <button 
                  className="remove-button" 
                  onClick={() => onRemoveItem(item.buildcores_id)}
                  aria-label={`Remove ${item.name} from comparison`}
                >
                  ✕
                </button>
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="compare-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                  }}
                />
                <h3>{item.name}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell spec-label">Brand</div>
          {items.map((item) => (
            <div key={item.buildcores_id} className="compare-cell">
              {item.partBrand || 'N/A'}
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell spec-label">Price</div>
          {items.map((item) => (
            <div key={item.buildcores_id} className="compare-cell">
              {getPriceString(item)}
            </div>
          ))}
        </div>

        {specsToCompare.map((spec) => (
          <div key={spec.key} className="compare-row">
            <div className="compare-cell spec-label">{spec.label}</div>
            {items.map((item) => (
              <div key={item.buildcores_id} className="compare-cell">
                {getSpecValue(item, spec)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompareView; 