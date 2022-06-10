import { HistoryJumpMethods } from './types';

export let historyRecord = JSON.parse(sessionStorage.getItem('keep_history_record') || '[]');

export function handleHistoryRecord(toLocation, method) {
  const { keepPosition } = history.state;
  const path = toLocation.fullPath || toLocation.path;

  historyRecord[keepPosition] = path;
  if (method === HistoryJumpMethods.pushState) {
    historyRecord.push(path);
    historyRecord = historyRecord.slice(0, keepPosition + 1);
  }

  sessionStorage.setItem('keep_history_record', JSON.stringify(historyRecord));
}
