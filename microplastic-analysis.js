function parseNumeric(value) {
  if (value === null || value === undefined || value === '') {
    return NaN;
  }

  const parsed = Number(String(value).replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : NaN;
}

function classifyParticleType(particle) {
  const area = parseNumeric(particle.Area);
  const circularity = parseNumeric(particle.Circ ?? particle.circularity ?? particle.Circumference ?? particle.CIRC);
  const aspectRatio = parseNumeric(particle.AR ?? particle.aspectRatio ?? particle.Feret ?? particle['Aspect Ratio']);

  const effectiveCircularity = Number.isFinite(circularity) ? circularity : 0;
  const effectiveAspect = Number.isFinite(aspectRatio) ? aspectRatio : 1;

  if (effectiveAspect > 2.5 || effectiveCircularity < 0.35) {
    return 'Fibers';
  }

  if (effectiveAspect <= 1.8 && effectiveCircularity >= 0.7) {
    return 'Pellets';
  }

  if (effectiveCircularity >= 0.45 && effectiveCircularity <= 0.7) {
    return 'Fragments';
  }

  if (area > 2000) {
    return 'Films';
  }

  if (effectiveAspect > 1.8 && effectiveCircularity >= 0.35 && effectiveCircularity < 0.7) {
    return 'Lines / Filaments';
  }

  return 'Fragments';
}

function calculateRiskLevel(averageParticlesPerImage) {
  const average = Number(averageParticlesPerImage) || 0;

  if (average <= 10) {
    return { level: 'LEVEL 1', text: 'Low' };
  }

  if (average <= 30) {
    return { level: 'LEVEL 2', text: 'Moderate' };
  }

  if (average <= 60) {
    return { level: 'LEVEL 3', text: 'High' };
  }

  return { level: 'LEVEL 4', text: 'Very High' };
}

function summarizeCsvRows(rows, headers = [], imageCount = 1) {
  const safeRows = Array.isArray(rows) ? rows : [];

  const totalParticles = safeRows.length;
  const typeBreakdown = {
    Fragments: 0,
    Fibers: 0,
    Films: 0,
    Foams: 0,
    Pellets: 0,
    'Lines / Filaments': 0,
  };

  const areaValues = [];

  safeRows.forEach((row) => {
    const particle = {};

    headers.forEach((header) => {
      particle[header] = row[header];
    });

    Object.keys(row).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        particle[key] = row[key];
      }
    });

    const type = classifyParticleType(particle);
    if (Object.prototype.hasOwnProperty.call(typeBreakdown, type)) {
      typeBreakdown[type] += 1;
    } else {
      typeBreakdown.Fragments += 1;
    }

    const area = parseNumeric(row.Area ?? row.area ?? row.AREA);
    if (Number.isFinite(area)) {
      areaValues.push(area);
    }
  });

  const totalArea = areaValues.reduce((sum, value) => sum + value, 0);
  const averageArea = areaValues.length ? totalArea / areaValues.length : 0;
  const normalizedImageCount = Math.max(1, Number(imageCount) || 1);
  const averageParticlesPerImage = totalParticles > 0 ? totalParticles / normalizedImageCount : 0;
  const risk = calculateRiskLevel(averageParticlesPerImage);

  return {
    totalParticles,
    averageParticlesPerImage,
    totalArea,
    averageArea,
    typeBreakdown,
    risk,
  };
}

if (typeof module !== 'undefined') {
  module.exports = {
    parseNumeric,
    classifyParticleType,
    calculateRiskLevel,
    summarizeCsvRows,
  };
}
