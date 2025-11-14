import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePolicy } from '../../hooks/usePolicy'
import {
    Spinner,
    Container,
    Card,
    Form,
    Button,
    Row,
    Col,
    Modal
} from 'react-bootstrap';
import { PolicyResponse } from '../../models/PolicyModel';
import { toast } from 'react-toastify';


const AdminConfigDetail = () => {
    const { policyId } = useParams<{ policyId: string }>()
    const isCreateMode = !policyId;
    const { policy, error, isLoading, loadPolicyById, setPolicyById, deletePolicyById, createPolicy } = usePolicy();
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleCloseModal = () => setShowConfirmModal(false);
    const handleShowModal = () => setShowConfirmModal(true);

    const handleConfirmDelete = async () => {
        handleCloseModal();

        const toastId = toast.loading("Đang xóa...");
        try {
            const data = await deletePolicyById(Number(policyId));
            toast.update(toastId, {
                render: data?.message,
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });


            navigate(-1);

        } catch (error: any) {
            toast.update(toastId, { render: "Xóa thất bại", type: "error" });
        }
    };

    useEffect(() => {
        if (!isCreateMode && policyId) {
            loadPolicyById(Number(policyId));
        }
    }, [isCreateMode, loadPolicyById, policyId]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Đang tải dữ liệu...</span>
            </div>
        );
    }

    if (error) {
        return <div className='d-flex justify-content-center align-items-center'>Không thể tải được thông tin điều khoản</div>;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const updatedData: PolicyResponse = {
            policyId: Number(policyId) || 0,
            policyType: policy?.policyType! || String(formData.get('policyType')),
            description: String(formData.get('description')),
            value: Number(formData.get('value')),
            status: String(formData.get('status')),
            appliedScope: String(formData.get('appliedScope')),
        };

        const toastId = toast.loading("Đang cập nhật cấu hình...", {
            position: "top-right",
        });

        try {
            if (isCreateMode) {
                const res = await createPolicy();
                if (res?.success) {
                    toast.update(toastId, {
                        render: res.message,
                        type: "success",
                        isLoading: false,
                        autoClose: 3000,
                    })
                } else {
                    toast.update(toastId, {
                        render: res?.message,
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    })
                }
            } else {

                const res = await setPolicyById(Number(policyId), updatedData);
                if (res?.success) {

                    toast.update(toastId, {
                        render: res?.message,
                        type: "success",
                        isLoading: false,
                        autoClose: 3000,
                    });
                } else {
                    toast.update(toastId, {
                        render: res?.err,
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    })
                }
            }
            setTimeout(() => navigate(-1), 1000);
        } catch (error: any) {
            toast.update(toastId, {
                render: `Cập nhật thất bại: ${error.message || 'Lỗi không xác định'}`,
                type: "error",
                isLoading: false,
                autoClose: 5000,
            });
        }
    };
    return (
        <Container className='my-4'>
            <Card>
                <Card.Header>
                    <h2>{isCreateMode ? 'Tạo mới Cấu hình (Policy)' : 'Chi tiết Cấu hình'}</h2>
                </Card.Header>
                <Card.Body>
                    <Form key={policy?.policyId || 'create'} onSubmit={handleSubmit}>

                        {/* LỖI 1: Chỉ hiển thị ID khi KHÔNG phải tạo mới */}
                        {!isCreateMode && (
                            <Form.Group as={Row} className="mb-3" controlId="formPolicyId">
                                <Form.Label column sm={3}>
                                    Policy ID
                                </Form.Label>
                                <Col sm={5}>
                                    <Form.Control
                                        type="text"
                                        defaultValue={policy?.policyId}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        )}

                        {/* LỖI 2: Phải cho phép nhập khi tạo mới */}
                        <Form.Group as={Row} className="mb-3" controlId="formPolicyType">
                            <Form.Label column sm={3}>
                                Tên cấu hình (Key)
                            </Form.Label>
                            <Col sm={5}>
                                <Form.Control
                                    type="text"
                                    name="policyType"
                                    defaultValue={policy?.policyType || ''}
                                    disabled={!isCreateMode} 
                                    placeholder='Policy Type'
                                    required
                                />
                            </Col>
                        </Form.Group>

                        {/* LỖI 3: Thêm giá trị mặc định cho chế độ Create */}
                        <Form.Group as={Row} className="mb-3" controlId="formDescription">
                            <Form.Label column sm={3}>
                                Mô tả
                            </Form.Label>
                            <Col sm={5}>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="description"
                                    defaultValue={policy?.description || ''} // <-- Sửa
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formValue">
                            <Form.Label column sm={3}>
                                Giá trị
                            </Form.Label>
                            <Col sm={5}>
                                <Form.Control
                                    type="text"
                                    name="value"
                                    defaultValue={policy?.value || ''} // <-- Sửa
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formAppliedScope">
                            <Form.Label column sm={3}>
                                Phạm vi
                            </Form.Label>
                            <Col sm={5}>
                                <Form.Select
                                    name="appliedScope"
                                    defaultValue={policy?.appliedScope || 'GLOBAL'}
                                >
                                    <option value="GLOBAL">GLOBAL</option>
                                    <option value="LOCAL">LOCAL</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formStatus">
                            <Form.Label column sm={3}>
                                Trạng thái
                            </Form.Label>
                            <Col sm={5}>
                                <Form.Select
                                    name="status"
                                    defaultValue={policy?.status || 'ACTIVE'}
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        {/* LỖI 4: Sửa lại các nút bấm */}
                        <Row className="mt-4">
                            <Col sm={{ span: 5, offset: 3 }}>
                                {/* Nút Submit động */}
                                <Button variant="primary" type="submit">
                                    {isCreateMode ? 'Tạo mới' : 'Lưu thay đổi'}
                                </Button>

                                {/* Chỉ hiển thị nút Xóa khi Update */}
                                {!isCreateMode && (
                                    <Button
                                        variant="danger"
                                        className="ms-2"
                                        onClick={handleShowModal}
                                    >
                                        Xóa
                                    </Button>
                                )}

                                {/* Nút Quay lại */}
                                <Button
                                    variant="secondary"
                                    className="ms-2"
                                    onClick={() => navigate(-1)}
                                >
                                    Quay lại
                                </Button>
                            </Col>
                        </Row>

                    </Form>
                </Card.Body>
            </Card>

            {/* Modal không cần sửa, vì nó chỉ được gọi khi !isCreateMode */}
            <Modal show={showConfirmModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận Xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa policy này không?
                    <br />
                    (Policy: <strong>{policy?.policyType}</strong>)
                    <br />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Xác nhận Xóa
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    )
}

export default AdminConfigDetail
