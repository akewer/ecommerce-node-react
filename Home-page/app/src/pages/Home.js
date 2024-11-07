import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import axios from 'axios'
import config from "../config";
import MyModal from "../component/MyModal";
import dayjs from 'dayjs'


function Index() {
    const [product, setProducts] = useState({});
    const [carts, setCarts] = useState([]);//Item in Carts
    const [recordInCarts, setRecordInCarts] = useState(0);
    const [sumQty, setSumQty] = useState(0);
    const [sumPrice, setSumPrice]= useState(0);

    //ตัวเเปรสำหรับทำงานของลูกค้า
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState(''); 
    const [payDate, setPayDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
    const [payTime, setPayTime] = useState('')

    useEffect(() => {
        fetchData();
        fetchDataFromLocal();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list');

            if(res.data.result !== undefined){
                setProducts(res.data.result);
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.messages,
                icon: 'error'
            })
        }
    }
    function showImage(item){
        if(item.img !== undefined){
            let imgPath = config.apiPath + '/uploads/' + item.img;
            if (item.img === "") imgPath = 'default_Image.png';
            return <img className='card-img-top' height='250px' src={imgPath} alt=""/>
        }
    }
    
    const addToCart = (item) => {
        let arr = carts;

        if (arr === null){
            arr = []
        }

        arr.push(item); 
        setCarts(arr);
        setRecordInCarts(arr.length);

        localStorage.setItem('carts', JSON.stringify(carts));
        fetchDataFromLocal();
    }

    //ฟังชั่นดึงข้อมูลใน carts
    const fetchDataFromLocal = () => {
        //เอาข้อมูล itemincart จาก localstorage
            const itemInCarts = JSON.parse(localStorage.getItem('carts'));
            if(itemInCarts !== null)
            {
                setCarts(itemInCarts);
                setRecordInCarts(itemInCarts !== null ? itemInCarts.length : 0);
                cumputePriceAndQty(itemInCarts);
            }    
    }
    
    const cumputePriceAndQty = (itemInCarts) =>{
        let sumQty = 0;
        let sumPrice = 0;

        for(let i = 0; i < itemInCarts.length;i++ )
        {
            //ให้item = carts[i]
            const item = itemInCarts[i] 
            sumQty++;
            sumPrice += parseInt(item.price)
            
        }
       
        setSumPrice(sumPrice);
        setSumQty(sumQty);
    }

    //function ลบ item onclick
    const handleRemove = async (item) => {
        try {
            const button = await Swal.fire({
                title: 'ลบสินค้า',
                text: 'คุณต้องการลบสินค้าออกจากตะกร้าใช่หรือไม่',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            })
            if(button.isConfirmed){
                let arr = carts;
                for (let i =0; i < arr.length;i++)
                {
                    const itemInCart = arr[i]
                    //ถ้าid ตรงกับ ลบ item id นั้น
                    if(item.id === itemInCart.id)
                    {
                        arr.splice(i, 1)
                    }       
                }
                //เปลี่ยนตัวเลข เเเละ สิ่งที่อยู่ใน array
                setCarts(arr);
                setRecordInCarts(arr.length);
                //นำข้อมูลไปเก็บใน localStorage
                localStorage.setItem('carts', JSON.stringify(arr))
                //คำนวณใหม่
                cumputePriceAndQty(arr)
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.messages,
                icon: 'error'
            })
        }
    }

    //function save ของ ใน ตะกร้า
    const handleSave = async() => {
        try {
            const payload = {
                customerName: customerName,
                customerPhone: customerPhone,
                customerAddress: customerAddress,
                payDate: payDate,
                payTime: payTime,
                carts: carts
            }

            const res = await axios.post(config.apiPath+ '/api/sale/save', payload)
            
            if (res.data.messages === 'success') {
                localStorage.removeItem(carts);
                setRecordInCarts(0);
                setCarts([]);

                Swal.fire({
                    title: 'บันทึกข้อมูล',
                    text: 'ระบบได้บันทึกข้อมูลของคุณเเล้ว',
                    icon: 'success',
                    timer: 1000
                })
                document.getElementById('modalCart_btnClose').click();
                setCustomerName('');
                setCustomerPhone('');
                setCustomerAddress('');
                setPayDate('');
                setPayTime('');
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon:'error'
            })
        }
    }
    
    return<>
    <div className='container mt-3'>
        <div className='float-start'>
            <div className='h3'>สินค้าของร้านเรา</div>
        </div>
        <div className='float-end'>
            ตะกร้าของฉัน
            <button className='btn btn-outline-success'
            data-bs-toggle='modal'
            data-bs-target='#modalCart'>
                <i className='fa fa-shopping-cart me-2'></i>
                {recordInCarts}
            </button>
            ชิ้น
        </div>
        <div className='clearfix'></div>
        <div className='row'>
            {product.length > 0 ? product.map(item =>
              <div className='col-3 mt-3' key={item.id}>
                <div className='card'>
                {showImage(item)}
                <div className='card-body'>
                    <div>{item.name}</div>
                    <div>{item.price.toLocaleString('th-TH')}</div>
                    <div className='text-center'>
                        <button className='btn btn-primary' onClick={e => addToCart(item)}>
                            <i className='fa fa-shopping-cart me-2'></i>
                            Add to Cart
                        </button>
                    </div>
                </div>        
                </div>
              </div>
            ):<></>}
        </div>
    </div>

    {/* modal */}
    <MyModal id='modalCart' title='ตะกร้าสินค้าของฉัน'>
        <table className='table table-bordered table-striped'> 
            <thead>
                <tr>
                    <th>name</th>
                    <th>price</th>
                    <th>qty</th>
                    <th width = '60px'></th>
                </tr>
            </thead>
            <tbody> 
                {carts.length>0 ? carts.map(item =>                     
                <tr>
                    <td>{item.name}</td>
                    <td className='text-end'>{item.price.toLocaleString('th-Th')}</td>
                    <td className='text-end'>1</td>
                    <td> 
                        <button className='btn btn-danger' onClick={e => handleRemove(item)}>
                        <i className='fa fa-times'></i>
                        </button>
                    </td>
                </tr>
                    ) :<></>}
            </tbody>
        </table>

        <div className='text-center'>
            จำนวน {sumQty} รายการ รวมราคา {sumPrice.toLocaleString('th-TH')} บาท
        </div>

        <div className='text-start mt-3'>
            <div className='alert alert-info'>
                    โปรดโอนเงินไปยังบัญชี ไทยพานิช 321-888-10507
            </div>
            <div className='mt-3'>
                <div>ชื่อผู้ใช้</div>
                <input className='form-control' value={customerName} onChange={e => setCustomerName(e.target.value)}/>
            </div>
            <div className='mt-3'>
                <div>เบอร์โทรติดต่อ</div>
                <input className='form-control' value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}/>
            </div>
            <div className='mt-3'>
                <div>ที่อยู่จัดส่ง</div>
                <input className='form-control' value={customerAddress} onChange={e => setCustomerAddress(e.target.value)}/>
            </div>
            <div className='mt-3'>
                <div>วันที่โอน</div>
                <input type="date" className='form-control' value={payDate} onChange={e => setPayDate(e.target.value)}/>
            </div>
            <div className='mt-3'>
                <div>เวลาที่โอนเงิน</div>
                <input className='form-control' onChange={e => setPayTime(e.target.value)}/>
            </div>
            <button className='btn btn-primary' onClick={handleSave}>
            <i className='fa fa-check mr-2'></i>
            ยืนยันการสั่งซื้อ
            </button>
        </div>

    </MyModal>
    </>
}
export default Index;