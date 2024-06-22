import axios from 'axios'
import { useEffect,useState } from 'react'
import './App.css'

function App() {
  const [users,setUsers] = useState([])
  const [filterUser,setFilterUser] = useState([])
  const [isModalOpen,setIsModalOpen] = useState(false)
  const [userData,setuserData] = useState({id:'',name:'',city:''})
  const getAllUsers = async()=> {
      await axios.get('http://localhost:8000/users').then((res)=>{
      setUsers(res.data)
      setFilterUser(res.data)
    })
  }
  useEffect(()=>{
    getAllUsers()
  },[])
  const closeModal = ()=>{
    setIsModalOpen(false)
    getAllUsers()
  }
  const handleChange = (e)=>{
    const searchText = e.target.value.toLowerCase()
    const filteredUser = users.filter((user)=>user.name.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText))
    setFilterUser(filteredUser)
  }
  const handleDelete = async(id)=> {
    const isConfirmed = window.confirm('Are you sure you want to delete this?')
    if(isConfirmed){
      await axios.delete(`http://localhost:8000/users/${id}`).then((res)=>{
      setUsers(res.data)
      setFilterUser(res.data)
      })
    }
  }
  const handleAddRecord = ()=>{
    setuserData({name:'',age:'',city:''})
    setIsModalOpen(true)
  }
  const handleData = (e)=>{
    setuserData({...userData,[e.target.name]:e.target.value})
  }
  const handleSubmit = async(e)=>{
    e.preventDefault()
    if(userData.id){
      await axios.patch(`http://localhost:8000/users/${userData.id}`,userData).then((res)=>{
      console.log(res);
      })
    } else {
      await axios.post('http://localhost:8000/users',userData).then((res)=>{
      console.log(res);
      })
    }
    closeModal()
    setuserData({name:'',age:'',city:''})
  }
  const handleRecordUpdate = (user)=>{
    setuserData(user)
    setIsModalOpen(true)
  }
  return ( 
    <>
    <div className="container">
        <h3>CRUD Application with React.js Frontend and Node.js Backend</h3>
        <div className="input-search">
          <input type="search" placeholder='Search Text Here' onChange={handleChange}/>
          <button className='btn green' onClick={handleAddRecord}>Add Record</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
           {filterUser && filterUser.map((user,index)=>{
            return (
              <tr key={user.id}>
              <td>{index+1}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.city}</td>
              <td><button className='btn green' onClick={()=>handleRecordUpdate(user)}>Edit</button></td>
              <td><button className="btn red" onClick={()=>handleDelete(user.id)}>Delete</button></td>
            </tr>
            )
          })}
          </tbody>
        </table>
        {isModalOpen && (
          <div className='modal'>
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>{userData.id?"Update record":"Add Record"}</h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" name='name' id='name' value={userData.name} onChange={handleData}/>
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input type="number" name='age' id='age' value={userData.age} onChange={handleData}/>
              </div>
              <div className="input-group">
                <label htmlFor="city">City </label>
                <input type="text" name='city' id='city' value={userData.city} onChange={handleData}/>
              </div>
              <button className='btn green' onClick={handleSubmit}>{userData.id?"Update record":"Add Record"}</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
export default App
