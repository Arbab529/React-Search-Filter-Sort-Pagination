import axios from 'axios';
import { useEffect, useState } from 'react'
import { MDBTable, MDBTableHead, MDBTableBody, MDBRow, MDBCol, MDBContainer, MDBBadge, MDBBtnGroup, MDBBtn, MDBPagination, MDBPaginationLink, MDBPaginationItem } from 'mdb-react-ui-kit';
import { render } from 'react-dom';

function App() {

  //! Hooks
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [count, setCount] = useState(0);
  const pageLimit = 5;

  useEffect(() => {
    loadData(0, 4, 0);
  }, [count]);

  let sortOptions = ["name", "address", "email", "phone", "status"]

  //! Functions
  const loadData = async (start, end, incr) => {
    await axios.get(`http://localhost:30/users?_start=${start}&_end=${end}`)
      .then(response => {
        setToggle(true)
        setData(response.data)
        setCurrentPage(currentPage + incr)
      })
      .catch(e => console.log(e.message))

  }
  const handleSearch = async (e) => {
    e.preventDefault();
    return await axios.get(`http://localhost:30/users?q=${searchValue}`)
      .then((response) => {
        setData(response.data)
        setSearchValue('')
        setToggle(false)
      })
      .catch((e) => {
        console.log(e.message);
      })
  }
  const handleReset = () => {
    setCount(count + 1)
    loadData(0, 4, 0);

  }
  const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value);
    return await axios.get(`http://localhost:30/users?_sort=${value}&_order=asc`)
      .then((response) => {
        setData(response.data)
        setToggle(false)
      })
      .catch((e) => {
        console.log(e.message);
      })
  }
  const handleFilter = async (value) => {
    return await axios.get(`http://localhost:30/users?status=${value}`)
      .then((response) => {
        setData(response.data)
        setToggle(false)
      })
      .catch((e) => {
        console.log(e.message);
      })
  }
  const renderPagination = () => {
    if (currentPage === 0) {
      return (
        <MDBPagination className='my-4'>
          <MDBPaginationItem className='mx-3'>
            <MDBPaginationItem>{currentPage + 1}</MDBPaginationItem>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadData(4, 8, 1)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      )
    } else if (currentPage < pageLimit - 1) {
      return (
        <MDBPagination className='my-4'>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadData((currentPage - 1) * 4, currentPage * 4, -1)}>Previous</MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem className='mx-3'>
            <MDBPaginationItem>{currentPage + 1}</MDBPaginationItem>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadData((currentPage + 1) * 4, (currentPage + 2) * 4, 1)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination >
      )
    } else {
      return (
        <MDBPagination className='my-4'>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadData((currentPage - 1) * 4, currentPage * 4, -1)}>Previous</MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem className='mx-3'>
            <MDBPaginationItem>{currentPage + 1}</MDBPaginationItem>
          </MDBPaginationItem>
        </MDBPagination>
      )
    }
  }

  return (
    <MDBContainer>
      <form
        style={{
          margin: "30px auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center"
        }}
        className='d-flex input-group w-auto'
        onSubmit={handleSearch}
      >
        <input type="text" className='form-control' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        <MDBBtn type='submit' color='dark' >Search</MDBBtn>
        <MDBBtn type='submit' color='info' onClick={() => handleReset()}>Reset</MDBBtn>
      </form>
      <div>
        <h2 className='text-center'>Search, Filter, Sort, Pagination Using JSON Fake Rest API</h2>
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope='col'>No</th>
                  <th scope='col'>Name</th>
                  <th scope='col'>Email</th>
                  <th scope='col'>Phone</th>
                  <th scope='col'>Address</th>
                  <th scope='col'>Status</th>
                </tr>
              </MDBTableHead>
              {
                data.lenght === 0 ? (
                  <MDBTableBody className='align-center mb-0'>
                    <tr>
                      <td colSpan={6} className='text-center mb-0'>No Data Found</td>
                    </tr>
                  </MDBTableBody>
                ) : (
                  data.map((item, index) => (
                    <MDBTableBody key={index}>
                      <tr>
                        <td scope='col'>{item.id}</td>
                        <td scope='col'>{item.name}</td>
                        <td scope='col'>{item.email}</td>
                        <td scope='col'>{item.phone}</td>
                        <td scope='col'>{item.address}</td>
                        <td scope='col'>
                          <MDBBadge color={item.status === "active" ? 'success' : 'danger'} pill className='p-2'>
                            {item.status}
                          </MDBBadge>
                        </td>
                      </tr>
                    </MDBTableBody>
                  ))
                )
              }

            </MDBTable>
          </MDBCol>
        </MDBRow>
      </div>
      <MDBRow style={{
      }}>
        {toggle ? renderPagination() : ''}
      </MDBRow>
      <MDBRow className='mb-5'>
        <MDBCol size="8">
          <h5>Sort By</h5>
          <select style={{ width: "50%", borderRadius: "5px", height: "35px" }} onChange={handleSort} value={sortValue}>
            <option>Please Select Value</option>
            {sortOptions.map((value, index) => (
              <option value={value} key={index}>{value}</option>
            ))}
          </select>
        </MDBCol>
        <MDBCol size="4">
          <h5>Filter By Status</h5>
          <MDBBtnGroup>
            <MDBBtn color='success' onClick={() => handleFilter("active")}>Active</MDBBtn>
            <MDBBtn color='danger' onClick={() => handleFilter("inactive")}>In Active</MDBBtn>
          </MDBBtnGroup>
        </MDBCol>
      </MDBRow>
    </MDBContainer >
  )
}

export default App
