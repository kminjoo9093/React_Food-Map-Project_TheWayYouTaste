export function formatTime(time) {
  if(!time) return;
  return `${time.slice(0, 2)}:${time.slice(2)}`;
}
