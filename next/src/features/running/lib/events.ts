/**
 * グローバルイベントバス
 * データ変更時の通知に使用
 */
class EventBus extends EventTarget {
  emit(eventName: string, detail?: unknown) {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  on(eventName: string, callback: (event: CustomEvent) => void) {
    this.addEventListener(eventName, callback as EventListener);
  }

  off(eventName: string, callback: (event: CustomEvent) => void) {
    this.removeEventListener(eventName, callback as EventListener);
  }
}

// シングルトンインスタンス
export const eventBus = typeof window !== 'undefined' ? new EventBus() : null;

// イベント名の定数
export const EVENTS = {
  RUNNING_RECORD_CREATED: 'running_record_created',
  RUNNING_RECORD_DELETED: 'running_record_deleted',
  RUNNING_RECORD_UPDATED: 'running_record_updated',
} as const;
