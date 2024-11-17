import React from 'react'
import AdminManage from '../components/admin/AdminManage'

function AdminPage() {
  const user = JSON.parse(sessionStorage.getItem('user'))
  return (
    <div className='divCenterColumn' style={{ height: '100vh'}}>
      <div className="d-flex w-100 justify-content-between my-2 px-3" style={{ height: '8%'}}>
        <button className="bg-primary" onClick={() => { window.history.back() }}>Back</button>
        <h5>Xin chào <b>{user?.fullName}!</b></h5>
      </div>
    <AdminManage />
    </div>
  )
}

export default AdminPage