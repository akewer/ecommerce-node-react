  import axios from "axios"
  import { useState, useEffect } from "react"
  import Swal from "sweetalert2"
  import config from "../config"
  import {Link, useNavigate } from "react-router-dom"

  function Sidebar(){
    const [user, setUser] = useState({})
    const navigate = useNavigate();

    useEffect(()=>{
      fetchData();
    }, [])
    const fetchData = async () => {
      try {
        const res = await axios.get(config.apiPath+ '/user/info', config.headers());
        if (res.data.result !== undefined){
          setUser(res.data.result);
        }
      } catch (e) {
        Swal.fire({
          title:'error',
          text: (e.message),
          icon: 'error'
        })
        
      }
    }
    const handleSignOut = async() => {
      try {
        const button = await Swal.fire({
          title:'ออกจากระบบ',
          text: "ยืนยันออกจากระบบ",
          icon: 'question',
          showCancelButton: true,
          showConfirmButton: true
        })

      if(button.isConfirmed){
        localStorage.removeItem('token');;
        navigate('/');
      }
        
      } catch (e) {
        Swal.fire({
          title:'error',
          text: (e.message),
          icon: 'error'
        })
        
      }
    }

    
return<>
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <a href="index3.html" class="brand-link">
      <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{opacity: '.8'}}/>
      <span class="brand-text font-weight-light">AdminLTE 3</span>
    </a>

    <div class="sidebar">
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image"/>
        </div>
        <div class="info">
          <a href="#" class="d-block">{user.name}</a>
          <button className='btn btn-danger' onClick={handleSignOut}>
          <i className='fa fa- mr-2'></i>
          Sign Out
          </button>   
        </div>
      </div>

      <div class="form-inline">
        <div class="input-group" data-widget="sidebar-search">
          <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search"/>
          <div class="input-group-append">
            <button class="btn btn-sidebar">
              <i class="fas fa-search fa-fw"></i>
            </button>
          </div>
        </div>
      </div>

      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <li class="nav-header">EXAMPLES</li>
          <li class="nav-item">
            <Link to="/product" class="nav-link">
              <i class="nav-icon fa fa-box"></i>
              <p>
                สินค้า
                <span class="badge badge-info right">2</span>
              </p>
            </Link>
          </li>
          <li class="nav-item">
            <Link to="/BillSale" class="nav-link">
              <i class="nav-icon fa fa-list"></i>
              <p>
                รายการยอดขาย
              </p>
            </Link>
          </li>
          <li class="nav-item">
            <Link to={'/dashboard'} class="nav-link">
              <i class="nav-icon fas fa-columns"></i>
              <p>
                DashBoard
              </p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</>
}



export default Sidebar