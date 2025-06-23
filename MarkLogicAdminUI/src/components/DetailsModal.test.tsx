import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DetailsModal } from './DetailsModal';
import '@testing-library/jest-dom';

describe('DetailsModal', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('does not render when isOpen is false', () => {
        render(
            <DetailsModal
                isOpen={false}
                onClose={mockOnClose}
                title="Test Title"
                data={{}}
                type="database"
            />
        );

        expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', () => {
        render(
            <DetailsModal
                isOpen={true}
                onClose={mockOnClose}
                title="Test Database"
                data={{ 'database-name': 'Documents', enabled: true }}
                type="database"
            />
        );

        expect(screen.getByText('Test Database Details')).toBeInTheDocument();
        expect(screen.getByText('Database Details:')).toBeInTheDocument();
    });

    it('displays database properties dynamically', () => {
        const databaseData = {
            'database-name': 'Documents',
            enabled: true,
            'uri-lexicon': false
        };

        render(
            <DetailsModal
                isOpen={true}
                onClose={mockOnClose}
                title="Documents"
                data={databaseData}
                type="database"
            />
        );

        expect(screen.getByText('Database Name:')).toBeInTheDocument();
        expect(screen.getByText('Documents')).toBeInTheDocument();
        expect(screen.getByText('Enabled:')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('shows userDetails properties for user type', () => {
        const userData = {
            nameref: 'test-user',
            userDetails: {
                'test-user': {
                    'user-name': 'test-user',
                    'description': 'Test user'
                }
            }
        };

        render(
            <DetailsModal
                isOpen={true}
                onClose={mockOnClose}
                title="test-user"
                data={userData}
                type="user"
            />
        );

        expect(screen.getByText('User Details:')).toBeInTheDocument();
        expect(screen.getByText('User Name:')).toBeInTheDocument();
        expect(screen.getByText('test-user')).toBeInTheDocument();
    });

    it('includes expandable JSON data section', () => {
        render(
            <DetailsModal
                isOpen={true}
                onClose={mockOnClose}
                title="Test"
                data={{ test: 'data' }}
                type="database"
            />
        );

        expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
    });
});
