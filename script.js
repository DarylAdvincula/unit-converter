// Unit definitions. Each category has a base unit (factor 1) and others
// expressed as multipliers relative to that base, except temperature which
// needs custom offset formulas.

const CATEGORIES = {
  length: {
    base: 'meter',
    units: {
      meter:      { label: 'Meters (m)',        factor: 1 },
      kilometer:  { label: 'Kilometers (km)',    factor: 1000 },
      centimeter: { label: 'Centimeters (cm)',   factor: 0.01 },
      millimeter: { label: 'Millimeters (mm)',   factor: 0.001 },
      mile:       { label: 'Miles (mi)',         factor: 1609.344 },
      yard:       { label: 'Yards (yd)',         factor: 0.9144 },
      foot:       { label: 'Feet (ft)',          factor: 0.3048 },
      inch:       { label: 'Inches (in)',        factor: 0.0254 },
      nauticalMile:{ label: 'Nautical miles (nmi)', factor: 1852 }
    },
    defaultFrom: 'meter',
    defaultTo: 'foot'
  },
  weight: {
    base: 'kilogram',
    units: {
      kilogram: { label: 'Kilograms (kg)', factor: 1 },
      gram:     { label: 'Grams (g)',      factor: 0.001 },
      milligram:{ label: 'Milligrams (mg)',factor: 0.000001 },
      tonne:    { label: 'Metric tons (t)',factor: 1000 },
      pound:    { label: 'Pounds (lb)',    factor: 0.45359237 },
      ounce:    { label: 'Ounces (oz)',    factor: 0.0283495231 },
      stone:    { label: 'Stone (st)',     factor: 6.35029318 }
    },
    defaultFrom: 'kilogram',
    defaultTo: 'pound'
  },
  temperature: {
    base: 'celsius',
    units: {
      celsius:    { label: 'Celsius (°C)' },
      fahrenheit: { label: 'Fahrenheit (°F)' },
      kelvin:     { label: 'Kelvin (K)' }
    },
    defaultFrom: 'celsius',
    defaultTo: 'fahrenheit'
  },
  volume: {
    base: 'liter',
    units: {
      liter:       { label: 'Liters (L)',          factor: 1 },
      milliliter:  { label: 'Milliliters (mL)',    factor: 0.001 },
      cubicMeter:  { label: 'Cubic meters (m³)',   factor: 1000 },
      gallonUS:    { label: 'Gallons, US (gal)',   factor: 3.785411784 },
      quartUS:     { label: 'Quarts, US (qt)',     factor: 0.946352946 },
      pintUS:      { label: 'Pints, US (pt)',      factor: 0.473176473 },
      cupUS:       { label: 'Cups, US',            factor: 0.2365882365 },
      fluidOunceUS:{ label: 'Fluid ounces, US (fl oz)', factor: 0.0295735296 },
      tablespoon:  { label: 'Tablespoons (tbsp)',  factor: 0.0147867648 },
      teaspoon:    { label: 'Teaspoons (tsp)',     factor: 0.0049289216 }
    },
    defaultFrom: 'liter',
    defaultTo: 'gallonUS'
  },
  area: {
    base: 'squareMeter',
    units: {
      squareMeter:     { label: 'Square meters (m²)',     factor: 1 },
      squareKilometer: { label: 'Square kilometers (km²)',factor: 1000000 },
      squareCentimeter:{ label: 'Square centimeters (cm²)',factor: 0.0001 },
      hectare:         { label: 'Hectares (ha)',          factor: 10000 },
      acre:            { label: 'Acres',                  factor: 4046.8564224 },
      squareMile:      { label: 'Square miles (mi²)',     factor: 2589988.110336 },
      squareYard:      { label: 'Square yards (yd²)',     factor: 0.83612736 },
      squareFoot:      { label: 'Square feet (ft²)',      factor: 0.09290304 }
    },
    defaultFrom: 'squareMeter',
    defaultTo: 'squareFoot'
  },
  speed: {
    base: 'meterPerSecond',
    units: {
      meterPerSecond: { label: 'Meters/second (m/s)', factor: 1 },
      kilometerPerHour:{ label: 'Kilometers/hour (km/h)', factor: 0.277777778 },
      milePerHour:    { label: 'Miles/hour (mph)',    factor: 0.44704 },
      knot:           { label: 'Knots (kn)',          factor: 0.514444444 },
      footPerSecond:  { label: 'Feet/second (ft/s)',  factor: 0.3048 }
    },
    defaultFrom: 'kilometerPerHour',
    defaultTo: 'milePerHour'
  },
  time: {
    base: 'second',
    units: {
      second: { label: 'Seconds (s)', factor: 1 },
      minute: { label: 'Minutes (min)', factor: 60 },
      hour:   { label: 'Hours (hr)',   factor: 3600 },
      day:    { label: 'Days',         factor: 86400 },
      week:   { label: 'Weeks',        factor: 604800 },
      month:  { label: 'Months (30d)', factor: 2592000 },
      year:   { label: 'Years (365d)', factor: 31536000 }
    },
    defaultFrom: 'hour',
    defaultTo: 'minute'
  },
  data: {
    base: 'byte',
    units: {
      byte:     { label: 'Bytes (B)',      factor: 1 },
      kilobyte: { label: 'Kilobytes (KB)', factor: 1024 },
      megabyte: { label: 'Megabytes (MB)', factor: 1024 ** 2 },
      gigabyte: { label: 'Gigabytes (GB)', factor: 1024 ** 3 },
      terabyte: { label: 'Terabytes (TB)', factor: 1024 ** 4 },
      bit:      { label: 'Bits (b)',       factor: 0.125 }
    },
    defaultFrom: 'megabyte',
    defaultTo: 'gigabyte'
  }
};

let currentCategory = 'length';

const fromValueEl = document.getElementById('from-value');
const toValueEl = document.getElementById('to-value');
const fromUnitEl = document.getElementById('from-unit');
const toUnitEl = document.getElementById('to-unit');
const swapBtn = document.getElementById('swap-btn');
const noteEl = document.getElementById('conversion-note');
const quickRefListEl = document.getElementById('quick-ref-list');
const catButtons = document.querySelectorAll('.cat-btn');

function convertTemperature(value, from, to) {
  if (from === to) return value;
  // Normalize to Celsius first
  let celsius;
  if (from === 'celsius') celsius = value;
  else if (from === 'fahrenheit') celsius = (value - 32) * (5 / 9);
  else if (from === 'kelvin') celsius = value - 273.15;

  if (to === 'celsius') return celsius;
  if (to === 'fahrenheit') return celsius * (9 / 5) + 32;
  if (to === 'kelvin') return celsius + 273.15;
}

function convertLinear(value, from, to, unitsDef) {
  const baseValue = value * unitsDef[from].factor;
  return baseValue / unitsDef[to].factor;
}

function convert(value, from, to, category) {
  const def = CATEGORIES[category];
  if (category === 'temperature') {
    return convertTemperature(value, from, to);
  }
  return convertLinear(value, from, to, def.units);
}

function formatResult(num) {
  if (!isFinite(num)) return '—';
  if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(4);
  }
  // Round to 6 significant figures, trim trailing zeros
  const rounded = parseFloat(num.toPrecision(6));
  return rounded.toString();
}

function populateUnitSelects(category) {
  const def = CATEGORIES[category];
  const unitKeys = Object.keys(def.units);

  fromUnitEl.innerHTML = '';
  toUnitEl.innerHTML = '';

  unitKeys.forEach(key => {
    const optFrom = document.createElement('option');
    optFrom.value = key;
    optFrom.textContent = def.units[key].label;
    fromUnitEl.appendChild(optFrom);

    const optTo = document.createElement('option');
    optTo.value = key;
    optTo.textContent = def.units[key].label;
    toUnitEl.appendChild(optTo);
  });

  fromUnitEl.value = def.defaultFrom;
  toUnitEl.value = def.defaultTo;
}

function runConversion() {
  const value = parseFloat(fromValueEl.value);
  const from = fromUnitEl.value;
  const to = toUnitEl.value;

  if (isNaN(value)) {
    toValueEl.value = '';
    noteEl.textContent = '';
    return;
  }

  const result = convert(value, from, to, currentCategory);
  toValueEl.value = formatResult(result);

  const def = CATEGORIES[currentCategory];
  noteEl.textContent = `1 ${def.units[from].label.split(' (')[0]} = ${formatResult(convert(1, from, to, currentCategory))} ${def.units[to].label.split(' (')[0]}`;
}

function renderQuickRef(category) {
  const def = CATEGORIES[category];
  quickRefListEl.innerHTML = '';
  const from = def.defaultFrom;
  const refValues = [1, 5, 10, 100];

  refValues.forEach(v => {
    const to = def.defaultTo;
    const result = convert(v, from, to, category);
    const item = document.createElement('span');
    item.className = 'quick-ref-item';
    item.innerHTML = `<strong>${v}</strong> ${def.units[from].label.split(' (')[0]} = <strong>${formatResult(result)}</strong> ${def.units[to].label.split(' (')[0]}`;
    quickRefListEl.appendChild(item);
  });
}

function switchCategory(category) {
  currentCategory = category;
  populateUnitSelects(category);
  fromValueEl.value = 1;
  runConversion();
  renderQuickRef(category);

  catButtons.forEach(btn => {
    const isActive = btn.dataset.category === category;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

// Category rail uses real <a href> links (one static page per category)
// for crawlability/SEO. Prevent a reload if the link points to the page
// that's already active.
catButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (btn.dataset.category === currentCategory) {
      e.preventDefault();
    }
  });
});

fromValueEl.addEventListener('input', runConversion);
fromUnitEl.addEventListener('change', () => {
  runConversion();
  renderQuickRef(currentCategory);
});
toUnitEl.addEventListener('change', () => {
  runConversion();
  renderQuickRef(currentCategory);
});

swapBtn.addEventListener('click', () => {
  const fromVal = fromUnitEl.value;
  const toVal = toUnitEl.value;
  fromUnitEl.value = toVal;
  toUnitEl.value = fromVal;
  runConversion();
  renderQuickRef(currentCategory);
});

// Initialize based on this page's category (set via <body data-category="...">)
const initialCategory = document.body.dataset.category || 'length';
switchCategory(initialCategory);
