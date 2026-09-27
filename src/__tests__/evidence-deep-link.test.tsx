import '@testing-library/jest-dom';
import { EvidenceExplorer } from '@/components/EvidenceExplorer';
import { EvidenceItem } from '@/lib/types';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const MOCK_EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'ev-101',
    reportId: 'rpt-001',
    dimension: 'delegation',
    title: 'Modular Task Partitioning',
    explanation: 'Candidate partitioned tasks effectively.',
    scoreImpact: 'positive',
    scoreDelta: 0.7,
    targetType: 'message',
    targetId: 'msg-103',
    timestamp: '17:12:40',
  },
  {
    id: 'ev-102',
    reportId: 'rpt-001',
    dimension: 'discernment',
    title: 'Caught Race Condition',
    explanation: 'Identified non-atomic Redis race condition.',
    scoreImpact: 'positive',
    scoreDelta: 0.8,
    targetType: 'message',
    targetId: 'msg-105',
    timestamp: '17:22:04',
  },
];

describe('Evidence Explorer Component Unit Tests', () => {
  it('renders all evidence items correctly', () => {
    render(
      <EvidenceExplorer
        evidenceItems={MOCK_EVIDENCE_ITEMS}
        selectedEvidenceId={null}
        onSelectEvidence={vi.fn()}
        selectedDimensionFilter="all"
        onSelectDimensionFilter={vi.fn()}
      />
    );

    expect(screen.getByText('Modular Task Partitioning')).toBeInTheDocument();
    expect(screen.getByText('Caught Race Condition')).toBeInTheDocument();
  });

  it('triggers onSelectEvidence callback with clicked evidence item', () => {
    const handleSelect = vi.fn();
    render(
      <EvidenceExplorer
        evidenceItems={MOCK_EVIDENCE_ITEMS}
        selectedEvidenceId={null}
        onSelectEvidence={handleSelect}
        selectedDimensionFilter="all"
        onSelectDimensionFilter={vi.fn()}
      />
    );

    const firstCard = screen.getByText('Modular Task Partitioning');
    fireEvent.click(firstCard);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(MOCK_EVIDENCE_ITEMS[0]);
  });

  it('filters evidence items by selected dimension', () => {
    const { rerender } = render(
      <EvidenceExplorer
        evidenceItems={MOCK_EVIDENCE_ITEMS}
        selectedEvidenceId={null}
        onSelectEvidence={vi.fn()}
        selectedDimensionFilter="discernment"
        onSelectDimensionFilter={vi.fn()}
      />
    );

    expect(screen.getByText('Caught Race Condition')).toBeInTheDocument();
    expect(screen.queryByText('Modular Task Partitioning')).not.toBeInTheDocument();
  });
});
