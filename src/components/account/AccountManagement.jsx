import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  TextField,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import './AccountManagement.css';
import NavHeader from '../navbar/NavHeader';
const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [roles, setRoles] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [actionType, setActionType] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, [page, roleFilter, statusFilter]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/accounts`, {
        params: {
          page,
          size: pageSize,
          role: roleFilter,
          status: statusFilter,
        },
      });
      setAccounts(response.data.content);
      setTotalPages(response.data.totalPages);
      const initialRoles = {};
      response.data.content.forEach(account => {
        initialRoles[account.userId] = account.role;
      });
      setRoles(initialRoles);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (userId, action) => {
    setSelectedUserId(userId);
    setActionType(action);
    setOpenDialog(true);
  };

  const confirmAction = async () => {
    try {
      if (actionType === 'lock') {
        await axios.post(`http://localhost:8080/api/accounts/lock/${selectedUserId}`);
      } else if (actionType === 'unlock') {
        await axios.post(`http://localhost:8080/api/accounts/unlock/${selectedUserId}`);
      }
      fetchAccounts();
    } catch (error) {
      console.error(`Error ${actionType} account:`, error);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setRoles(prevRoles => ({
      ...prevRoles,
      [userId]: newRole,
    }));
    // upgradeAccount(userId, newRole);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0); 
  };

  const filteredAccounts = accounts.filter(account =>
    account.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define the upgradeAccount function
  const upgradeAccount = async (userId,newRole) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/accounts/upgrade/${userId}/${newRole}`);
      fetchAccounts();
      console.log('Account upgraded successfully:', response.data);
    } catch (error) {
      console.error('Error upgrading account:', error);
    }
  };

  return (
    <Paper className="account-management-paper">
    <NavHeader textColor="black"/>
      <Typography variant="h4" gutterBottom align="center">
        Quản Lý Tài Khoản
      </Typography>
      <div className="filter-container">
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm theo Tên đăng nhập..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search />,
          }}
          className="search-bar"
        />
        <FormControl variant="outlined" size="small" className="filter-dropdown">
          <InputLabel>Vai Trò</InputLabel>
          <Select
            value={roleFilter}
            onChange={handleRoleFilterChange}
            label="Vai Trò"
          >
            <MenuItem value=""><em>Tất Cả</em></MenuItem>
            <MenuItem value="CUSTOMER">Khách Hàng</MenuItem>
            <MenuItem value="CUSTOMERVIP">Khách Hàng Vip</MenuItem>
            <MenuItem value="ADMIN">Quản Trị</MenuItem>
            <MenuItem value="TOURGUIDE">Hướng Dẫn Viên</MenuItem>
            <MenuItem value="TOURPROVIDER">Nhà Cung Cấp Tour</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small" className="filter-dropdown">
          <InputLabel>Trạng Thái</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Trạng Thái"
          >
            <MenuItem value=""><em>Tất Cả</em></MenuItem>
            <MenuItem value="active">Hoạt Động</MenuItem>
            <MenuItem value="locked">Bị Khóa</MenuItem>
          </Select>
        </FormControl>
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã Người Dùng</TableCell>
                  <TableCell>Tên Đăng Nhập</TableCell>
                  <TableCell>Vai Trò</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                  <TableCell>Họ Và Tên</TableCell>
                  <TableCell>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.userId} hover>
                    <TableCell>{account.userId}</TableCell>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>
                      <FormControl variant="outlined" size="small">
                        <InputLabel>Vai Trò</InputLabel>
                        <Select
                          value={roles[account.userId] || account.role}
                          onChange={(e) => handleRoleChange(account.userId, e.target.value)}
                          label="Vai Trò"
                        >
                          <MenuItem value="CUSTOMER">Khách Hàng</MenuItem>
                          <MenuItem value="CUSTOMERVIP">Khách Hàng Vip</MenuItem>
                          <MenuItem value="ADMIN">Quản Trị</MenuItem>
                          <MenuItem value="TOURGUIDE">Hướng Dẫn Viên</MenuItem>
                          <MenuItem value="TOURPROVIDER">Nhà Cung Cấp Tour</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>{account.active ? 'Hoạt Động' : 'Bị Khóa'}</TableCell>
                    <TableCell>{account.fullName}</TableCell>
                    <TableCell>
                      {account.active ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleAction(account.userId, 'lock')}
                        >
                          Khóa
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleAction(account.userId, 'unlock')}
                        >
                          Mở Khóa
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => upgradeAccount(account.userId, roles[account.userId])} 
                      >
                        Nâng Cấp
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(event, value) => setPage(value - 1)}
            className="pagination"
          />
        </>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle className="dialog-title">Xác Nhận Hành Động</DialogTitle>
        <DialogContent>
          <DialogContentText className="dialog-content">
            Bạn có chắc muốn {actionType === 'lock' ? 'khóa' : 'mở khóa'} tài khoản này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={confirmAction} color="secondary">
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AccountManagement;