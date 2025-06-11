"use client";
import { useState, useEffect, useMemo } from "react";
import { Fab, Modal, Box, Typography, Button, IconButton, LinearProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import TimerIcon from "@mui/icons-material/Timer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EditIcon from "@mui/icons-material/Edit";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import RecordForm from "./RecordForm";
import GoalForm from "./GoalForm";
import RunningCalendar from "./RunningCalendar";

// 走行記録の型定義
interface RunRecord {
  id: string;
  date: string;
  distance: number; // km
}

export default function RunningDashboard() {
  const [records, setRecords] = useState<RunRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [monthlyGoal, setMonthlyGoal] = useState(50); // デフォルト50km
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setMounted(true);
  }, []);

  // 初期データ（本来はAPIから取得）
  useEffect(() => {
    const sampleRecords: RunRecord[] = [
      {
        id: "1",
        date: "2024-12-10",
        distance: 5.2,
      },
      {
        id: "2", 
        date: "2024-12-08",
        distance: 3.1,
      },
      {
        id: "3",
        date: "2024-11-05",
        distance: 7.5,
      },
      {
        id: "4",
        date: "2024-10-15",
        distance: 4.8,
      },
      {
        id: "5",
        date: "2023-12-20",
        distance: 6.2,
      },
    ];
    setRecords(sampleRecords);
  }, []);

  // 今年の走行距離を計算（リアルタイム更新対応）
  const thisYearDistance = useMemo(() => {
    console.log("🗓️ Calculating thisYearDistance, records:", records);
    try {
      if (!records || !Array.isArray(records) || records.length === 0) {
        console.log("📊 No records, returning 0");
        return 0;
      }
      
      const filtered = records.filter(record => {
        if (!record || !record.date) return false;
        try {
          const recordDate = new Date(record.date);
          const now = new Date();
          const isThisYear = !isNaN(recordDate.getTime()) && recordDate.getFullYear() === now.getFullYear();
          console.log(`📅 Record ${record.date}: ${isThisYear ? 'THIS YEAR' : 'NOT THIS YEAR'}`);
          return isThisYear;
        } catch {
          return false;
        }
      });
      
      console.log("🎯 Filtered this year records:", filtered);
      
      const total = filtered.reduce((sum, record) => {
        const distance = typeof record.distance === 'number' ? record.distance : 0;
        console.log(`➕ Adding distance: ${distance}km`);
        return sum + distance;
      }, 0);
      
      console.log("📊 Total this year distance:", total);
      return typeof total === 'number' && !isNaN(total) ? total : 0;
    } catch (error) {
      console.error("❌ Error calculating thisYearDistance:", error);
      return 0;
    }
  }, [records]);

  // 今月の走行距離（リアルタイム更新対応）
  const thisMonthDistance = useMemo(() => {
    console.log("🗓️ Calculating thisMonthDistance, records:", records);
    try {
      if (!records || !Array.isArray(records) || records.length === 0) {
        console.log("📊 No records for month, returning 0");
        return 0;
      }
      
      const now = new Date();
      const filtered = records.filter(record => {
        if (!record || !record.date) return false;
        try {
          const recordDate = new Date(record.date);
          const isThisMonth = !isNaN(recordDate.getTime()) && 
                 recordDate.getMonth() === now.getMonth() && 
                 recordDate.getFullYear() === now.getFullYear();
          console.log(`📅 Record ${record.date}: ${isThisMonth ? 'THIS MONTH' : 'NOT THIS MONTH'} (${recordDate.getMonth()} vs ${now.getMonth()})`);
          return isThisMonth;
        } catch {
          return false;
        }
      });
      
      console.log("🎯 Filtered this month records:", filtered);
      
      const total = filtered.reduce((sum, record) => {
        const distance = typeof record.distance === 'number' ? record.distance : 0;
        console.log(`➕ Adding month distance: ${distance}km`);
        return sum + distance;
      }, 0);
      
      console.log("📊 Total this month distance:", total);
      return typeof total === 'number' && !isNaN(total) ? total : 0;
    } catch (error) {
      console.error("❌ Error calculating thisMonthDistance:", error);
      return 0;
    }
  }, [records]);

  // 目標達成率（リアルタイム更新対応）
  const goalAchievementRate = useMemo(() => {
    return monthlyGoal > 0 ? (thisMonthDistance / monthlyGoal) * 100 : 0;
  }, [thisMonthDistance, monthlyGoal]);

  // 新しい記録を追加
  const addRecord = (newRecord: Omit<RunRecord, "id">) => {
    console.log("🔥 addRecord called with:", newRecord);
    console.log("🔥 newRecord.distance type:", typeof newRecord.distance, "value:", newRecord.distance);
    
    // 距離を確実に数値に変換
    const distance = typeof newRecord.distance === 'string' 
      ? parseFloat(newRecord.distance) 
      : typeof newRecord.distance === 'number' 
        ? newRecord.distance 
        : 0;
    
    console.log("🔢 Converted distance:", distance, "type:", typeof distance);
    
    const record: RunRecord = {
      ...newRecord,
      distance: distance,
      id: Date.now().toString(),
    };
    
    console.log("📝 Created record:", record);
    console.log("📝 Final distance in record:", record.distance, "type:", typeof record.distance);
    
    // 記録を追加（リアルタイム更新で統計が即座に反映される）
    setRecords(prev => {
      const newRecords = [record, ...prev];
      console.log("📊 Updated records:", newRecords);
      console.log("📊 Records length:", newRecords.length);
      console.log("📊 First record distance:", newRecords[0]?.distance);
      return newRecords;
    });
    
    setModalOpen(false);
    setSelectedDate("");
    
    // アニメーションをトリガー（統計カードの更新アニメーション）
    setAnimationTrigger(prev => prev + 1);
    
    // 成功フィードバック（統計更新の視覚的確認）
    console.log("✅ 新しい記録が追加されました:", record);
  };

  // 目標を更新
  const updateGoal = (newGoal: number) => {
    setMonthlyGoal(newGoal);
    setGoalModalOpen(false);
  };

  // 固定の励ましメッセージ（クライアントサイドでのみランダム化）
  const getMotivationMessage = () => {
    if (!mounted) return "素晴らしいペースです！🔥"; // サーバーサイドでは固定
    
    const messages = [
      "素晴らしいペースです！🔥",
      "走る姿がかっこいい！✨",
      "今日も一歩前進！🚀",
      "ランナーズハイ最高！🌟",
      "継続は力なり！💪",
      "風になれ！🌪️",
      "限界突破！💥",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // 気の利いたコメント（距離と日付で判定）
  const getSmartComment = (record: RunRecord, index: number) => {
    const { distance, date } = record;
    const recordDate = new Date(date);
    const dayOfWeek = recordDate.getDay();
    const hour = recordDate.getHours();
    
    // 最新記録の場合
    if (index === 0) {
      const latestComments = [
        "🔥 ホットなラン！",
        "⚡ 最新の足跡",
        "🌟 フレッシュな記録",
        "💫 輝く一歩"
      ];
      return latestComments[Math.floor(Math.random() * latestComments.length)];
    }
    
    // 距離による判定
    if (distance >= 15) return "🏆 マラソンランナー！";
    if (distance >= 10) return "💪 ロングディスタンス";
    if (distance >= 7) return "🚀 絶好調のペース";
    if (distance >= 5) return "✨ 素晴らしい距離";
    if (distance >= 3) return "🌸 心地よいジョグ";
    if (distance >= 1) return "👟 軽やかステップ";
    
    // 曜日による判定
    if (dayOfWeek === 0) return "☀️ 日曜日ラン";
    if (dayOfWeek === 6) return "🎉 週末アクティブ";
    if (dayOfWeek === 1) return "💼 月曜スタート";
    
    return "🌈 ナイスラン";
  };

  // カレンダーの日付クリック処理
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  // 年間目標進捗率（リアルタイム更新対応）
  const yearGoalProgress = useMemo(() => {
    const distance = typeof thisYearDistance === 'number' ? thisYearDistance : 0;
    const progress = (distance / 500) * 100;
    return typeof progress === 'number' && !isNaN(progress) ? progress : 0;
  }, [thisYearDistance]);

  return (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 今年の総走行距離 */}
        <div 
          className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl relative overflow-hidden group"
          key={`year-${animationTrigger}`}
        >
          {/* 背景のアニメーション（ホバー時のみ） */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-emerald-500 opacity-0 group-hover:opacity-20 group-hover:animate-pulse transition-opacity duration-300"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium flex items-center">
                <CalendarTodayIcon className="mr-1 text-sm group-hover:animate-bounce" />
                今年の総距離
              </p>
              <p className="text-3xl font-bold">{(typeof thisYearDistance === 'number' ? thisYearDistance : 0).toFixed(1)} km</p>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(yearGoalProgress, 100)} 
                sx={{
                  mt: 1,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#fbbf24'
                  }
                }}
              />
              <p className="text-emerald-100 text-xs mt-1">🎯 年間目標: 500km ({(typeof yearGoalProgress === 'number' ? yearGoalProgress : 0).toFixed(0)}%)</p>
            </div>
            <div className="text-right">
              <DirectionsRunIcon className="text-5xl text-emerald-200 mb-2 group-hover:animate-pulse" />
              <div className="text-xs text-emerald-100 font-bold">
                残り{Math.max(0, 500 - (typeof thisYearDistance === 'number' ? thisYearDistance : 0)).toFixed(0)}km
              </div>
            </div>
          </div>
        </div>

        {/* 今月の距離 */}
        <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl relative overflow-hidden group">
          {/* キラキラエフェクト（ホバー時のみ） */}
          <div className="absolute top-2 right-2 text-yellow-300 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300">✨</div>
          <div className="absolute bottom-4 left-4 text-blue-200 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300">⭐</div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium flex items-center">
                <TimerIcon className="mr-1 text-sm" />
                今月の距離
              </p>
              <p className="text-3xl font-bold">{(typeof thisMonthDistance === 'number' ? thisMonthDistance : 0).toFixed(1)} km</p>
              <p className="text-blue-100 text-xs mt-1">
                {getMotivationMessage()}
              </p>
            </div>
            <div className="text-right">
              <TrendingUpIcon className="text-5xl text-blue-200 mb-2 group-hover:animate-spin transition-all duration-500" />
              <div className="text-xs text-blue-100">
                +{(thisMonthDistance * 0.1).toFixed(1)}km 先週比
              </div>
            </div>
          </div>
        </div>

        {/* 今月の目標達成率 */}
        <div className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl relative overflow-hidden group">
          {/* 達成率に応じたエフェクト（ホバー時のみ） */}
          {goalAchievementRate >= 100 && (
            <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-20 group-hover:animate-pulse transition-all duration-300"></div>
          )}
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium flex items-center">
                <EmojiEventsIcon className="mr-1 text-sm" />
                目標達成率
                <IconButton
                  size="small"
                  onClick={() => setGoalModalOpen(true)}
                  sx={{ color: "white", ml: 1, p: 0.5 }}
                  className="hover:animate-spin transition-all duration-300"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </p>
              <p className="text-3xl font-bold flex items-center">
                {(typeof goalAchievementRate === 'number' ? goalAchievementRate : 0).toFixed(0)}%
                {goalAchievementRate >= 100 && <span className="ml-2 group-hover:animate-bounce">🎉</span>}
              </p>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(goalAchievementRate, 100)} 
                sx={{
                  mt: 1,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: goalAchievementRate >= 100 ? '#fbbf24' : '#fb7185'
                  }
                }}
              />
              <p className="text-purple-100 text-xs mt-1">
                目標: {monthlyGoal}km / 現在: {(typeof thisMonthDistance === 'number' ? thisMonthDistance : 0).toFixed(1)}km
              </p>
            </div>
            <div className="text-right">
              <EmojiEventsIcon className={`text-5xl text-purple-200 mb-2 ${goalAchievementRate >= 100 ? 'group-hover:animate-bounce' : 'group-hover:animate-pulse'}`} />
              <div className="text-xs text-purple-100">
                残り{Math.max(0, monthlyGoal - (typeof thisMonthDistance === 'number' ? thisMonthDistance : 0)).toFixed(1)}km
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* カレンダー */}
      <RunningCalendar records={records} onDateClick={handleDateClick} />

      {/* 最近の記録 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-400 hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <DirectionsRunIcon className="mr-2 text-emerald-600" />
          最近の記録
          <span className="ml-2 text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
            {(records || []).length}回
          </span>
        </h3>
        <div className="space-y-3">
          {(records || []).filter(record => record && typeof record.distance === 'number').slice(0, 5).map((record, index) => (
            <div
              key={record.id}
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 group ${
                index === 0 
                  ? 'bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200' 
                  : 'bg-gray-50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  index === 0 
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white' 
                    : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                }`}>
                  {index === 0 ? (
                    <FlashOnIcon className="group-hover:animate-bounce" />
                  ) : (
                    <DirectionsRunIcon className="group-hover:animate-pulse" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 flex items-center">
                    {(typeof record.distance === 'number' ? record.distance : 0).toFixed(1)} km
                    {index === 0 && <span className="ml-2 text-xs bg-yellow-400 text-yellow-800 px-2 py-1 rounded-full">最新</span>}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString("ja-JP", {
                      month: "short",
                      day: "numeric",
                      weekday: "short"
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">
                  {getSmartComment(record, index)}
                </p>
              </div>
            </div>
          ))}
        </div>
        {(!records || records.length === 0) && (
          <div className="text-center py-8">
            <DirectionsRunIcon className="text-6xl text-gray-300 mb-4 hover:animate-bounce transition-all duration-300" />
            <p className="text-gray-500 text-lg font-medium">まだ記録がありません</p>
            <p className="text-sm text-gray-400">「+」ボタンから最初の記録を追加しましょう！</p>
          </div>
        )}
      </div>

      {/* 記録追加ボタン */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setModalOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "linear-gradient(45deg, #10b981, #059669)",
          "&:hover": {
            background: "linear-gradient(45deg, #059669, #047857)",
            transform: "scale(1.2) rotate(90deg)",
          },
          transition: "all 0.4s ease",
          boxShadow: "0 4px 20px rgba(16, 185, 129, 0.4)",
        }}
      >
        <AddIcon />
      </Fab>

      {/* 記録追加モーダル */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="record-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            animation: "fadeInScale 0.3s ease-out",
            "@keyframes fadeInScale": {
              "0%": {
                opacity: 0,
                transform: "translate(-50%, -50%) scale(0.8)",
              },
              "100%": {
                opacity: 1,
                transform: "translate(-50%, -50%) scale(1)",
              },
            },
          }}
        >
          <Typography
            id="record-modal-title"
            variant="h6"
            component="h2"
            className="text-emerald-700 font-bold mb-4"
          >
            🏃‍♂️ ランニング記録を追加
          </Typography>
          <RecordForm 
            onSubmit={addRecord} 
            onCancel={() => {
              setModalOpen(false);
              setSelectedDate("");
            }}
            selectedDate={selectedDate}
          />
        </Box>
      </Modal>

      {/* 目標設定モーダル */}
      <Modal
        open={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        aria-labelledby="goal-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            animation: "fadeInScale 0.3s ease-out",
            "@keyframes fadeInScale": {
              "0%": {
                opacity: 0,
                transform: "translate(-50%, -50%) scale(0.8)",
              },
              "100%": {
                opacity: 1,
                transform: "translate(-50%, -50%) scale(1)",
              },
            },
          }}
        >
          <Typography
            id="goal-modal-title"
            variant="h6"
            component="h2"
            className="text-purple-700 font-bold mb-4"
          >
            🎯 今月の目標を設定
          </Typography>
          <GoalForm 
            currentGoal={monthlyGoal}
            onSubmit={updateGoal} 
            onCancel={() => setGoalModalOpen(false)} 
          />
        </Box>
      </Modal>
    </div>
  );
}