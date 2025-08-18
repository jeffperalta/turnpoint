import {useCallback, useState, useEffect, useMemo} from 'react';
import {MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Client } from '../../models/Client';
import clientService from '../../services/ClientService';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate } from 'react-router-dom';

export default function ClientPage() {
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await clientService.getAll();
      setData(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const columns = useMemo<MRT_ColumnDef<Client>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { 
      accessorKey: 'dob_display', 
      header: 'Date of birth',
      sortingFn: (rowA, rowB) => {
        // Compare using the raw dob field yyyy-mm-dd
        const a = new Date(rowA.original.dob).getTime();
        const b = new Date(rowB.original.dob).getTime();
        return a - b;
      },
    },
    { 
      accessorKey: 'main_language_display', 
      header: 'Main Language' 
    },
    { 
      accessorKey: 'secondary_language_display', 
      header: 'Secondary Language' 
    },
    { accessorKey: 'funding.name', header: 'Funding Source' },
  ], []);

  async function handleDelete(id?: number) {
    if (!id) return;
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Delete this client?')) return;
    await clientService.delete(id);
    load();
  }

  return <>
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Clients</Typography>
        <Button
          component={Link}
          to="/clients/create"
          variant="contained"
          startIcon={<AddIcon />}
        >
          New Client
        </Button>
      </Stack>

      <MaterialReactTable
        columns={columns}
        data={data}
        state={{ isLoading: loading }}
        enableSorting
        enableGlobalFilter
        enablePagination
        initialState={{
          pagination: { pageIndex: 0, pageSize: 10 },
          showGlobalFilter: true,
          columnVisibility: {
            secondary_language_display: false, 
          },
        }}
        enableRowActions
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              color="primary"
              onClick={() => navigate(`/clients/update/${row.original.id}`)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDelete(row.original.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      />
    </Stack>
  </>
}