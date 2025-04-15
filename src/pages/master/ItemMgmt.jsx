import React, { useState, useRef } from "react";
import { Row, Col, Form, Button, Table } from 'react-bootstrap';

import axiosInstance from "utils/Axios";
import GridExample from "components/GridExample";
import Modal from "components/Modal";


const Main = () => {
  const modalRef = useRef();  
  const modalRef2 = useRef();  

  const [loading, setLoading] = useState(false);

  // 대분류 그리드 레퍼
  const gridRef = useRef();  

  // 소분류 그리드 래퍼
  const gridRef2 = useRef();

  // 대분류 행 선택값
  const [selectedRow, setSelectedRow] = useState(0); 
    
  // 대분류 그리드 설정
  const [rowData, setRowData] = useState();
  const [columnDefs] = useState([
    { headerName: "소분류코드", field: "category_id", sortable: false, editable: false, filter: "agTextColumnFilter", align:"center" },
    { headerName: "소분류명", field: "category_nm", sortable: true, editable: true, filter: "agTextColumnFilter",  align:"left"},
    { headerName: "정렬", field: "sort", sortable: true, editable: true, align:"right"},
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
        return params.data.use_yn === 'y';
      },

      // 체크박스 변경 시 true/false → Y/N 으로 반영
      valueSetter: (params) => {
        const newValue = params.newValue ? 'y' : 'n';
        if (params.data.use_yn !== newValue) {
          params.data.use_yn = newValue;
          return true; // 값이 바뀐 경우만 true
        }
        return false; // 변경 없음
      },
    },
    { headerName: "비고", field: "comment", sortable: true, editable: true, align:"left"},
  ]);


  // 검색창 입력필드
  const [form, setForm] = useState({
    category1:'',
    category2:'',
    category_id: '',
    category_nm: '',
    std: '',
    use_yn: '',
    client_id:'',
    client_nm:''
  });

  // 검색창 입력필드 변경 저장
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  // 소분류 추가 모달
  const DEFAULT_FORM2 = () => ({
    category_id:'',
    category_nm:'',
    sort: '',
    use_yn: '',
    comment: '',
    parent_id: '',
    parent_nm: '',
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
              <th className="bg-light text-end align-middle">대분류코드</th>
              <td>
                <Form.Control 
                  type="text"
                  name="parent_id"
                  value={modalForm.parent_id ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                  disabled
                />
              </td>
              <th className="bg-light text-end align-middle">대분류명</th>
              <td>
                <Form.Control 
                  type="text"
                  name="parent_nm"
                  value={modalForm.parent_nm ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                  disabled
                />
              </td>
            </tr>
            <tr>
              <th className="bg-light text-end align-middle">소분류코드</th>
              <td>
                <Form.Control 
                  type="text"
                  name="category_id"
                  value={modalForm.category_id ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
              <th className="bg-light text-end align-middle">소분류명</th>
              <td>
                <Form.Control 
                  type="text"
                  name="category_nm"
                  value={modalForm.category_nm ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
            </tr>
            <tr>
              <th className="bg-light text-end align-middle">정렬</th>
              <td>
                <Form.Control 
                  type="number"
                  name="sort"
                  value={modalForm.sort ?? ''}
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




  // 소분류 조회
  const getData = (params) => {
    console.log("getData");

    setForm({...params});
    setLoading(true);

    const startTime = Date.now(); // 요청 전 시간 기록
    axiosInstance
      .post(`/api/getCategoryDet`, JSON.stringify(params))
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


  // 소분류 수정
  const setData = (params) => {
    console.log("setData");

    axiosInstance
      .post("api/setCategory", JSON.stringify(params))
      .then((res) => {
        const selectedRows = gridRef.current.getSelectedRows();
        if( selectedRows.length > 0 ){
          getData(selectedRows[0]);
        };
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        modalRef.current.open({ title:"오류", message:error.response.data.message, cancelText:"" });
      });   
  };


  // 소분류 추가
  const addData = (params) => {
    console.log("addData");

    console.log(form);
    // 폼 초기화

    formRef.current = DEFAULT_FORM2();
    formRef.current["parent_id"] = form.category_id;
    formRef.current["parent_nm"] = form.category_nm;

    modalRef.current.open({
      title: "소분류 추가",
      message: "추가하시겠습니까?",
      content: <ModalForm form={{parent_id:form.category_id, parent_nm:form.category_nm}} onChangeHandler={formRefChange} />,
      onCancel: ()=>{
        modalRef.current.close();
      },
      confirmText:"추가",
      confirmClass:"btn btn-success",
      onConfirm: (res) => {
        
        if(formRef.current.category_id === "" || formRef.current.category_id === undefined){
          modalRef2.current.open({ title:"알림", message:"분류코드를 입력하세요.", cancelText:"" });
          return;
        }
        
        if(formRef.current.category_nm === ""){
          modalRef2.current.open({ title:"알림", message:"분류명을 입력하세요.", cancelText:"" });
          return;
        }
        
        // 소분류 아이디 조합
        formRef.current["category_id"] = formRef.current["parent_id"] + '-' + formRef.current["category_id"];
        console.log(formRef.current);

        axiosInstance
          .post(`/api/addCategory`, JSON.stringify(formRef.current))
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


  // 소분류 삭제
  const delData = (params) => {
    console.log("delData");
    
    const selectRows = gridRef2.current.getSelectedRows();
    
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
          .post(`/api/delCategory`, JSON.stringify(selectRows))
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


  // 소분류 그리드 onGridReady
  const onGridReady = (params) => {
    gridRef2.current = params.api; // Grid API 저장

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
                  <th className="bg-light text-end align-middle">품목분류</th>
                  <td className="">
                    <div className="d-flex gap-2">
                      <Form.Select 
                        name="category_id" 
                        value={form.category_id} 
                        onChange={handleChange}
                        size="sm"
                        className="w-auto"
                      >
                        <option value="">전체</option>
                      </Form.Select>
                      <Form.Select 
                        name="category_nm" 
                        value={form.category_nm} 
                        onChange={handleChange}
                        size="sm"
                        className="w-auto"
                      >
                        <option value="">전체</option>
                      </Form.Select>
                      
                    </div>
                  </td>
                  <th className="bg-light text-end align-middle">규격</th>
                  <td className="">
                    <div className="d-flex gap-2">
                      <Form.Control 
                        type="text"
                        name="std"
                        value={form.std}
                        onChange={handleChange}
                        size="sm" 
                        className="w-100"
                      />
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
                    
                  
                </tr>

                <tr>
                  <th className="bg-light text-end align-middle">품목</th>
                  <td className="">
                    <div className="d-flex gap-2">
                      <Form.Control 
                        type="text"
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        size="sm" 
                        className="w-auto"
                        placeholder="CODE"
                      />
                      <Form.Control 
                        type="text"
                        name="category_nm"
                        value={form.category_nm}
                        onChange={handleChange}
                        size="sm" 
                        className="w-auto"
                        placeholder="NAME"
                      />
                      <Button size="sm" variant="secondary" onClick={getData}>검색</Button>
                    </div>
                  </td>

                  <th className="bg-light text-end align-middle">거래처</th>
                  <td className="">
                    <div className="d-flex gap-2">
                      <Form.Control 
                        type="text"
                        name="client_id"
                        value={form.client_id}
                        onChange={handleChange}
                        size="sm" 
                        className="w-auto"
                        placeholder="CODE"
                      />
                      <Form.Control 
                        type="text"
                        name="client_nm"
                        value={form.client_nm}
                        onChange={handleChange}
                        size="sm" 
                        className="w-auto"
                        placeholder="NAME"
                      />
                      <Button size="sm" variant="secondary" onClick={getData}>검색</Button>

                    </div>
                
                  </td>

                  <th className="bg-light text-end align-middle"></th>
                  <td className="">
                    
                  </td>
                  
                    
                  
                </tr>
                
              </tbody>
            </Table>

          </Col>
        </Row>
      </div>

      <div className="h-100">
        <Row  className="h-100">
          <Col className="h-100 d-flex flex-column" xs={12} md={12}>
            <div className="d-flex gap-2 justify-content-start align-items-center">
              <span className="fw-bold my-2">품목 대분류</span>
              <Button size="sm" variant="success" onClick={addData}>추가</Button>
              <Button size="sm" variant="danger" onClick={delData}>삭제</Button>
            </div>

            {/* <GridExample 
              columnDefs={columnDefs}
              rowData={rowData}
              onGridReady={onGridReady} 
              loading={loading}
              rowNum={true}
              rowSel={"singleRow"}
            /> */}

            <GridExample
              columnDefs={columnDefs}
              rowData={rowData}
              onGridReady={onGridReady} 
              loading={loading}
              rowNum={true}
              rowSel={"multiRow"}
              pageSize={15}  
            />
          </Col>


        </Row>

      </div>


    </div>
  );
}

export default Main;




