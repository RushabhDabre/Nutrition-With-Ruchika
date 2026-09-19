import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { colors, gradientBrand } from "../theme";
import { apiBaseUrl } from "../data/siteData";
import { getLocalDateString } from "../helper/dateHelper";

function isSlotInPast(dateStr, timeStr) {
  const now = new Date();
  const today = getLocalDateString(now);

  // Future date → slot is not past
  if (dateStr > today) {
    return false;
  }

  // Past date → slot is past
  if (dateStr < today) {
    return true;
  }

  // Today → compare actual time
  const [hours, minutes, seconds = 0] = timeStr.split(":").map(Number);

  const slotTime = new Date();
  slotTime.setHours(hours, minutes, seconds, 0);

  return slotTime <= now;
}

function shouldShowDate(dateItem) {
  const today = getLocalDateString();

  if (dateItem.date > today) {
    return true;
  }

  if (dateItem.date < today) {
    return false;
  }

  return dateItem.slots?.some(
    (slot) => !isSlotInPast(dateItem.date, slot.time),
  );
}

function DateTabLabel({ dateStr }) {
  const date = new Date(`${dateStr}T00:00:00`);
  const day = date.toLocaleDateString("en-IN", { day: "2-digit" });
  const weekday = date.toLocaleDateString("en-IN", { weekday: "short" });
  const month = date.toLocaleDateString("en-IN", { month: "short" });
  return (
    <Box sx={{ textAlign: "center", lineHeight: 1.3, py: 0.5 }}>
      <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>
        {day}
      </Typography>
      <Typography sx={{ fontSize: "0.68rem" }}>{weekday}</Typography>
      <Typography sx={{ fontSize: "0.68rem" }}>{month}</Typography>
    </Box>
  );
}

/** "09:00:00" -> 9. Reads the hour regardless of whether seconds are present. */
function hourOf(time) {
  return parseInt(time.split(":")[0], 10);
}

function groupSlots(slots) {
  return {
    morning: slots.filter((s) => hourOf(s.time) < 12),
    afternoon: slots.filter((s) => hourOf(s.time) >= 12 && hourOf(s.time) < 17),
    evening: slots.filter((s) => hourOf(s.time) >= 17),
  };
}

function SlotGroup({ label, slots, selectedTime, onSelect, date }) {
  if (slots.length === 0) return null;
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: colors.textLight,
          mb: 1,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {slots.map((s) => {
          const selected = selectedTime === s.time;
          const slotPast = isSlotInPast(date, s.time);
          return (
            <Button
              key={s.time}
              variant={selected ? "contained" : "outlined"}
              disabled={!s.available || slotPast}
              onClick={() => onSelect(s.time)}
              sx={{
                minWidth: 88,
                py: 0.9,
                fontSize: "0.78rem",
                borderWidth: 2,
                "&:hover": { borderWidth: 2 },
                ...(selected && { background: gradientBrand }),
              }}
            >
              {s.label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}

/**
 * value: { date: 'YYYY-MM-DD', time: 'HH:mm:ss' } - time is whatever raw
 * string the backend returned, passed straight through (never
 * reformatted), so it round-trips correctly into the booking request.
 * onChange: ({ date, time }) => void
 */
export default function DateTabPicker({ value, onChange, days = 7 }) {
  const [dateList, setDateList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const visibleDateList = React.useMemo(
    () => dateList.filter(shouldShowDate),
    [dateList],
  );

  const tabIndex = Math.max(
    visibleDateList.findIndex((d) => d.date === value.date),
    0,
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetch(`${apiBaseUrl}/api/bookings/availability-range?days=${days}`)
      .then((res) => {
        if (!res.ok)
          throw new Error("Could not load availability. Please try again.");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setDateList(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  useEffect(() => {
    if (visibleDateList.length === 0) return;

    const selectedDateExists = visibleDateList.some(
      (d) => d.date === value.date,
    );

    if (!selectedDateExists) {
      onChange({
        date: visibleDateList[0].date,
        time: "",
      });
    }
  }, [visibleDateList, value.date, onChange]);

  const handleTabChange = (e, newIndex) => {
    // Switching days clears whatever time was picked for the old day.
    onChange({ date: visibleDateList[newIndex]?.date || "", time: "" });
  };

  const handleSlotClick = (time) => {
    onChange({ date: visibleDateList[tabIndex]?.date || "", time });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const currentDay = visibleDateList[tabIndex];
  const groups = currentDay
    ? groupSlots(currentDay.slots)
    : { morning: [], afternoon: [], evening: [] };

  return (
    <Box>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        TabIndicatorProps={{
          style: { backgroundColor: colors.primary, height: 3 },
        }}
        sx={{
          bgcolor: colors.bgLight,
          borderRadius: "10px",
          mb: 2.5,
          minHeight: "64px",
          "& .MuiTab-root": {
            minWidth: 64,
            color: colors.textLight,
            minHeight: "64px",
          },
          "& .Mui-selected": { color: `${colors.primary} !important` },
        }}
      >
        {visibleDateList.map((d) => (
          <Tab key={d.date} label={<DateTabLabel dateStr={d.date} />} />
        ))}
      </Tabs>

      <SlotGroup
        label="Morning"
        slots={groups.morning}
        selectedTime={value.time}
        onSelect={handleSlotClick}
        date={currentDay?.date}
      />
      <SlotGroup
        label="Afternoon"
        slots={groups.afternoon}
        selectedTime={value.time}
        onSelect={handleSlotClick}
        date={currentDay?.date}
      />
      <SlotGroup
        label="Evening"
        slots={groups.evening}
        selectedTime={value.time}
        onSelect={handleSlotClick}
        date={currentDay?.date}
      />
    </Box>
  );
}
