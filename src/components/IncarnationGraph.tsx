import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DatabaseIncarnation } from '../types/database';

interface IncarnationGraphProps {
  incarnations: DatabaseIncarnation[];
}

const IncarnationGraph: React.FC<IncarnationGraphProps> = ({ incarnations }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || incarnations.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 40, right: 50, bottom: 40, left: 60 };

    // Clear previous content
    svg.selectAll('*').remove();

    // Create the main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales with padding
    const xScale = d3.scaleTime()
      .domain(d3.extent(incarnations, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, width - margin.left - margin.right])
      .nice(); // This makes the axis extend to nice round numbers

    const yScale = d3.scaleLinear()
      .domain([0, incarnations.length - 1])
      .range([height - margin.top - margin.bottom, 0])
      .nice();

    // Add grid lines with animation
    const gridLinesX = g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .style('opacity', 0);

    gridLinesX.call(d3.axisBottom(xScale)
      .tickSize(-height + margin.top + margin.bottom)
      .tickFormat(() => '')
    )
    .style('stroke-dasharray', '3,3')
    .style('stroke-opacity', 0.1)
    .transition()
    .duration(1000)
    .style('opacity', 1);

    const gridLinesY = g.append('g')
      .attr('class', 'grid')
      .style('opacity', 0);

    gridLinesY.call(d3.axisLeft(yScale)
      .tickSize(-width + margin.left + margin.right)
      .tickFormat(() => '')
    )
    .style('stroke-dasharray', '3,3')
    .style('stroke-opacity', 0.1)
    .transition()
    .duration(1000)
    .style('opacity', 1);

    // Add X axis with animation
    const xAxis = g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .style('opacity', 0);

    xAxis.call(d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d => d3.timeFormat('%H:%M:%S')(d as Date))
    )
    .selectAll('text')
    .attr('y', 10)
    .attr('x', -5)
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end');

    xAxis.transition()
      .duration(1000)
      .style('opacity', 1);

    // Add Y axis with animation
    const yAxis = g.append('g')
      .attr('class', 'y-axis')
      .style('opacity', 0);

    yAxis.call(d3.axisLeft(yScale)
      .ticks(incarnations.length)
      .tickFormat(d => `Level ${d}`))
      .selectAll('text')
      .attr('x', -5);

    yAxis.transition()
      .duration(1000)
      .style('opacity', 1);

    // Create tooltip with enhanced styling
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(255, 255, 255, 0.95)')
      .style('border', '1px solid #ddd')
      .style('padding', '12px')
      .style('border-radius', '8px')
      .style('box-shadow', '0 4px 6px rgba(0,0,0,0.1)')
      .style('font-size', '14px')
      .style('z-index', '1000')
      .style('max-width', '300px')
      .style('transition', 'all 0.2s ease');

    // Create links with enhanced animation
    const links = incarnations
      .filter(d => d.parentId !== null)
      .map(d => {
        const sourceIndex = incarnations.findIndex(i => i.id === d.parentId);
        const targetIndex = incarnations.findIndex(i => i.id === d.id);
        return { source: sourceIndex, target: targetIndex };
      })
      .filter(link => link.source !== -1 && link.target !== -1);

    g.selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('d', d => {
        const sourceX = xScale(new Date(incarnations[d.source].timestamp));
        const sourceY = yScale(d.source);
        const targetX = xScale(new Date(incarnations[d.target].timestamp));
        const targetY = yScale(d.target);
        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      })
      .style('opacity', 0)
      .style('stroke-dasharray', function() { return this.getTotalLength() })
      .style('stroke-dashoffset', function() { return this.getTotalLength() })
      .transition()
      .duration(1500)
      .style('opacity', 0.6)
      .style('stroke-dashoffset', 0);

    // Create nodes with enhanced animation
    const nodes = g.selectAll('.node')
      .data(incarnations)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d, i) => `translate(${xScale(new Date(d.timestamp))},${yScale(i)})`);

    // Add circles for nodes with enhanced animation
    nodes.append('circle')
      .attr('r', 0)
      .attr('fill', d => d.status === 'ACTIVE' ? '#4CAF50' : '#9E9E9E')
      .attr('stroke', d => d.status === 'ACTIVE' ? '#388E3C' : '#616161')
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(300)
          .attr('r', 15)
          .style('filter', 'drop-shadow(0 4px 4px rgba(0,0,0,0.3))');

        tooltip
          .style('visibility', 'visible')
          .style('opacity', '1')
          .html(`
            <div style="font-weight: bold; margin-bottom: 8px; color: ${d.status === 'ACTIVE' ? '#388E3C' : '#616161'}">
              ${d.id}
            </div>
            <div style="margin-bottom: 4px"><strong>Status:</strong> ${d.status}</div>
            <div style="margin-bottom: 4px"><strong>Timestamp:</strong> ${new Date(d.timestamp).toLocaleString()}</div>
            <div style="margin-bottom: 4px"><strong>Parent:</strong> ${d.parentId || 'None'}</div>
            ${d.metadata?.description ? `<div style="margin-bottom: 4px"><strong>Description:</strong> ${d.metadata.description}</div>` : ''}
          `);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', `${event.pageY - 10}px`)
          .style('left', `${event.pageX + 15}px`);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(300)
          .attr('r', 12)
          .style('filter', 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))');

        tooltip.style('visibility', 'hidden');
      })
      .transition()
      .duration(1000)
      .attr('r', 12);

    // Add labels with enhanced animation
    nodes.append('text')
      .attr('dy', -20)
      .attr('text-anchor', 'middle')
      .text(d => d.id)
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', d => d.status === 'ACTIVE' ? '#388E3C' : '#616161')
      .style('opacity', 0)
      .style('filter', 'drop-shadow(0 1px 1px rgba(255,255,255,0.5))')
      .transition()
      .delay(500)
      .duration(1000)
      .style('opacity', 1);

  }, [incarnations]);

  return (
    <svg
      ref={svgRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default IncarnationGraph; 