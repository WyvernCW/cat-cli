import React from 'react';
import { Box, Text } from 'ink';
import Table from 'ink-table';

interface DeliveryTableProps {
  files: Array<{ filename: string; size_bytes: number }>;
  zipPath?: string;
}

export const DeliveryTable: React.FC<DeliveryTableProps> = ({ files, zipPath }) => {
  const tableData = files.map(f => ({
    File: f.filename,
    Size: `${(f.size_bytes / 1024).toFixed(1)} KB`,
  }));

  return (
    <Box flexDirection="column" marginLeft={2} marginBottom={1}>
      <Text color="green" bold>✓ Delivery Summary</Text>
      <Table data={tableData} />
      {zipPath && (
        <Text italic dimColor marginTop={1}>
          All files bundled into: {zipPath}
        </Text>
      )}
    </Box>
  );
};
