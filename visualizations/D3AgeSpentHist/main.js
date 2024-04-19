const csvUrl = 'shopping_trends_updated.csv';

fetch(csvUrl)
  .then(response => response.text())
  .then(csvText => {
    let csvData = d3.csvParse(csvText);
    let totalSpendingByAge = csvData.reduce((acc, curr) => {
      let age = parseInt(curr["Age"]);
      let purchaseAmount = parseFloat(curr["Purchase Amount (USD)"]);
      acc[age] = (acc[age] || 0) + purchaseAmount;
      return acc;
    }, {});

    let data = Object.entries(totalSpendingByAge).map(([age, total]) => ({
      age: +age, 
      total: total
    }));

    
    let width = 1400,
      height = 700;
    let margin = { 
      top: 100,
      bottom: 30,
      left: 120,
      right: 30,
     };

    let svg = d3
      .select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', '#e9f7f2');

    // Scales
    let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total)])
      .range([height - margin.bottom, margin.top]);

      let xScale = d3.scaleBand()
      .domain(data.map(d => d.age))
      .range([margin.left, width - margin.right])
      .padding(.2); 

    // Bars
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.age))
      .attr('y', d => yScale(d.total))
      .attr('width', ((width - margin.left - margin.right) / data.length) - 1.5)
      .attr('height', d => height - margin.bottom - yScale(d.total))
      .attr('fill', 'steelblue');

    // Axes
    let xAxis = svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    let yAxis = svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // labels
    xAxis.append('text')
      .attr('x', width - margin.left - 520)
      .attr('y', +25)
      .style('stroke', 'black')
      .text('Age (Years)');

    yAxis.append('text')
      .attr('y', 30)
      .attr('x', -20)
      .style('stroke', 'black')
      .text('Total Spent (USD)');
  })