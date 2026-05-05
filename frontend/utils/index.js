export const daysLeft = (deadline) => {
  if (deadline === undefined || deadline === null) return "0";

  let deadlineMs;

  if (deadline instanceof Date) {
    deadlineMs = deadline.getTime();
  } else if (typeof deadline === "number" && Number.isFinite(deadline)) {
    deadlineMs = deadline < 1e12 ? deadline * 1000 : deadline;
  } else if (typeof deadline === "bigint") {
    const asNumber = Number(deadline);
    deadlineMs = asNumber < 1e12 ? asNumber * 1000 : asNumber;
  } else if (typeof deadline === "string" && /^\d+$/.test(deadline.trim())) {
    const asNumber = Number(deadline.trim());
    deadlineMs = asNumber < 1e12 ? asNumber * 1000 : asNumber;
  } else {
    deadlineMs = new Date(deadline).getTime();
  }

  if (!deadlineMs || Number.isNaN(deadlineMs)) return "0";

  const difference = deadlineMs - Date.now();
  const remainingDays = Math.max(0, difference / (1000 * 3600 * 24));

  return Math.ceil(remainingDays).toString();
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};
