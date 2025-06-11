"use client";
import { useState } from "react";
import { TextField, Button, Box, Chip } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface FormData {
  goal: number;
}

interface GoalFormProps {
  currentGoal: number;
  onSubmit: (goal: number) => void;
  onCancel: () => void;
}

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#a855f7 !important",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#a855f7 !important",
  },
};

const presetGoals = [20, 30, 50, 75, 100];

export default function GoalForm({ currentGoal, onSubmit, onCancel }: GoalFormProps) {
  const [loading, setLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      goal: currentGoal,
    },
  });

  const currentFormGoal = watch("goal");

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      onSubmit(data.goal);
    } catch (error) {
      console.error("目標の保存に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  const setPresetGoal = (goal: number) => {
    setValue("goal", goal);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* プリセット目標 */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          📋 よく使われる目標
        </p>
        <div className="flex flex-wrap gap-2">
          {presetGoals.map((goal) => (
            <Chip
              key={goal}
              label={`${goal}km`}
              onClick={() => setPresetGoal(goal)}
              variant={currentFormGoal === goal ? "filled" : "outlined"}
              sx={{
                backgroundColor: currentFormGoal === goal ? "#a855f7" : "transparent",
                color: currentFormGoal === goal ? "white" : "#a855f7",
                borderColor: "#a855f7",
                "&:hover": {
                  backgroundColor: currentFormGoal === goal ? "#9333ea" : "#f3e8ff",
                },
              }}
            />
          ))}
        </div>
      </div>

      {/* カスタム目標入力 */}
      <Controller
        name="goal"
        control={control}
        rules={{
          required: "目標は必須です",
          min: { value: 1, message: "目標は1km以上で設定してください" },
          max: { value: 500, message: "目標は500km以下で設定してください" },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="今月の目標 (km)"
            type="number"
            fullWidth
            inputProps={{ step: 1, min: 1, max: 500 }}
            error={!!errors.goal}
            helperText={errors.goal?.message}
            sx={inputStyles}
          />
        )}
      />

      {/* 目標に関する情報 */}
      {currentFormGoal > 0 && (
        <div className="bg-purple-50 p-4 rounded-lg space-y-2">
          <div className="flex items-center text-purple-700">
            <EmojiEventsIcon className="mr-2" />
            <p className="font-medium">目標設定完了！</p>
          </div>
          <p className="text-sm text-purple-600">
            📊 1日あたり約 <span className="font-bold">{(currentFormGoal / 30).toFixed(1)}km</span> のペースです
          </p>
          <p className="text-sm text-purple-600">
            🏃‍♂️ 週3回走る場合、1回あたり <span className="font-bold">{(currentFormGoal / 12).toFixed(1)}km</span> が目安です
          </p>
        </div>
      )}

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
            backgroundColor: "#a855f7",
            "&:hover": {
              backgroundColor: "#9333ea",
            },
            "&:disabled": {
              backgroundColor: "#d1d5db",
            },
          }}
        >
          {loading ? "保存中..." : "目標を設定"}
        </Button>
      </Box>
    </Box>
  );
}