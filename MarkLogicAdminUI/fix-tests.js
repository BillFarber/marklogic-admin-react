import { readFileSync, writeFileSync } from 'fs';

const filePath = '/Users/pbarber/Documents/Sandboxes/aiStuff/CopilotDriven/reactMarklogicAdmin/MarkLogicAdminUI/src/Admin.test.tsx';
let content = readFileSync(filePath, 'utf8');

// Helper patterns to fix tests
const fixes = [
    // Fix tests that have 2 mockResolvedValueOnce calls and need a third for servers
    {
        search: /(\(fetch as any\)\s*\.mockResolvedValueOnce\(\{[^}]+\}\)\s*\.mockResolvedValueOnce\(\{[^}]+\}\))\s*(?!\.mockResolvedValueOnce)/g,
        replace: '$1\n            .mockResolvedValueOnce({\n                ok: true,\n                json: () => Promise.resolve({ \'server-default-list\': { \'list-items\': { \'list-item\': [] } } })\n            })'
    },

    // Fix tests that use mockResolvedValue and need three calls
    {
        search: /\(fetch as any\)\.mockResolvedValue\(/g,
        replace: '(fetch as any)\n            .mockResolvedValueOnce({\n                ok: false,\n                status: 500,\n                statusText: \'Internal Server Error\'\n            })\n            .mockResolvedValueOnce({\n                ok: false,\n                status: 500,\n                statusText: \'Internal Server Error\'\n            })\n            .mockResolvedValue('
    },

    // Fix tests that use mockRejectedValue and need three calls
    {
        search: /\(fetch as any\)\.mockRejectedValue\(/g,
        replace: '(fetch as any)\n            .mockRejectedValueOnce(new Error(\'Network error\'))\n            .mockRejectedValueOnce(new Error(\'Network error\'))\n            .mockRejectedValue('
    }
];

// Apply fixes
fixes.forEach(fix => {
    content = content.replace(fix.search, fix.replace);
});

writeFileSync(filePath, content);
console.log('Applied automated test fixes');
