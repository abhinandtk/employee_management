"use client";
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Plus } from "lucide-react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

type FieldType = "text" | "number" | "date" | "password";

interface FormField {
  id: string; // Temp string ID for dnd-kit
  label: string;
  field_type: FieldType;
  order: number;
}

interface SortableItemProps {
  field: FormField;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
  onRemove: (id: string) => void;
}

function SortableField({ field, onUpdate, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-4 bg-white p-4 mb-2 rounded border shadow-sm"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Field Label"
        className="flex-1 border p-2 rounded"
        value={field.label}
        onChange={(e) => onUpdate(field.id, { label: e.target.value })}
        required
      />
      <select
        className="border p-2 rounded bg-white"
        value={field.field_type}
        onChange={(e) => onUpdate(field.id, { field_type: e.target.value as FieldType })}
      >
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="password">Password</option>
      </select>
      <button type="button" onClick={() => onRemove(field.id)} className="text-red-500 hover:text-red-700">
        <Trash2 />
      </button>
    </div>
  );
}

export default function FormBuilder({ initialForm }: { initialForm?: any }) {
  const [name, setName] = useState(initialForm?.name || "");
  const [fields, setFields] = useState<FormField[]>(
    initialForm?.fields?.map((f: any) => ({
      id: f.id?.toString() || Math.random().toString(),
      label: f.label,
      field_type: f.field_type,
      order: f.order,
    })) || []
  );
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        return reordered.map((item, index) => ({ ...item, order: index }));
      });
    }
  };

  const addField = () => {
    setFields([
      ...fields,
      {
        id: Math.random().toString(),
        label: "",
        field_type: "text",
        order: fields.length,
      },
    ]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleSave = async () => {
    try {
      const payload = {
        name,
        fields: fields.map((f, i) => ({
          label: f.label,
          field_type: f.field_type,
          order: i,
        })),
      };

      if (initialForm?.id) {
        await api.put(`forms/${initialForm.id}/`, payload);
      } else {
        await api.post("forms/", payload);
      }
      router.push("/forms");
    } catch (err) {
      console.error(err);
      alert("Error saving form");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Form Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded text-lg font-semibold"
          placeholder="e.g. Employee Onboarding"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            {fields.map((field) => (
              <SortableField
                key={field.id}
                field={field}
                onUpdate={updateField}
                onRemove={removeField}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={addField}
          className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded border border-blue-200 hover:bg-blue-100"
        >
          <Plus className="w-4 h-4" />
          <span>Add Field</span>
        </button>
        <button
          onClick={handleSave}
          disabled={!name || fields.length === 0}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Save Form
        </button>
      </div>
    </div>
  );
}
