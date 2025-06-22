import { useState } from 'react';

export function useHover() {
    const [hoveredDatabase, setHoveredDatabase] = useState<string | null>(null);
    const [hoveredForest, setHoveredForest] = useState<string | null>(null);
    const [hoveredServer, setHoveredServer] = useState<string | null>(null);
    const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
    const [hoveredUser, setHoveredUser] = useState<string | null>(null);
    const [hoveredRole, setHoveredRole] = useState<string | null>(null);

    return {
        hoveredDatabase,
        hoveredForest,
        hoveredServer,
        hoveredGroup,
        hoveredUser,
        hoveredRole,
        setHoveredDatabase,
        setHoveredForest,
        setHoveredServer,
        setHoveredGroup,
        setHoveredUser,
        setHoveredRole
    };
}
