import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Button, Table } from 'react-bootstrap';

import axiosInstance from "utils/Axios";
import GridExample from "components/GridExample";
import Modal from "components/Modal";


const Main = () => {
  const modalRef = useRef();  
  const modalRef2 = useRef();  
  
  const [loading, setLoading] = useState(false);
  
  // 거래처유형
  const [optClientType, setOptClientType] = useState(null);
  const optClientTypeRef = useRef([]);  


  useEffect(()=>{
    console.log("useEffect");

    
    axiosInstance
    .post(`/api/getCodeDet`, JSON.stringify({group_code:'cd001'}))
    .then((res) => {
        setOptClientType(res.data);  
        optClientTypeRef.current = res.data;
        getData();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        modalRef.current.open({ title:"오류", message:error.response.data.message, cancelText:"" });
      });  
      
    
  },[]);


  // 그리드 레퍼
  const gridRef = useRef();  

  const typeFormatter = (params) => {
    const item = optClientTypeRef.current.find(el => el.code === params.value);
    // 못 찾으면 원래 코드 출력
    return item ? item.code_name : params.value; 
  };

  // 그리드 설정
  const [rowData, setRowData] = useState();
  const [columnDefs] = useState([
    { headerName: "거래처코드", field: "client_code", sortable: false, editable: false, filter: "agTextColumnFilter", align:"center" },
    { headerName: "거래처명", field: "client_name", sortable: true, editable: true, filter: "agTextColumnFilter",  align:"left"},
    { headerName: "거래처유형", field: "client_type", sortable: true, editable: true, align:"center", valueFormatter: typeFormatter},
    { headerName: "사업자등록번호", field: "business_no", sortable: true, editable: true, align:"center"},
    { headerName: "업태", field: "business_type", sortable: true, editable: true, align:"center"},
    { headerName: "업종", field: "business_item", sortable: true, editable: true, align:"center"},
    { headerName: "대표자", field: "ceo_name", sortable: true, editable: true, align:"left"},
    { headerName: "담당자", field: "contact_name", sortable: true, editable: true, align:"left"},
    { headerName: "연락처", field: "contact_phone", sortable: true, editable: true, align:"center"},
    { headerName: "팩스", field: "contact_fax", sortable: true, editable: true, align:"center"},
    { headerName: "이메일", field: "contact_email", sortable: true, editable: true, align:"center"},
    { 
      headerName: "사용여부", 
      field: "use_yn", 
      sortable: true, 
      editable: false,
      backgroundColor: "#a7d1ff29",
      align:"center",
      cellRenderer: 'agCheckboxCellRenderer',
      cellRendererParams: {
        disabled: false,
      },
       // Y/N 값을 true/false로 변환하여 체크박스 표시
      valueGetter: (params) => {
        return params.data.use_yn === 'Y';
      },

      // 체크박스 변경 시 true/false → Y/N 으로 반영
      valueSetter: (params) => {
        const newValue = params.newValue ? 'Y' : 'N';
        if (params.data.use_yn !== newValue) {
          params.data.use_yn = newValue;
          return true; // 값이 바뀐 경우만 true
        }
        return false; // 변경 없음
      },
    },
    { headerName: "비고", field: "comment", sortable: true, editable: true, align:"left", minWidth:300},
  ]);


  // 검색창 입력필드
  const [form, setForm] = useState({
    client_code:'',
    client_name:'',
    client_type:'',
    use_yn: '',
  });

  // 검색창 입력필드 변경 저장
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  // 추가 모달
  const DEFAULT_FORM2 = () => ({
      client_code : ''
    , client_name : ''
    , client_type : ''
    , business_no : ''
    , business_type : ''
    , business_item : ''
    , ceo_name : ''
    , contact_name : ''
    , contact_phone : ''
    , contact_fax : ''
    , contact_email : ''
    , address : ''
    , use_yn : ''
    , comment : ''
  });

  const formRef = useRef();

  const formRefChange = (name, value) => {
    formRef.current[name] = value;
  };

  const ModalForm = ({ form={}, onChangeHandler }) => {
    console.log("ModalForm2");

    const [modalForm, setModalForm] = useState(form);

    const modalFormChange = (e) => {
      const { name, value } = e.target;
      setModalForm(prev => ({ ...prev, [name]: value }));
      onChangeHandler(name, value);
    };

    return (
      <div className={"p-2"}>
        <Table bordered style={{ width: 'auto', tableLayout: 'auto' }} className="m-0">
          <tbody>
            
            <tr>
              <th className="bg-light text-end align-middle">거래처코드</th>
              <td>
                <Form.Control 
                  type="text"
                  name="client_code"
                  value={modalForm.client_code ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
              <th className="bg-light text-end align-middle">거래처명</th>
              <td>
                <Form.Control 
                  type="text"
                  name="client_name"
                  value={modalForm.client_name ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
            </tr>
           
            <tr>
              <th className="bg-light text-end align-middle">거래처유형</th>
              <td>
                <Form.Select 
                  name="client_type" 
                  value={modalForm.client_type} 
                  onChange={modalFormChange}
                  size="sm"
                  className="w-100"
                >
                  {(optClientType || []).map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.code_name}
                    </option>
                  ))}
                </Form.Select>
              </td>
              
              <th className="bg-light text-end align-middle">사업자등록번호</th>
              <td>
                <Form.Control 
                  type="text"
                  name="business_no"
                  value={modalForm.business_no ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
            </tr>

            <tr>
              <th className="bg-light text-end align-middle">업태</th>
              <td>
                <Form.Control 
                  type="text"
                  name="business_type"
                  value={modalForm.business_type ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
              <th className="bg-light text-end align-middle">업종</th>
              <td>
                <Form.Control 
                  type="text"
                  name="business_item"
                  value={modalForm.business_item ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
            </tr>
            <tr>
              <th className="bg-light text-end align-middle">대표자</th>
              <td>
                <Form.Control 
                  type="text"
                  name="ceo_name"
                  value={modalForm.ceo_name ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
              <th className="bg-light text-end align-middle">담당자</th>
              <td>
                <Form.Control 
                  type="text"
                  name="contact_name"
                  value={modalForm.contact_name ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
            </tr>
            <tr>
              <th className="bg-light text-end align-middle">연락처</th>
              <td>
                <Form.Control 
                  type="text"
                  name="contact_phone"
                  value={modalForm.contact_phone ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
              <th className="bg-light text-end align-middle">팩스</th>
              <td>
                <Form.Control 
                  type="text"
                  name="contact_fax"
                  value={modalForm.contact_fax ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
            </tr>
            <tr>
              <th className="bg-light text-end align-middle">이메일</th>
              <td>
                <Form.Control 
                  type="text"
                  name="contact_email"
                  value={modalForm.contact_email ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
              <th className="bg-light text-end align-middle">사용여부</th>
              <td>
                <Form.Select 
                  name="use_yn" 
                  value={modalForm.use_yn} 
                  onChange={modalFormChange}
                  size="sm"
                  className="w-100"
                >
                  <option value="y">사용</option>
                  <option value="n">미사용</option>
                </Form.Select>
              </td>
            </tr>

            <tr>
              <th className="bg-light text-end align-middle">주소</th>
              <td colSpan={3}>
                <Form.Control 
                  type="text"
                  name="address"
                  value={modalForm.address ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-100"
                />
              </td>
            </tr>

            <tr>
              <th className="bg-light text-end align-middle">비고</th>
              <td colSpan={3}>
                <Form.Control
                  type="text"
                  name="comment"
                  value={modalForm.comment ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-100"
                />
              </td>
              
            </tr>
          </tbody>
        </Table>
      </div>
    );
  };




  // 조회
  const getData = (params) => {
    console.log("getData");
    

    const data = {...form};

    setLoading(true);
    const startTime = Date.now(); // 요청 전 시간 기록
    axiosInstance
      .post(`/api/getClient`, JSON.stringify(data))
      .then((res) => {
        const endTime = Date.now(); // 응답 시간을 측정
        const responseTime = endTime - startTime; // 응답 시간 (밀리초)
        const delay = responseTime < 300 ? 300 - responseTime : 0; // 응답 시간이 남은 시간만큼 지연
        
        // 지연 후 응답을 출력
        setTimeout(async () => {
          setRowData(res.data);
          setLoading(false);
        }, delay);
          
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        modalRef.current.open({ title:"오류", message:error.response.data.message, cancelText:"" });
      });   
  };


  // 수정
  const setData = (params) => {
    console.log("setData");

    axiosInstance
      .post("api/setClient", JSON.stringify(params))
      .then((res) => {
     
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        modalRef.current.open({ title:"오류", message:error.response.data.message, cancelText:"" });
        getData();
      });   
  };


  // 추가
  const addData = (params) => {
    console.log("addData");

    console.log(form);
    // 폼 초기화

    formRef.current = DEFAULT_FORM2();
    formRef.current["parent_id"] = form.category_id;
    formRef.current["parent_nm"] = form.category_nm;

    modalRef.current.open({
      title: "거래처 추가",
      message: "추가하시겠습니까?",
      content: <ModalForm form={{parent_id:form.category_id, parent_nm:form.category_nm}} onChangeHandler={formRefChange} />,
      onCancel: ()=>{
        modalRef.current.close();
      },
      confirmText:"추가",
      confirmClass:"btn btn-success",
      onConfirm: (res) => {
        
        if(formRef.current.client_code === "" || formRef.current.client_code === undefined){
          modalRef2.current.open({ title:"알림", message:"거래처코드를 입력하세요.", cancelText:"" });
          return;
        }
        
        if(formRef.current.client_name === ""){
          modalRef2.current.open({ title:"알림", message:"거래처명을 입력하세요.", cancelText:"" });
          return;
        }
        
        axiosInstance
          .post(`/api/addClient`, JSON.stringify(formRef.current))
          .then((res) => {
            getData();
            modalRef.current.close();
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            modalRef.current.close();
            modalRef2.current.open({ title:"알림", message:error.response.data.message, cancelText:"" });
          });    

        

        
      }, 
    });

  };


  // 삭제
  const delData = (params) => {
    console.log("delData");
    
    const selectRows = gridRef.current.getSelectedRows();
    
    if(selectRows.length === 0) {
      modalRef.current.open({ title:"알림", message:"선택된 항목이 없습니다.", cancelText:"" });
      return;
    }
    
    // 모달 열기
    modalRef.current.open({
      title:"삭제",
      message:`선택된 행을 삭제하시겠습니까?`,
      confirmText:"삭제",
      confirmClass:"btn btn-danger",
      onCancel:()=>{
        modalRef.current.close();
      },
      onConfirm:(res) => {
        console.log(res);
        
        axiosInstance
          .post(`/api/delClient`, JSON.stringify(selectRows))
          .then((res) => {
            getData();
            modalRef.current.close();
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            modalRef.current.close();
            modalRef2.current.open({ title:"알림", message:error.response.data.message, cancelText:"" });
          });    
 
      },
    });
    
  };


  // 그리드 onGridReady
  const onGridReady = (params) => {
    gridRef.current = params.api; // Grid API 저장

    // 행 클릭 이벤트
    params.api.addEventListener("rowClicked", (ev) => {
      console.log(ev);
    });

    // 셀 값 변경 이벤트
    params.api.addEventListener("cellValueChanged", (ev) => {
      console.log("cellValueChanged");
      console.log(ev);
      setData(ev.data);
    });

    
    // 선택 변경 이벤트
    params.api.addEventListener("selectionChanged", (ev) => {
      console.log("selectionChanged");
      console.log(ev);

      const selectedRows = params.api.getSelectedRows();
      console.log(selectedRows);
    });

  };

  
  return (
    <div style={{ height: '87vh', display: 'flex', flexDirection: 'column' }}>
      <Modal ref={modalRef} />
      <Modal ref={modalRef2} />

      <div className="mb-2 bg-light">
        <Row className="">
          <Col className="d-flex gap-2">
            <Table bordered style={{ width: 'auto', tableLayout: 'auto' }} className="m-0">
              <tbody>
                <tr>
                  <th className="bg-light text-end align-middle">거래처코드</th>
                  <td className="">
                    <div className="d-flex gap-2">
                      <Form.Control 
                        type="text"
                        name="client_code"
                        value={form.client_code}
                        onChange={handleChange}
                        size="sm" 
                        className="w-auto"
                      />
                    </div>
                  </td>

                  <th className="bg-light text-end align-middle">거래처명</th>
                  <td className="">
                    <div className="d-flex gap-2">
                      <Form.Control 
                        type="text"
                        name="client_name"
                        value={form.client_name}
                        onChange={handleChange}
                        size="sm" 
                        className="w-auto"
                      />
                    </div>
                  </td>

                  <th className="bg-light text-end align-middle">거래처유형</th>
                  <td className="">
                    <div className="d-flex gap-2">
                      <Form.Select 
                        name="client_type" 
                        value={form.client_type} 
                        onChange={handleChange}
                        size="sm"
                        className="w-auto"
                      >
                        <option value="">전체</option>
                        {(optClientType || []).map((opt) => (
                          <option key={opt.code} value={opt.code}>
                            {opt.code_name}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </td>

                  <th className="bg-light text-end align-middle">사용여부</th>
                  <td className="">
                    
                    <Form.Select 
                      name="use_yn" 
                      value={form.use_yn} 
                      onChange={handleChange}
                      size="sm"
                      className="w-auto"
                    >
                      <option value="">전체</option>
                      <option value="y">사용</option>
                      <option value="n">미사용</option>
                    </Form.Select>
                  </td>
                  <td className="">
                    <Button size="sm" variant="primary" onClick={getData}><i className="bi bi-search"></i></Button>
                  </td>
                  
                </tr>

              </tbody>
            </Table>

          </Col>
        </Row>
      </div>

      <div className="h-100">
        <Row  className="h-100">
          <Col className="h-100 pe-0 d-flex flex-column" xs={12} md={12}>
            <div className="d-flex gap-2 justify-content-start align-items-center">
              <span className="fw-bold my-2">거래처 목록</span>
              <Button size="sm" variant="success" onClick={addData}>추가</Button>
              <Button size="sm" variant="danger" onClick={delData}>삭제</Button>
            </div>

            <GridExample
              columnDefs={columnDefs}
              rowData={rowData}
              onGridReady={onGridReady} 
              loading={loading}
              rowNum={true}
              rowSel={"multiRow"}
              pageSize={25}  
            />
          </Col>


        </Row>

      </div>


    </div>
  );
}

export default Main;




