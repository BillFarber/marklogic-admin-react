import { render, screen } from '@testing-library/react';
import { RawJsonSection } from './RawJsonSection';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('RawJsonSection', () => {
    const mockData = {
        'test-data': {
            'property': 'value',
            'array': [1, 2, 3],
            'nested': {
                'inner': 'content'
            }
        }
    };

    it('renders the section title', () => {
        render(<RawJsonSection data={mockData} title="Test JSON Data" />);

        expect(screen.getByText('Test JSON Data')).toBeInTheDocument();
    });

    it('renders the JSON data in a preformatted block', () => {
        render(<RawJsonSection data={mockData} title="Test JSON Data" />);

        const jsonContent = screen.getByText((content, node) => {
            return node?.tagName.toLowerCase() === 'pre' &&
                content.includes('"test-data"') &&
                content.includes('"property": "value"');
        });

        expect(jsonContent).toBeInTheDocument();
    }); it('formats JSON with proper indentation', () => {
        render(<RawJsonSection data={mockData} title="Test JSON Data" />);

        const preElement = screen.getByText((content, node) => {
            return node?.tagName.toLowerCase() === 'pre';
        });

        // The actual JSON formatting includes proper newlines and indentation
        const expectedJSON = JSON.stringify(mockData, null, 2);
        expect(preElement.textContent).toBe(expectedJSON);
    });

    it('returns null when no data is provided', () => {
        const { container } = render(<RawJsonSection data={null} title="Test JSON Data" />);

        expect(container.firstChild).toBeNull();
    });

    it('returns null when data is undefined', () => {
        const { container } = render(<RawJsonSection data={undefined} title="Test JSON Data" />);

        expect(container.firstChild).toBeNull();
    });

    it('handles empty objects', () => {
        render(<RawJsonSection data={{}} title="Empty JSON Data" />);

        expect(screen.getByText('Empty JSON Data')).toBeInTheDocument();
        expect(screen.getByText('{}')).toBeInTheDocument();
    });

    it('handles arrays as data', () => {
        const arrayData = [1, 2, 3, { nested: 'value' }];
        render(<RawJsonSection data={arrayData} title="Array JSON Data" />);

        expect(screen.getByText('Array JSON Data')).toBeInTheDocument();
        expect(screen.getByText((content, node) => {
            return node?.tagName.toLowerCase() === 'pre' &&
                content.includes('[') &&
                content.includes('"nested": "value"');
        })).toBeInTheDocument();
    });

    it('handles primitive values as data', () => {
        render(<RawJsonSection data="simple string" title="String JSON Data" />);

        expect(screen.getByText('String JSON Data')).toBeInTheDocument();
        expect(screen.getByText('"simple string"')).toBeInTheDocument();
    });

    it('uses details/summary for collapsible content', () => {
        render(<RawJsonSection data={mockData} title="Collapsible JSON Data" />);

        const detailsElement = screen.getByText('Collapsible JSON Data').closest('details');
        expect(detailsElement).toBeInTheDocument();

        const summaryElement = screen.getByText('Collapsible JSON Data');
        expect(summaryElement.tagName.toLowerCase()).toBe('summary');
    });
});
