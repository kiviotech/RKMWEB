import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./CustomizeCategories.scss";
import {
  fetchFoods,
  updateFoodById,
  deleteFoodById,
} from "../../../../services/src/services/foodService";
import { createNewFood } from "../../../../services/src/services/foodService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useCouponStore from "../../../../useCouponStore";

const CATEGORY_ORDER_KEY = "categoryOrder";

const CustomizeCategories = ({ isOpen, onClose, onSave }) => {
  const [categories, setCategories] = useState([]);
  const [newFields, setNewFields] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  const scrollContainerRef = useRef(null);
  const lastInputRef = useRef(null);

  const { selectedDate } = useCouponStore();

  useEffect(() => {
    const getFoodsData = async () => {
      try {
        const foods = await fetchFoods();
        const filteredFoods = foods.data.filter(
          (food) => food.attributes.date === selectedDate
        );

        const storedOrder = JSON.parse(
          localStorage.getItem(CATEGORY_ORDER_KEY) || "[]"
        );

        // Create a map of filtered foods
        const foodsMap = filteredFoods.reduce((acc, food) => {
          acc[food.id] = food;
          return acc;
        }, {});

        let formattedCategories = [];

        // First add items that exist in stored order
        storedOrder.forEach((id) => {
          if (foodsMap[id]) {
            formattedCategories.push({
              id: id,
              name: foodsMap[id].attributes.category,
              type: "input",
            });
            delete foodsMap[id];
          }
        });

        // Then add any remaining items
        Object.values(foodsMap).forEach((food) => {
          formattedCategories.push({
            id: food.id,
            name: food.attributes.category,
            type: "input",
          });
        });

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    if (isOpen) {
      getFoodsData();
    }
  }, [isOpen, selectedDate]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategories(items);
    // Store the new order in localStorage
    localStorage.setItem(
      CATEGORY_ORDER_KEY,
      JSON.stringify(items.map((item) => item.id))
    );
  };

  const handleAddField = () => {
    const newField = {
      id: `new-${Date.now()}`,
      name: "",
      type: "input",
      isNew: true,
    };
    setNewFields([...newFields, newField]);

    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
      if (lastInputRef.current) {
        lastInputRef.current.focus();
      }
    }, 100);
  };

  const handleNewFieldChange = (id, value) => {
    setNewFields(
      newFields.map((field) =>
        field.id === id ? { ...field, name: value } : field
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      const validFields = newFields.filter((field) => field.name.trim());

      for (const field of validFields) {
        await createNewFood({
          category: field.name,
          count: 0,
          type: field.type,
          date: selectedDate,
        });
      }

      // Refresh categories data
      const foods = await fetchFoods();
      const formattedCategories = foods.data.map((food) => ({
        id: food.id,
        name: food.attributes.category,
        type: "input",
      }));
      setCategories(formattedCategories);

      if (onSave) {
        await onSave(validFields.length);
      }

      setNewFields([]);
      onClose();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  const handleEditSave = async (id, newName) => {
    try {
      await updateFoodById(id, {
        data: {
          category: newName,
          type: "input",
          date: selectedDate,
        },
      });

      // Update local categories state
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === id ? { ...cat, name: newName } : cat
        )
      );

      if (onSave) {
        await onSave(0);
      }

      setEditingCategory(null);
      toast.success("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteFoodById(id);

        // Update local categories state
        setCategories((prevCategories) =>
          prevCategories.filter((cat) => cat.id !== id)
        );

        if (onSave) {
          await onSave(0);
        }

        toast.success("Category deleted successfully!");
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category");
      }
    }
  };

  return (
    <div className={`customize-modal ${isOpen ? "open" : ""}`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="customize-content">
        <h2>Customize Categories</h2>

        <div className="categories-section">
          <h3 style={{ textAlign: "left" }}>Existing Categories</h3>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={(el) => {
                    provided.innerRef(el);
                    scrollContainerRef.current = el;
                  }}
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    paddingRight: "10px",
                  }}
                >
                  {categories.map((category, index) => (
                    <Draggable
                      key={category.id}
                      draggableId={category.id.toString()}
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
                          {editingCategory?.id === category.id ? (
                            <input
                              style={{
                                width: "50%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "2px solid #eee",
                                backgroundColor: "#fff",
                              }}
                              value={editingCategory.name}
                              onChange={(e) =>
                                setEditingCategory({
                                  ...editingCategory,
                                  name: e.target.value,
                                })
                              }
                              onBlur={() =>
                                handleEditSave(
                                  category.id,
                                  editingCategory.name
                                )
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault(); // Prevent form submission if within a form
                                  handleEditSave(
                                    category.id,
                                    editingCategory.name
                                  );
                                }
                              }}
                              autoFocus
                            />
                          ) : (
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
                          )}
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
                          <div
                            style={{
                              width: "10%",
                              display: "flex",
                              justifyContent: "space-evenly",
                              alignItems: "center",
                            }}
                            className="actions"
                          >
                            <button
                              className="edit-btn"
                              onClick={() => handleEdit(category)}
                            >
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
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(category.id)}
                            >
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
                  {newFields.map((field, index) => (
                    <div key={field.id} className="category-row">
                      <div className="drag-handle">⋮⋮</div>
                      <input
                        ref={
                          index === newFields.length - 1 ? lastInputRef : null
                        }
                        style={{
                          width: "50%",
                          padding: "10px",
                          borderRadius: "5px",
                          border: "2px solid #eee",
                          backgroundColor: "#fff",
                        }}
                        placeholder="Enter category name"
                        value={field.name}
                        onChange={(e) =>
                          handleNewFieldChange(field.id, e.target.value)
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSaveChanges();
                          }
                        }}
                      />
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
                      <div
                        style={{
                          width: "10%",
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                        }}
                        className="actions"
                      >
                        <button
                          className="delete-btn"
                          onClick={() =>
                            setNewFields(
                              newFields.filter((f) => f.id !== field.id)
                            )
                          }
                        >
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
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <button className="add-field-btn" onClick={handleAddField}>
          + Add Field
        </button>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeCategories;
