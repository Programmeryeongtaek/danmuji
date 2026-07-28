'use client';

import { useKeywordGraph } from '@/entities/keyword/hooks';
import { KeywordStatus } from '@/types/keyword';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { RelatedKeywordModal } from '../RelatedKeywordModal';

interface KeywordNode extends d3.SimulationNodeDatum {
  id: string;
  term: string;
  status: KeywordStatus;
}

interface KeywordLink extends d3.SimulationLinkDatum<KeywordNode> {
  source: string | KeywordNode;
  target: string | KeywordNode;
}

const STATUS_COLOR: Record<KeywordStatus, string> = {
  done: '#639922',
  review: '#eda100',
  new: '#888780',
};

const STATUS_LABEL: Record<KeywordStatus, string> = {
  done: '완료',
  review: '복습필요',
  new: '미학습',
};

export function KeywordMap() {
  const { data, isLoading } = useKeywordGraph();
  const svgRef = useRef<SVGSVGElement>(null);
  const [modalKeywordId, setModalKeywordId] = useState<string | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const width = 800;
    const height = 560;

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.append('g');

    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.4, 3])
        .on('zoom', (event) => container.attr('transform', event.transform)),
    );

    const nodes: KeywordNode[] = data.nodes.map((n) => ({ ...n }));
    const links: KeywordLink[] = data.links.map((l) => ({ ...l }));

    const simulation = d3
      .forceSimulation<KeywordNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<KeywordNode, KeywordLink>(links)
          .id((d) => d.id)
          .distance(60),
      )
      .force('charge', d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(30));

    const link = container
      .append('g')
      .selectAll<SVGLineElement, KeywordLink>('line')
      .data(links)
      .join('line')
      .attr('stroke', 'var(--border-strong, #d3d1c7)')
      .attr('stroke-width', 0.7);

    const node = container
      .append('g')
      .selectAll<SVGGElement, KeywordNode>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, KeywordNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.2).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      )
      .on('click', (_event, d) => setModalKeywordId(d.id));

    node
      .append('circle')
      .attr('r', 14)
      .attr('fill', (d) => STATUS_COLOR[d.status])
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    node
      .append('text')
      .text((d) => d.term)
      .attr('x', 0)
      .attr('y', 24)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', 'var(--text-secondary, #52514e)');

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as KeywordNode).x ?? 0)
        .attr('y1', (d) => (d.source as KeywordNode).y ?? 0)
        .attr('x2', (d) => (d.target as KeywordNode).x ?? 0)
        .attr('y2', (d) => (d.target as KeywordNode).y ?? 0);
      node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  if (isLoading)
    return <p className="text-sm text-neutral-400">불러오는 중...</p>;

  return (
    <div>
      <div className="flex gap-4 mb-3 text-xs text-neutral-500">
        {(Object.keys(STATUS_LABEL) as KeywordStatus[]).map((status) => (
          <span key={status} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ background: STATUS_COLOR[status] }}
            />
            {STATUS_LABEL[status]}
          </span>
        ))}
      </div>
      <svg
        ref={svgRef}
        viewBox="0 0 800 560"
        className="w-full border border-neutral-200 rounded-lg"
        style={{ height: 560 }}
      />
      <RelatedKeywordModal
        keywordId={modalKeywordId}
        onClose={() => setModalKeywordId(null)}
      />
    </div>
  );
}
