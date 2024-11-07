import { useEffect, useState, useRef } from "react";
import BackOffice from "../../components/BackOffice";
import MyModal from "../../components/MyModal";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";

function Product() {
    const [product, setProduct] = useState({}); //CREATE, UPDATE
    const [products, setProducts]= useState({}); //SHOW
    const [img, setImg] = useState({});// File for Upload
    const [fileExcel, setFileExcel] = useState({}) //File for Excel
    const refExcel = useRef();
    const refImg = useRef();

    useEffect(() => {
        fetchData();
    }, [])

    const handleSave = async () => {
        try {
            product.img = await handleUpload(); //ก่อนเซฟรูปให้รอ upload ทำงาน 
            product.price = parseInt(product.price);
            product.cost = parseInt(product.cost);

            let res; 
            if (product.id === undefined) { //ถ้าตัว id นั้นยังไม่ได้ กำหนดค่า -> ทำการสร้าง product
            res = await axios.post(config.apiPath + '/product/create', product, config.headers()); //สร้าง product
            }else{ //ถ้าไม่(product นั้นๆ ถูกกำหนดค้าเเล้ว) =>เเก้ไข product
            res = await axios.put(config.apiPath + '/product/update', product, config.headers());//เเก้ไข product
            }

            if (res.data.message === 'success') { //ถ้า data message = susscess ตรงกับหลังบ้าน
                Swal.fire({
                    title: 'save',
                    text: 'success',
                    icon: 'success',
                    timer: 2000 // 1000 = 1 วินาที
                })
                document.getElementById('modalProduct_btnClose').click(); //คลิ้กปุ่มปิด modalProduct_btnClose
                fetchData(); // รับค่า จาก data เเล้ว update ใหม่

                setProduct({...product, id: undefined}) //Clear id undefined = ไม่กำหนดค่า
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const fetchData = async () => { //รับ Data จาก product
        try {
            const res = await axios.get(config.apiPath + '/product/list',config.headers())
            
            if(res.data.result !== undefined){
                setProducts(res.data.result);
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const clearForm = () => {
        setProduct({
            name: '',
            price: '',
            cost: ''
        })
    }

    const handleRemove = async (item)=> {
        try {
            const button = await Swal.fire({
                title: 'remove item',
                text: 'remove',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            })
                if(button.isConfirmed){
                    const res = await axios.delete(config.apiPath +'/product/remove/'+ item.id,config.headers());

                    if(res.data.message === 'success'){
                        Swal.fire({
                            title: 'remove',
                            text: 'remove success',
                            icon: 'success',
                            timer: 1000
                        })
                        fetchData();
                    }
                }
            }catch (e) {
            Swal.fire({
                 title: 'error',
                text: e.message,
                icon: 'error'
            })
            
        }
    } 
//----------------------------------------------------image----------------------------------------
    //เลือก File
    const selectedFile = (inputFile) => {
        if(inputFile !== undefined){
            if(inputFile.length > 0){setImg(inputFile[0])}
        }
    }
    //uploadfile
    const handleUpload = async () => {
        try {
            const formData = new FormData(); //สร้างที่เก็บไฟล์
            formData.append('img',img);//เก็บ img ลงใน formData

            const res = await axios.post(config.apiPath+ '/product/upload', formData,{ //ส่งไฟล์ ที่อยู่ใน formData เข้าหา backend
                headers: {
                    'Content-Type':'multipart/form-data', //รูปเเบบการส่งเป็นไฟล์
                    'Authorization': localStorage.getItem('token') //อ่าน token จาก localStoreage
                }
            })
            if(res.data.newName !== undefined){ //ถ้า data newName ไม่ใช่ค่าว่าง
                return res.data.newName; //ทำการ return newName (ส่งไฟล์)
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
               text: e.message,
               icon: 'error'
           })
        }
    }
    function showImage(item){ //รับค่า image
        if(item.img !== ""){ //ถ้า item.img ไม่ใช่ค่าว่าง
            return <img alt="" className='img-fluid' src={config.apiPath+ '/uploads/'+ item.img}/>;
        }
        return ""; //ถ้าไม่มีรูป return ค่าว่าง
    }
//---------------------------------EXcel File -----------------------------------------------
    const selectedFileExcel = (FileInput) => {
        if(FileInput !== undefined){
            if(FileInput.length > 0){
                setFileExcel(FileInput[0]);
            }
        }
    }

    const handleUploadFileExcel = async ()  => {
        try {
            const formData = new FormData();
            formData.append('fileExcel', fileExcel)

            const res = await axios.post(config.apiPath + '/product/uploadFromExcel', formData, {
                headers: {
                    'Content-Type':'multipart/form-data', //รูปเเบบการส่งเป็นไฟล์
                    'Authorization': localStorage.getItem('token') //อ่าน token จาก localStoreage
                }
            });

            if(res.data.message === 'success'){
                Swal.fire({
                    title: 'upload file',
                    text: 'upload Success',
                    icon: 'success',
                    timer: 1000
                })
                fetchData();
            }
            
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
            
        }
         fetchData();
         document.getElementById('modalExcel_btnClose').click();
    }
     const clearFormExcel = () => {

     }


//--------------------------------------------------------------------------------------
    return <BackOffice>
        <div className="h4">Product</div>
        <button  className="btn btn-primary" data-toggle='modal' data-target='#modalProduct'>
            <i className="fa fa-plus"></i>เพิ่มรายการ
        </button>
        {/* ปุ่มกด excel */}
        <button className='btn btn-success' data-toggle='modal' data-target='#modalExcel'>
            <i className='fa fa-arrow-down mr-2'></i>Import form Excle
        </button>

        <table className='mt-3 table table-bordered table-striped'>
            <thead>
                <tr>
                    <th>ภาพสินค้า</th>
                    <th>name</th>
                    <th width = '150px' className='text-right'>cost</th>
                    <th width = '150px' className='text-right'>price</th>
                    <th width = '140px'></th>
                </tr>
            </thead>
            <tbody>
            {products.length > 0 ? products.map(item =>
                <tr key={item.id}>
                    <td>{showImage(item)}</td>
                    <td>{item.name}</td>
                    <td className='text-right'>{item.cost}</td>
                    <td className='text-right'>{item.price}</td>
                    <td className='text-center'></td>
                    <button className='btn btn-primary mr-2'
                    data-toggle='modal'
                    data-target='#modalProduct'
                    onClick={e => setProduct(item)}
                    >
                    <i className='fa fa-edit'></i>
                    </button>
                    <button className='btn btn-danger'
                    onClick={e => handleRemove(item)}>
                        <i className="fa fa-times"></i>
                    </button>
                </tr>
            ):<></>}
            </tbody>
        </table>


        <MyModal id='modalProduct' title='สินค้า'>
            <div>
                <div>ชื่อสินค้า</div>
                <input value={product.name} className="form-control" onChange={e => setProduct({ ...product, name: e.target.value })} />
            </div>
            <div className="mt-3">
                <div>ราคาทุน</div>
                <input value={product.cost} className="form-control" onChange={e => setProduct({ ...product, cost: e.target.value })} />
            </div>
            <div className="mt-3">
                <div>ราคาขาย</div>
                <input value={product.price} className="form-control" onChange={e => setProduct({ ...product, price: e.target.value })} />
            </div>
            <div className="mt-3">
                <div className='mb-3'>{showImage(product)}</div>
                <div>ภาพสินค้า</div>
                <input className="form-control" type="file"
                onChange={e => selectedFile(e.target.files)} 
               ref={refImg}/>
            </div>
            <div className="mt-3">
                <button className="btn btn-primary" onClick={handleSave}>
                    <i className="fa fa-check mr-2"></i>Save
                </button>
            </div>
        </MyModal>
        {/* modal for exal file */}
        <MyModal id='modalExcel' title='เลือกไฟล์'>
            <div>เลือกไฟล์</div>
            <input type="file" className='form-control' ref={refExcel} onChange={e => selectedFileExcel(e.target.files) }/>

            <button className='mt-3 btn btn-primary' onClick={handleUploadFileExcel}>
                <i className='fa fa-check mr-2'></i>Save
            </button>

        </MyModal>

        
    </BackOffice>
}

export default Product;