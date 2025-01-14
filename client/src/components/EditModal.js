import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditModal = ({ show, onClose, onSave, data, onChange, fields }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Редагувати дані</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {fields.map((field) => (
                        <Form.Group className="mb-3" key={field.name}>
                            <Form.Label>{field.label}</Form.Label>
                            {field.type === "select" ? (
                                <Form.Select
                                    value={data[field.name] || ""}
                                    onChange={(e) =>
                                        onChange({ ...data, [field.name]: e.target.value })
                                    }
                                >
                                    <option value="">Оберіть {field.label.toLowerCase()}</option>
                                    {field.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            ) : (
                                <Form.Control
                                    type={field.type || "text"}
                                    value={data[field.name] || ""}
                                    onChange={(e) =>
                                        onChange({ ...data, [field.name]: e.target.value })
                                    }
                                />
                            )}
                        </Form.Group>
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Скасувати
                </Button>
                <Button variant="primary" onClick={() => onSave(data)}>
                    Зберегти
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditModal;
