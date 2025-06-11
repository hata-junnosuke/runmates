"use client";
import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

interface FormData {
  date: string;
  distance: number;
}

interface RecordFormProps {
  onSubmit: (data: { date: string; distance: number }) => void;
  onCancel: () => void;
  selectedDate?: string;
}

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#10b981 !important",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#10b981 !important",
  },
};

export default function RecordForm({ onSubmit, onCancel, selectedDate }: RecordFormProps) {
  const [loading, setLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      date: selectedDate || new Date().toISOString().split("T")[0],
      distance: 1, // デフォルトを1kmに変更
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    console.log("🚀 Form submitted with data:", data);
    setLoading(true);
    try {
      onSubmit(data);
      console.log("✅ onSubmit called successfully");
    } catch (error) {
      console.error("❌ Error in form submission:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* 日付 */}
      <Controller
        name="date"
        control={control}
        rules={{ required: "日付は必須です" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="日付"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.date}
            helperText={errors.date?.message}
            sx={inputStyles}
          />
        )}
      />

      {/* 距離 */}
      <Controller
        name="distance"
        control={control}
        rules={{
          required: "距離は必須です",
          min: { value: 0.1, message: "距離は0.1km以上で入力してください" },
          max: { value: 100, message: "距離は100km以下で入力してください" },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="距離 (km)"
            type="number"
            fullWidth
            inputProps={{ step: 0.1, min: 0.1, max: 100 }}
            error={!!errors.distance}
            helperText={errors.distance?.message}
            sx={inputStyles}
            onChange={(e) => {
              const value = e.target.value;
              console.log("🎯 Distance input changed:", value, "type:", typeof value);
              const numValue = value === '' ? 0 : parseFloat(value);
              console.log("🔢 Parsed distance:", numValue, "type:", typeof numValue);
              field.onChange(numValue);
            }}
          />
        )}
      />

      {/* ボタン */}
      <Box className="flex space-x-3 pt-4">
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          fullWidth
          sx={{
            borderColor: "#d1d5db",
            color: "#6b7280",
            "&:hover": {
              borderColor: "#9ca3af",
              backgroundColor: "#f9fafb",
            },
          }}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            backgroundColor: "#10b981",
            "&:hover": {
              backgroundColor: "#059669",
            },
            "&:disabled": {
              backgroundColor: "#d1d5db",
            },
          }}
        >
          {loading ? "保存中..." : "記録を保存"}
        </Button>
      </Box>
    </Box>
  );
}