// Interactive Bar Chart with Animated Tooltips & Scaling
const data = [
  { service: 'Postgres', latency: 4 },
  { service: 'Redis', latency: 1.2 },
  { service: 'Qdrant', latency: 12 },
  { service: 'FastAPI', latency: 8 },
  { service: 'vLLM', latency: 38 },
  { service: 'Ollama', latency: 54 }
];

const margin = { top: 30, right: 30, bottom: 50, left: 80 };
const width = 640 - margin.left - margin.right;
const height = 360 - margin.top - margin.bottom;

const svg = d3.select('#chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

const x = d3.scaleBand()
  .domain(data.map(d => d.service))
  .range([0, width])
  .padding(0.3);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.latency) * 1.2])
  .range([height, 0]);

svg.append('g')
  .attr('transform', `translate(0,${height})`)
  .call(d3.axisBottom(x))
  .attr('color', '#94a3b8');

svg.append('g')
  .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}ms`))
  .attr('color', '#94a3b8');

svg.selectAll('.bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', d => x(d.service))
  .attr('width', x.bandwidth())
  .attr('y', height)
  .attr('height', 0)
  .attr('fill', '#38bdf8')
  .attr('rx', 4)
  .transition()
  .duration(800)
  .attr('y', d => y(d.latency))
  .attr('height', d => height - y(d.latency));
