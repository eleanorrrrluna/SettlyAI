import httpClient from './httpClient';

// Start the BotChat
export const startChat = async (): Promise<any> => {
  const response = await httpClient.get('./search/chat', { params: { intent: 'start' } });
  return response.data;
};
