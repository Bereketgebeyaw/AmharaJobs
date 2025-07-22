import React, { useState, useEffect } from 'react';

const GEONAMES_USERNAME = 'bereket_gebeyaw';

// Fetch all Amhara cities on mount
const fetchAllAmharaCities = async () => {
  const url = `http://api.geonames.org/searchJSON?country=ET&featureClass=P&maxRows=1000&username=${GEONAMES_USERNAME}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.geonames) return [];
  // Only Amhara region
  const amharaCities = data.geonames.filter(place => place.adminName1 === 'Amhara');
  // Remove duplicates and sort
  const unique = Array.from(new Set(amharaCities.map(place => place.name))).sort();
  return unique;
};

const AmharaLocationAutocomplete = ({ value, onChange }) => {
  const [allCities, setAllCities] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAllAmharaCities().then(cities => {
      setAllCities(cities);
      setLoading(false);
    });
  }, []);

  // Filter suggestions as user types
  useEffect(() => {
    if (!value) {
      setSuggestions(allCities);
    } else {
      setSuggestions(
        allCities.filter(city => city.toLowerCase().includes(value.toLowerCase()))
      );
    }
  }, [value, allCities]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    setShowDropdown(true);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowDropdown(false);
  };

  return (
    <div style={{ position: 'relative', minWidth: '150px' }}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="Location"
        style={{
          minWidth: '150px',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #ddd',
          fontSize: '1rem'
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        autoComplete="off"
      />
      {showDropdown && (
        <div style={{
          position: 'absolute',
          zIndex: 100,
          background: '#fff',
          border: '1.5px solid #4caf50',
          borderRadius: '8px',
          width: '100%',
          marginTop: 2,
          maxHeight: 200,
          overflowY: 'auto',
          boxShadow: '0 4px 16px rgba(44, 62, 80, 0.15)',
          transition: 'box-shadow 0.2s'
        }}>
          {loading ? (
            <div style={{ padding: 10, color: '#888', background: '#fff', fontWeight: 500 }}>Loading...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: 10,
                  cursor: 'pointer',
                  background: suggestion === value ? '#e8f5e9' : '#fff',
                  borderBottom: idx !== suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                  color: '#222',
                  fontWeight: 500
                }}
              >
                {suggestion}
              </div>
            ))
          ) : (
            <div style={{ padding: 10, color: '#888', background: '#fff', fontWeight: 500 }}>No locations found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AmharaLocationAutocomplete; 