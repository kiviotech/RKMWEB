import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./CustomizeCategories.scss";

const CustomizeCategories = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([
    {
      id: "1",
      name: "General Visitors/ Devotees",
      type: "input",
    },
    {
      id: "2",
      name: "Maintenance Staff/Workers/Helpers",
      type: "input",
    },
    {
      id: "3",
      name: "Monks/Sadhus",
      type: "input",
    },
    {
      id: "4",
      name: "Poor People/Widow Mothers",
      type: "input",
    },
    {
      id: "5",
      name: "Guest House",
      type: "guesthouse",
      hasMultipleSelects: true,
    },
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategories(items);
  };

  return (
    <div className={`customize-modal ${isOpen ? "open" : ""}`}>
      <div className="customize-content">
        <h2>Customize Categories</h2>

        <div className="categories-section">
          <h3 style={{ textAlign: "left" }}>Existing Categories</h3>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {categories.map((category, index) => (
                    <Draggable
                      key={category.id}
                      draggableId={category.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="category-row"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div
                            className="drag-handle"
                            {...provided.dragHandleProps}
                          >
                            ⋮⋮
                          </div>
                          <span
                            style={{
                              width: "50%",
                              padding: "10px",
                              borderRadius: "5px",
                              border: "2px solid #eee",
                              backgroundColor: "#fff",
                              wordBreak: "break-word",
                            }}
                          >
                            {category.name}
                          </span>
                          {category.hasMultipleSelects ? (
                            <div
                              style={{ width: "37%" }}
                              className="select-group"
                            >
                              <select
                                defaultValue="fetch"
                                style={{
                                  width: "100%",
                                  border: "1.5px solid #000",
                                  padding: "12px",
                                }}
                              >
                                <option value="fetch">Fetch Data</option>
                              </select>
                              <select
                                defaultValue="booking"
                                style={{
                                  width: "100%",
                                  border: "1.5px solid #000",
                                }}
                              >
                                <option value="booking">GH Booking</option>
                              </select>
                            </div>
                          ) : (
                            <div style={{ width: "37%" }}>
                              <select
                                defaultValue="input"
                                style={{
                                  border: "1.5px solid #000",
                                  width: "45%",
                                  padding: "12px",
                                }}
                              >
                                <option value="input">Input</option>
                              </select>
                            </div>
                          )}
                          <div
                            style={{
                              width: "10%",
                              display: "flex",
                              justifyContent: "space-evenly",
                              alignItems: "center",
                            }}
                            className="actions"
                          >
                            <button className="edit-btn">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#E97705"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ borderBottom: "2px solid #E97705" }}
                              >
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                              </svg>
                            </button>
                            <button className="delete-btn">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#DE002E"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <button className="add-field-btn">+ Add Field</button>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeCategories;
