import { useState, useEffect, useCallback, useMemo } from "react";
import { DataService } from "../data/dataService";

interface AnalyticsData {
  monthlyData: { month: string; income: number; expense: number }[];
  weeklyData: { day: string; amount: number }[];
  currentMonthSummary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
}

// Cache for analytics data with timestamp
const analyticsCache = {
  data: null as AnalyticsData | null,
  timestamp: 0,
  ttl: 30000, // 30 seconds cache
};

export const useAnalytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    monthlyData: [],
    weeklyData: [],
    currentMonthSummary: { totalIncome: 0, totalExpense: 0, balance: 0 },
  });
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async (useCache = true) => {
    try {
      setLoading(true);
      
      // Check cache first
      const now = Date.now();
      if (useCache && analyticsCache.data && (now - analyticsCache.timestamp) < analyticsCache.ttl) {
        setData(analyticsCache.data);
        setLoading(false);
        return;
      }

      const [monthlyData, weeklyData, currentMonthSummary] = await Promise.all([
        DataService.getMonthlyData(),
        DataService.getWeeklyData(),
        DataService.getCurrentMonthSummary(),
      ]);

      const newData = {
        monthlyData,
        weeklyData,
        currentMonthSummary,
      };

      // Update cache
      analyticsCache.data = newData;
      analyticsCache.timestamp = now;

      setData(newData);
    } catch (error) {
      console.error("Error loading analytics data:", error);
      // Use cached data if available on error
      if (analyticsCache.data) {
        setData(analyticsCache.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Memoize return object để tránh re-render
  const memoizedReturn = useMemo(() => ({
    ...data,
    loading,
    refresh: () => loadAnalytics(false), // Force refresh without cache
  }), [data, loading, loadAnalytics]);

  return memoizedReturn;
};
