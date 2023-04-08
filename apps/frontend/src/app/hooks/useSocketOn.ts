import { ref } from 'vue';
import { SocketEvent, SocketEventType } from '../socket.event';
import { getSocketIOService } from '../service/SocketIOService';
import LoggingService from '../../../../../libs/api/src/lib/service/LoggingService';

/**
 * Check socket connection for incoming events and return
 * the value from the server.
 * @param socketEvent which event should be listened to.
 * @param defaultValue the default value of the response.
 * @param successCallback the success callback, useful if the server
 *                        doesn't send any callback (e. g. on connect).
 */
export const useSocketOn = (
  socketEvent: SocketEventType,
  defaultValue?: any,
  successCallback?: boolean
): any => {
  const socket = getSocketIOService();
  const loggingService = LoggingService.getInstance();

  const event = SocketEvent.get(socketEvent);

  const response = ref(defaultValue ?? null);

  if (!event) {
    loggingService.error('useSocketOn', socketEvent, 'Event is undefined.');
    return;
  }

  socket.on(event, (res: any) => {
    loggingService.info('useSocketOn', event, 'Event captured.');

    if (successCallback) {
      response.value = successCallback;
    }

    if (res) {
      response.value = res;
    }
  });

  return response;
};
