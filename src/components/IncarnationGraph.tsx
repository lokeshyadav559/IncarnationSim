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
    const margin = { top: 20, right: 20, bottom: 20, left: 50 };

    // Clear previous content
    svg.selectAll('*').remove();

    // Create the main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(incarnations, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, incarnations.length - 1])
      .range([height - margin.top - margin.bottom, 0]);

    // Add X axis with animation
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .style('opacity', 0)
      .call(d3.axisBottom(xScale));

    xAxis.transition()
      .duration(1000)
      .style('opacity', 1);

    // Add Y axis with animation
    const yAxis = g.append('g')
      .style('opacity', 0)
      .call(d3.axisLeft(yScale));

    yAxis.transition()
      .duration(1000)
      .style('opacity', 1);

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('padding', '10px')
      .style('border-radius', '5px')
      .style('box-shadow', '0 0 10px rgba(0,0,0,0.1)');

    // Create nodes with animation
    const nodes = g.selectAll('.node')
      .data(incarnations)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d, i) => `translate(${xScale(new Date(d.timestamp))},${yScale(i)})`);

    // Add circles for nodes with animation
    nodes.append('circle')
      .attr('r', 0)
      .attr('fill', d => d.status === 'ACTIVE' ? '#4CAF50' : '#9E9E9E')
      .attr('stroke', d => d.status === 'ACTIVE' ? '#388E3C' : '#616161')
      .attr('stroke-width', 2)
      .on('mouseover', (event, d) => {
        tooltip
          .style('visibility', 'visible')
          .html(`
            <strong>Incarnation ID:</strong> ${d.id}<br/>
            <strong>Status:</strong> ${d.status}<br/>
            <strong>Timestamp:</strong> ${new Date(d.timestamp).toLocaleString()}<br/>
            <strong>Parent:</strong> ${d.parentId || 'None'}<br/>
            ${d.metadata?.description ? `<strong>Description:</strong> ${d.metadata.description}` : ''}
          `);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      })
      .transition()
      .duration(1000)
      .attr('r', 10);

    // Add labels with animation
    nodes.append('text')
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .text(d => d.id)
      .style('font-size', '12px')
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);

    // Create links with animation
    const links = incarnations
      .filter(d => d.parentId !== null)
      .map(d => {
        const sourceIndex = incarnations.findIndex(i => i.id === d.parentId);
        const targetIndex = incarnations.findIndex(i => i.id === d.id);
        return { source: sourceIndex, target: targetIndex };
      })
      .filter(link => link.source !== -1 && link.target !== -1);

    // Add links with animation
    g.selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5,5')
      .attr('d', d => {
        const sourceX = xScale(new Date(incarnations[d.source].timestamp));
        const sourceY = yScale(d.source);
        const targetX = xScale(new Date(incarnations[d.target].timestamp));
        const targetY = yScale(d.target);
        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      })
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1)
      .attr('stroke-dasharray', null);

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-height + margin.top + margin.bottom)
        .tickFormat(null)
      )
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.2);

    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat(null)
      )
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.2);

  }, [incarnations]);

  return (
    <svg
      ref={svgRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default IncarnationGraph; 