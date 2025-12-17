import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  TextField,
  InputAdornment,
  Button,
  Typography,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, Search, Add } from '@mui/icons-material';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode | string;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  searchPlaceholder?: string;
  loading?: boolean;
  showSerialNo?: boolean; // New prop to control SN display
  serialNoStart?: number; // Optional: Starting number for serial numbers
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  onEdit,
  onDelete,
  onAdd,
  searchPlaceholder = 'Search...',
  loading = false,
  showSerialNo = true, // Default to showing SN
  serialNoStart = 1, // Default starting from 1
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString()?.toLowerCase().includes(searchTerm?.toLowerCase())
    )
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'current':
        return 'success';
      case 'inactive':
      case 'ex':
        return 'error';
      case 'expired':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderCellContent = (column: Column, value: any, row: any) => {
    if (column.format) {
      const formattedValue = column.format(value, row);
      if (React.isValidElement(formattedValue)) {
        return formattedValue;
      }
      if (typeof formattedValue === 'string' || typeof formattedValue === 'number') {
        return formattedValue;
      }
    }
    
    if (column.id === 'status') {
      return (
        <Chip
          label={value || ''}
          color={getStatusColor(value) as any}
          size="small"
          sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
        />
      );
    }
    
    if (value === null || value === undefined) {
      return '';
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return 'None';
      }
      if (typeof value[0] === 'object') {
        try {
          const names = value.map(item => item.name || item.title || item.id || JSON.stringify(item)).join(', ');
          return names;
        } catch {
          return `${value.length} items`;
        }
      }
      return value.join(', ');
    }
    
    if (typeof value === 'object') {
      try {
        if (value.name) return value.name;
        if (value.title) return value.title;
        if (value.id) return `ID: ${value.id}`;
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    
    return String(value);
  };

  // Calculate serial number for each row
  const getSerialNumber = (index: number) => {
    return page * rowsPerPage + index + serialNoStart;
  };

  return (
    <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          {onAdd && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAdd}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Add New
            </Button>
          )}
        </Box>
        
        <TextField
          fullWidth
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <TableContainer>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {/* Serial Number Column Header */}
                {showSerialNo && (
                  <TableCell
                    key="sn"
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f8f9fa',
                      color: '#333',
                      minWidth: 70,
                      width: 70,
                    }}
                  >
                    SN
                  </TableCell>
                )}
                
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f8f9fa',
                      color: '#333',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                
                {(onEdit || onDelete) && (
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f8f9fa',
                      color: '#333',
                      minWidth: 120,
                    }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={
                      columns.length + 
                      (showSerialNo ? 1 : 0) + 
                      ((onEdit || onDelete) ? 1 : 0)
                    } 
                    align="center" 
                    sx={{ py: 4 }}
                  >
                    <Typography color="text.secondary">
                      {searchTerm ? 'No results found' : 'No data available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <TableRow key={row.id || index} hover>
                    {/* Serial Number Cell */}
                    {showSerialNo && (
                      <TableCell 
                        key="sn" 
                        align="center"
                        sx={{
                          fontWeight: 'medium',
                          color: '#666',
                        }}
                      >
                        {getSerialNumber(index)}
                      </TableCell>
                    )}
                    
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {renderCellContent(column, value, row)}
                        </TableCell>
                      );
                    })}
                    
                    {(onEdit || onDelete) && (
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          {onEdit && (
                            <IconButton
                              size="small"
                              onClick={() => onEdit(row)}
                              sx={{
                                color: '#1976d2',
                                '&:hover': { backgroundColor: '#1976d220' },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          )}
                          {onDelete && (
                            <IconButton
                              size="small"
                              onClick={() => onDelete(row.id)}
                              sx={{
                                color: '#d32f2f',
                                '&:hover': { backgroundColor: '#d32f2f20' },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {!loading && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default DataTable;