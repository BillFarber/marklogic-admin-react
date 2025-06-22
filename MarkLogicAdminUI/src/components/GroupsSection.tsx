import React from 'react';
import { GroupItem } from './GroupItem';

interface GroupsSectionProps {
    groups: any;
    groupDetails: Record<string, any>;
    hoveredGroup: string | null;
    setHoveredGroup: (group: string | null) => void;
}

export function GroupsSection({ groups, groupDetails, hoveredGroup, setHoveredGroup }: GroupsSectionProps) {
    if (!groups || !Array.isArray(groups['group-default-list']?.['list-items']?.['list-item'])) {
        return null;
    }

    const groupsList = groups['group-default-list']['list-items']['list-item'].filter((group: any) => group.nameref);

    return (
        <section style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
            <h2>Groups</h2>
            <ul style={{
                background: '#4a2d6b',
                color: '#fff',
                padding: 16,
                borderRadius: 8,
                listStyle: 'none',
                margin: 0
            }}>
                {groupsList.map((group: any, idx: number) => (
                    <GroupItem
                        key={group.nameref || idx}
                        group={group}
                        groupDetails={groupDetails}
                        hoveredGroup={hoveredGroup}
                        setHoveredGroup={setHoveredGroup}
                    />
                ))}
            </ul>
        </section>
    );
}
