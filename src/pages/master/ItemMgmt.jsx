import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Button, Table } from 'react-bootstrap';

import axiosInstance from "utils/Axios";
import GridExample from "components/GridExample";
import Modal from "components/Modal";


const Main = () => {
  const modalRef = useRef();  
  const modalRef2 = useRef();  


  // selectbox
  const selectBox = useRef({}); 

  // 검색창 입력필드
  const [form, setForm] = useState({
    item_type:'',
    item_group_a:'',
    item_group_b:'',
    use_yn: '',
    item_code:'',
    item_name:'',
    client_code:'',
    client_name:''
  });

  // 검색창 입력필드 변경 저장
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }; 


  // 추가모달 품목분류1 값 저장
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  };

  const prevGroup = usePrevious(form.item_group_a);

  // 추가모달 품목분류1 변경 감지
  useEffect(()=>{
    console.log("useEffect2");
    if (prevGroup !== form.item_group_a) {
      setForm(prev => ({
        ...prev,
        item_group_b: ''
      }));
    }
  },[form.item_group_a, prevGroup]);


  // grid cell code_name 변환
  const categoryAFormatter = (params) => {
    const arr_client_type = selectBox.current.category?.item_group_a || [];
    const item = arr_client_type.find(el => el.category_id === params.value);
    return item ? item.category_nm : params.value; 
  };

  // grid cell code_name 변환
  const categoryBFormatter = (params) => {
    console.log(params);
    const arr_client_type = selectBox.current.category?.item_group_b[params.data.item_group_a] || [];
    const item = arr_client_type.find(el => el.category_id === params.value);
    return item ? item.category_nm : params.value; 
  };

  // grid cell code_name 변환
  const commonTypeFormatter = (params, cd) => {
    const arr_client_type = selectBox.current.common?.[cd] || [];
    const item = arr_client_type.find(el => el.code === params.value);
    return item ? item.code_name : params.value; 
  };


  
  // 그리드 설정
  const gridRef = useRef();  
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(false);

  const col_a = [
    { headerName: "품목대분류", field: "item_group_a", sortable: true, editable: false, filter: "agTextColumnFilter",  align:"center",
      valueFormatter: (params) => categoryAFormatter(params),
    },
    { headerName: "품목소분류", field: "item_group_b", sortable: true, editable: false, filter: "agTextColumnFilter",  align:"center",
      valueFormatter: (params) => categoryBFormatter(params),
    },
    { headerName: "품목코드", field: "item_code", sortable: false, editable: false, filter: "agTextColumnFilter", align:"center" },
    { headerName: "품목명", field: "item_name", sortable: true, editable: true, filter: "agTextColumnFilter",  align:"left"},
    { headerName: "품목유형", field: "item_type", sortable: true, editable: true, filter: "agTextColumnFilter",  align:"center",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: selectBox.current.common?.['cd006'].map((item) => item.code) ?? [],
      },
      valueFormatter: (params) => commonTypeFormatter(params, 'cd006'),
    },
    { headerName: "기준단위", field: "base_unit", sortable: true, editable: true, filter: "agTextColumnFilter",  align:"center",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: selectBox.current.common?.['cd004'].map((item) => item.code) ?? [],
      },
      valueFormatter: (params) => commonTypeFormatter(params, 'cd004'),
    },
    { headerName: "거래처", field: "client_list", sortable: true, editable: true, filter: "agTextColumnFilter",  align:"left"},
    { headerName: "단가", field: "standard_price", sortable: true, editable: true, align:"right", 
      valueFormatter: (params) => {
        const value = parseFloat(params.value);
        return isNaN(value) ? '' : `${value.toLocaleString()}`;
      },
    },
    // { headerName: "기본창고", field: "default_warehouse", sortable: true, editable: true, align:"left"},
    { headerName: "검사방법", field: "inspection_method", sortable: true, editable: true, align:"center"},
    { headerName: "입고검사", field: "incoming_inspection", sortable: false, editable: true, align:"center", maxWidth:80,
      backgroundColor: "#a7d1ff29",
      cellRenderer: 'agCheckboxCellRenderer',
      cellRendererParams: {
        disabled: false,
      },
       // Y/N 값을 true/false로 변환하여 체크박스 표시
      valueGetter: (params) => {
        return params.data.incoming_inspection === 'Y';
      },

      // 체크박스 변경 시 true/false → Y/N 으로 반영
      valueSetter: (params) => {
        const newValue = params.newValue ? 'Y' : 'N';
        if (params.data.incoming_inspection !== newValue) {
          params.data.incoming_inspection = newValue;
          return true; // 값이 바뀐 경우만 true
        }
        return false; // 변경 없음
      },
    },
    { headerName: "출하검사", field: "outgoing_inspection", sortable: false, editable: true, align:"center", maxWidth:80,
      backgroundColor: "#a7d1ff29",
      cellRenderer: 'agCheckboxCellRenderer',
      cellRendererParams: {
        disabled: false,
      },
       // Y/N 값을 true/false로 변환하여 체크박스 표시
      valueGetter: (params) => {
        return params.data.outgoing_inspection === 'Y';
      },

      // 체크박스 변경 시 true/false → Y/N 으로 반영
      valueSetter: (params) => {
        const newValue = params.newValue ? 'Y' : 'N';
        if (params.data.outgoing_inspection !== newValue) {
          params.data.outgoing_inspection = newValue;
          return true; // 값이 바뀐 경우만 true
        }
        return false; // 변경 없음
      },
    },
    { headerName: "LOT관리", field: "lot_managed", sortable: false, editable: true, align:"center", maxWidth:80,
      backgroundColor: "#a7d1ff29",
      cellRenderer: 'agCheckboxCellRenderer',
      cellRendererParams: {
        disabled: false,
      },
       // Y/N 값을 true/false로 변환하여 체크박스 표시
      valueGetter: (params) => {
        return params.data.lot_managed === 'Y';
      },

      // 체크박스 변경 시 true/false → Y/N 으로 반영
      valueSetter: (params) => {
        const newValue = params.newValue ? 'Y' : 'N';
        if (params.data.lot_managed !== newValue) {
          params.data.lot_managed = newValue;
          return true; // 값이 바뀐 경우만 true
        }
        return false; // 변경 없음
      },
    },
    { headerName: "유통기한", field: "shelf_life_managed", sortable: false, editable: true, align:"center", maxWidth:80,
      backgroundColor: "#a7d1ff29",
      cellRenderer: 'agCheckboxCellRenderer',
      cellRendererParams: {
        disabled: false,
      },
       // Y/N 값을 true/false로 변환하여 체크박스 표시
      valueGetter: (params) => {
        return params.data.shelf_life_managed === 'Y';
      },

      // 체크박스 변경 시 true/false → Y/N 으로 반영
      valueSetter: (params) => {
        const newValue = params.newValue ? 'Y' : 'N';
        if (params.data.shelf_life_managed !== newValue) {
          params.data.shelf_life_managed = newValue;
          return true; // 값이 바뀐 경우만 true
        }
        return false; // 변경 없음
      },
    },
    { headerName: "유통기한일자", field: "shelf_life_days", sortable: true, editable: true, align:"center"},
    { 
      headerName: "사용여부", 
      field: "use_yn", 
      sortable: false, 
      editable: false,
      align:"center",
      maxWidth:80,
      backgroundColor: "#a7d1ff29",
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
  ];


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  // 초기화 selectbox list
  useEffect(()=>{
    console.log("useEffect");
    
    const init = {
      category: '',
      code: ['cd004', 'cd005', 'cd006']
    };

    axiosInstance
    .post(`/api/getDropDown`, JSON.stringify(init))
    .then((res) => {
        selectBox.current = res.data;

        setColumnDefs(col_a);

        getData();

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        modalRef.current.open({ title:"오류", message:error.response.data.message, cancelText:"" });
      });  

  },[]);



  // 추가 모달 기본값
  const DEFAULT_FORM = (init={}) => ({
      item_code : ''
    , item_name : ''
    , item_type : ''
    , item_group_a : ''
    , item_group_b : ''
    , base_unit : ''
    , purchase_unit : ''
    , default_warehouse : ''
    , inspection_method : ''
    , incoming_inspection : 'Y'
    , outgoing_inspection : 'Y'
    , standard_price : ''
    , shelf_life_days : ''
    , shelf_life_managed : 'Y'
    , lot_managed : 'Y'
    , use_yn : 'Y'
    , comment : ''
    , ...init
  });

  // 추가 모달 입력필드 저장
  const formRef = useRef();

  // 추가 모달 입력필드 변경
  const formRefChange = (name, value) => {
    formRef.current[name] = value;
  };

  // 추가 모달 컴포넌트
  const ModalForm = ({ form={}, onChangeHandler }) => {
    console.log("ModalForm");

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
              <th className="bg-light text-end align-middle">품목코드</th>
              <td>
                <Form.Control 
                  type="text"
                  name="item_code"
                  value={modalForm.item_code ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
              <th className="bg-light text-end align-middle">품목명</th>
              <td>
                <Form.Control 
                  type="text"
                  name="item_name"
                  value={modalForm.item_name ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
            </tr>

            <tr>
              <th className="bg-light text-end align-middle">품목유형</th>
              <td>
                <Form.Select 
                  name="item_type" 
                  value={modalForm.item_type} 
                  onChange={modalFormChange}
                  size="sm"
                  className="w-100"
                >
                  {(selectBox.current.common?.['cd006'] || [])
                    .filter(opt => opt.use_yn === 'Y')
                    .map(opt => (
                      <option key={opt.code} value={opt.code}>
                        {opt.code_name}
                      </option>
                  ))}
                </Form.Select>
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
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
                </Form.Select>
              </td>
            </tr>

            <tr>
              <th className="bg-light text-end align-middle">품목대분류</th>
              <td>
                <Form.Select 
                  name="item_group_a" 
                  value={modalForm.item_group_a} 
                  onChange={modalFormChange}
                  size="sm"
                  className="w-100"
                >
                  {(selectBox.current.category?.item_group_a || [])
                    .filter(opt => opt.use_yn === 'Y')
                    .map(opt => (
                      <option key={opt.category_id} value={opt.category_id}>
                        {opt.category_nm}
                      </option>
                  ))}
                </Form.Select>
              </td>
              <th className="bg-light text-end align-middle">품목소분류</th>
              <td>
                <Form.Select 
                  name="item_group_b" 
                  value={modalForm.item_group_b} 
                  onChange={modalFormChange}
                  size="sm"
                  className="w-100"
                >
                  {(selectBox.current.category?.['item_group_b'][formRef.current.item_group_a] || [])
                    .filter(opt => opt.use_yn === 'Y')
                    .map(opt => (
                      <option key={opt.category_id} value={opt.category_id}>
                        {opt.category_nm}
                      </option>
                  ))} 
                </Form.Select>
              </td>
            </tr>

            <tr>
              <th className="bg-light text-end align-middle">기준단위</th>
              <td>
                <Form.Select 
                  name="base_unit" 
                  value={modalForm.base_unit} 
                  onChange={modalFormChange}
                  size="sm"
                  className="w-100"
                >
                  {(selectBox.current.common?.['cd004'] || [])
                    .filter(opt => opt.use_yn === 'Y')
                    .map(opt => (
                      <option key={opt.code} value={opt.code}>
                        {opt.code_name}
                      </option>
                  ))} 
                </Form.Select>
              </td>
              <th className="bg-light text-end align-middle">단가</th>
              <td>
                <Form.Control 
                  type="number"
                  name="standard_price"
                  value={modalForm.standard_price ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
                />
              </td>
            </tr>

            <tr>
              <th className="bg-light text-end align-middle">검사방법</th>
              <td>
                <Form.Select 
                  name="inspection_method" 
                  value={modalForm.inspection_method} 
                  onChange={modalFormChange}
                  size="sm"
                  className="w-100"
                >
                  {(selectBox.current.common?.['cd005'] || [])
                    .filter(opt => opt.use_yn === 'Y')
                    .map(opt => (
                      <option key={opt.code} value={opt.code}>
                        {opt.code_name}
                      </option>
                  ))}  
                </Form.Select>
              </td>
              <th className="bg-light text-end align-middle"></th>
              <td>
                
              </td>
            </tr>

            <tr>
              <th className="bg-light text-end align-middle">입고검사</th>
              <td>
                <Form.Select 
                  name="incoming_inspection" 
                  value={modalForm.incoming_inspection} 
                  onChange={modalFormChange}
                  size="sm"
                  className="w-100"
                >
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
                </Form.Select>
              </td>
              <th className="bg-light text-end align-middle">출하검사</th>
              <td>
                <Form.Select 
                  name="outgoing_inspection" 
                  value={modalForm.outgoing_inspection} 
                  onChange={modalFormChange}
                  size="sm"
                  className="w-100"
                >
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
                </Form.Select>
              </td>
            </tr>

            <tr>
              <th className="bg-light text-end align-middle">유통기한</th>
              <td>
                <Form.Select 
                  name="shelf_life_managed" 
                  value={modalForm.shelf_life_managed} 
                  onChange={modalFormChange}
                  size="sm"
                  className="w-100"
                >
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
                </Form.Select>
              </td>
              <th className="bg-light text-end align-middle">유통기한일자</th>
              <td>
                <Form.Control 
                  type="number"
                  name="shelf_life_days"
                  value={modalForm.shelf_life_days ?? ''}
                  onChange={modalFormChange}
                  size="sm" 
                  className="w-auto"
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
            <tr>
              <th className="bg-light text-end align-middle">파일첨부</th>
              <td colSpan={3}>
                <Form.Control
                  type="file"
                  name="item_img"
                  value={modalForm.item_img ?? ''}
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

    setLoading(true);

    axiosInstance
      .post(`/api/getItem`, JSON.stringify(form))
      .then((res) => {
        setRowData(res.data);
        
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        modalRef.current.open({ title:"오류", message:error.response.data.message, cancelText:"" });
      })
      .finally(() =>{
        setLoading(false);
      });
  };


  // 수정
  const setData = (params) => {
    console.log("setData");

    axiosInstance
      .post("api/setItem", JSON.stringify(params))
      .then((res) => {
        
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        modalRef.current.open({ title:"오류", message:error.response.data.message, cancelText:"" });
      });   
  };


  // 추가
  const addData = (params) => {
    console.log("addData");

    // 폼 초기화
    formRef.current = DEFAULT_FORM({
      item_group_a: selectBox.current.category.item_group_a[0].category_id,
      base_unit: selectBox.current.common['cd004'][0].code ,
      inspection_method: selectBox.current.common['cd005'][0].code ,
      item_type: selectBox.current.common['cd006'][0].code ,
    });

    modalRef.current.open({
      title: "품목 추가",
      message: "추가하시겠습니까?",
      content: <ModalForm form={formRef.current} onChangeHandler={formRefChange} />,
      onCancel: ()=>{
        modalRef.current.close();
      },
      confirmText:"추가",
      confirmClass:"btn btn-success",
      onConfirm: (res) => {
        console.log(formRef.current);

        if(formRef.current.item_code === "" || formRef.current.item_code === undefined){
          modalRef2.current.open({ title:"알림", message:"품목코드를 입력하세요.", cancelText:"" });
          return;
        }
        
        if(formRef.current.item_name === ""){
          modalRef2.current.open({ title:"알림", message:"품목명을 입력하세요.", cancelText:"" });
          return;
        }

        if(formRef.current.standard_price === ""){
          modalRef2.current.open({ title:"알림", message:"단가를 입력하세요.", cancelText:"" });
          return;
        }

        axiosInstance
          .post(`/api/addItem`, JSON.stringify(formRef.current))
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
          .post(`/api/delItem`, JSON.stringify(selectRows))
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
          <Col className="">
            <Table bordered hover style={{ width: 'auto', tableLayout: 'auto' }} className="m-0">
              <tbody>
                <tr>
                  <th className="bg-light text-end align-middle">품목유형</th>
                  <td className="">
                    <div className="d-flex gap-2">
                      <Form.Select 
                        name="item_type" 
                        value={form.item_type} 
                        onChange={handleChange}
                        size="sm"
                        className="w-auto"
                        style={{minWidth:100}}
                      >
                        <option value="">전체</option>
                        {(selectBox.current.common?.['cd006'] || [])
                          .filter(opt => opt.use_yn === 'Y')
                          .map(opt => (
                            <option key={opt.code} value={opt.code}>
                              {opt.code_name}
                            </option>
                        ))}
                      </Form.Select>               
                    </div>
                  </td>
                  <th className="bg-light text-end align-middle">품목분류</th>
                  <td className="">
                    <div className="d-flex gap-2">
                      <Form.Select 
                        name="item_group_a" 
                        value={form.item_group_a} 
                        onChange={handleChange}
                        size="sm"
                        className="w-auto"
                        style={{minWidth:100}}
                      >
                        <option value="">전체</option>
                        {(selectBox.current.category?.item_group_a || [])
                          .filter(opt => opt.use_yn === 'Y')
                          .map(opt => (
                            <option key={opt.category_id} value={opt.category_id}>
                              {opt.category_nm}
                            </option>
                        ))}
                      </Form.Select>
                      <Form.Select 
                        name="item_group_b" 
                        value={form.item_group_b} 
                        onChange={handleChange}
                        size="sm"
                        className="w-auto"
                        style={{minWidth:100}}
                      >
                        <option value="">전체</option>
                        {(selectBox.current.category?.['item_group_b'][form.item_group_a] || [])
                          .filter(opt => opt.use_yn === 'Y')
                          .map(opt => (
                            <option key={opt.category_id} value={opt.category_id}>
                              {opt.category_nm}
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
                      style={{minWidth:100}}
                    >
                      <option value="">전체</option>
                      <option value="y">사용</option>
                      <option value="n">미사용</option>
                    </Form.Select>
                  </td>
                </tr>
              </tbody>
            </Table>

            <Table bordered hover style={{ width: 'auto', tableLayout: 'auto' }} className="m-0">
              <tbody>
                <tr>
                  <th className="bg-light text-end align-middle">품목</th>
                  <td className="">
                    <div className="d-flex gap-2">
                      <Form.Control 
                        type="text"
                        name="item_code"
                        value={form.item_code}
                        onChange={handleChange}
                        size="sm" 
                        className="w-auto"
                        placeholder="CODE"
                      />
                      <Form.Control 
                        type="text"
                        name="item_name"
                        value={form.item_name}
                        onChange={handleChange}
                        size="sm" 
                        className="w-auto"
                        placeholder="NAME"
                      />
                    </div>
                  </td>
                  <td className="">
                    <Button size="sm" variant="primary" onClick={getData}><i className="bi bi-search"></i></Button>
                  </td>

                  <th className="bg-light text-end align-middle">거래처</th>
                  <td className="">
                    <div className="d-flex gap-2">
                      <Form.Control 
                        type="text"
                        name="client_code"
                        value={form.client_code}
                        onChange={handleChange}
                        size="sm" 
                        className="w-auto"
                        placeholder="CODE"
                      />
                      <Form.Control 
                        type="text"
                        name="client_name"
                        value={form.client_name}
                        onChange={handleChange}
                        size="sm" 
                        className="w-auto"
                        placeholder="NAME"
                      />
                    </div>
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
          <Col className="h-100 d-flex flex-column" xs={12} md={12}>
            <div className="d-flex gap-2 justify-content-start align-items-center">
              <span className="fw-bold my-2">품목 리스트</span>
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
              pageSize={15}  
            />
          </Col>


        </Row>

      </div>


    </div>
  );
}

export default Main;




