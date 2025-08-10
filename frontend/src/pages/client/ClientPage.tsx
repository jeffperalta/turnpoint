import {useCallback, useState, useEffect, useMemo} from 'react';
import {MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Client } from '../../models/Client';
import { ClientService } from '../../services/ClientService';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const clientService = new ClientService();

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
      accessorKey: 'dob', 
      header: 'Date of birth',
      Cell: ({ cell }) => {
        const value = cell.getValue<string>();
        return value ? format(new Date(value), 'dd MMM yyyy') : '';
      }, 
    },
    { accessorKey: 'main_language', header: 'Main Language' },
    { accessorKey: 'secondary_language', header: 'Secondary Language'},
    { accessorKey: 'funding.name', header: 'Funding Source' },
  ], []);

  async function handleDelete(id?: number) {
    if (!id) return;
    //TODO: if (!confirm('Delete this client?')) return;
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
            secondary_language: false, 
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