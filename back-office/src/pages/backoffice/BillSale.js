import { useEffect, useState } from "react";
import BackOffice from "../../components/BackOffice";
import axios from "axios";
import config from "../../config";
import Swal from "sweetalert2";
import dayjs from 'dayjs'
import MyModal from '../../components/MyModal'
function BillSale(){
    const [BillSale, setBillSale] = useState([]) 
    const [billSaleDetail, setBillSaleDetail]= useState([])
    const [sumPrice ,setSumPrice] = useState(0)
    
    useEffect(()=> {
        fetchData();
    } ,[])
    
    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath +'/api/Sale/list', config.headers())

            if(res.data.results !== undefined)
            {
                
                setBillSale(res.data.results)
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const openModalInfo = async (item) => {
        try {
            const res = await axios.get(config.apiPath + '/api/sale/billInfo/' + item.id, config.headers())
            if(res.data.results !== undefined){
                setBillSaleDetail(res.data.results)

                let mySumPrice = 0;
                for(let i =0; i < res.data.results.length; i++ )
                {
                    mySumPrice += parseInt(res.data.results[i].price)
                }
                setSumPrice(mySumPrice)
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const handlePay = async(item) => {
        try {
            const button = await Swal.fire({
                title: 'ยืนยันการชำระเงิน',
                text: 'คุณได้รับการชำระเงิน เเละตรวจสอบข้อมูลเเล้ว',
                icon: 'question',
                showConfirmButton: true,
                showCancelButton: true
            })
            if(button.isConfirmed)
                {
                    const res = await axios.get(config.apiPath +"/api/sale/updatestatusToPay/"+ item.id, config.headers())
                    if(res.data.message === 'success'){
                        Swal.fire({
                            title: 'save',
                            text: 'บันทึกข้อมูลเเล้ว',
                            icon: 'success',
                            timer: 1000
                        })
                        fetchData();

                    }
                }
            
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleSend = async(item) => {
        try {
            const button = await Swal.fire({
                title: 'ยืนยันการจัดส่งสินค้า',
                text: 'คุณต้องการบันทึกว่าจัดส่งสินค้าเเล้ว',
                icon: 'question',
                showConfirmButton: true,
                showCancelButton: true
            })
            if(button.isConfirmed)
                {
                    const res = await axios.get(config.apiPath +"/api/sale/updatestatusToSend/"+ item.id, config.headers())
                    if(res.data.message === 'success'){
                        Swal.fire({
                            title: 'save',
                            text: 'บันทึกข้อมูลเเล้ว',
                            icon: 'success',
                            timer: 1000
                        })
                        fetchData();

                    }
                }
            
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleCancle = async(item) => {
        try {
            const button = await Swal.fire({
                title: 'ยืนยันการยกเลิก',
                text: 'คุณต้องยกเลิกรายการบิลนี้ทั้งหมด',
                icon: 'question',
                showConfirmButton: true,
                showCancelButton: true
            })
            if(button.isConfirmed)
                {
                    const res = await axios.get(config.apiPath +"/api/sale/updatestatusToCancle/"+ item.id, config.headers())
                    if(res.data.message === 'success'){
                        Swal.fire({
                            title: 'save',
                            text: 'บันทึกข้อมูลเเล้ว',
                            icon: 'success',
                            timer: 1000
                        })
                        fetchData();

                    }
                }
            
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const displayStatusText =(item) => {
        if(item.status === 'wait'){
            return <div className='badge bg-dark'>รอตรวจสอบ</div>
        }else if(item.status === 'pay'){
            return <div className='badge bg-success'>ชำระเเล้ว</div>
        }else if(item.status === 'send'){
            return <div className='badge bg-info'>จัดส่งเเล้ว</div>
        }else if(item.status === 'cancle'){
            return<div className='badge bg-danger'>ยกเลิกรายการ</div>
        }
    }


    return<BackOffice>
        <div className="card">
            <div className="card-header">
            <div className="card-title">รายการยอดขาย</div>
            </div>
            <div className="card-body">
                <table className="table table-bordered table-striped">
                    <thead>
                        <th>ลูกค้า</th>
                        <th>เบอร์โทร</th>
                        <th>ที่อยู่</th>
                        <th>วันที่ชำระเงิน</th>
                        <th>เวลา</th>
                        <th>สถานะ</th>
                        <th width="480px"></th>
                    </thead>
                    <tbody>
                        {BillSale.length >0 ? BillSale.map(item => 
                            <tr key={item.id}>
                                <td>{item.customerName}</td>
                                <td>{item.customerPhone}</td>
                                <td>{item.classAddress}</td>
                                <td>{dayjs(item.payDate).format('DD/MM/YYYY')}</td>
                                <td>{item.payTime}</td>
                                <td>{displayStatusText(item)}</td>
                                <td className='text-center'>
                                    <button className='btn btn-secondary mr-1' data-toggle='modal' data-target='#modalInfo' onClick={e => openModalInfo(item)}>
                                        <i className="fa fa-file-alt mr-2"></i>
                                        รายการ
                                    </button>
                                    <button className='btn btn-info mr-1' onClick={e => handlePay(item)}>
                                    <i className='fa fa-check mr-2'></i>
                                    ได้รับชำระเเล้ว
                                    </button>

                                    <button className='btn btn-success mr-1' onClick={e => handleSend(item)}>
                                        <i className='fa fa-file mr-2'></i>
                                        จัดส่งเเล้ว
                                    </button>

                                    <button className='btn btn-danger mr-1' onClick={e => handleCancle(item)}>
                                    <i className="fa fa-times mr-2"></i>
                                    </button>
                                </td>
                            </tr>
                        ):<></>}

                    </tbody>
                </table>
            </div>
        </div>
    <MyModal id='modalInfo' title='รายการบิล'>
        <table className='table table-bordered table-striped'>
            <thead>
                <th>รายการ</th>
                <th className="text-right">ราคา</th>
                <th className="text-right">จำนวน</th>
            </thead>
            <tbody>
                {billSaleDetail.length > 0? billSaleDetail.map(item =>
                <tr key={item.id}>
                    <td>{item.Product.name}</td>
                    <td>{parseInt(item.Product.price).toLocaleString('Th-th')}</td>
                    <td>1</td>
                </tr>
                    
                ):<></>}        
            </tbody>
        </table>
        <div className='text-center mt-3'>
            ยอดรวม {sumPrice.toLocaleString('th-TH')} บาท
        </div>
    </MyModal>                    
    </BackOffice>
    
}

export default BillSale;