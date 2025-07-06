// frontend/src/services/notificationService.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  static async registerForPushNotifications() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('weather-alerts', {
        name: 'Weather Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Failed to get push token for push notification!');
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
    }

    return token;
  }

  static async scheduleWeatherAlert(alert) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Weather Alert: ${alert.title}`,
        body: alert.description,
        data: { alert },
      },
      trigger: null, // Immediate notification
    });
  }

  static async scheduleDailyForecast(forecast) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Weather Forecast',
        body: `Today's forecast: ${forecast.description}. High: ${forecast.high}°F, Low: ${forecast.low}°F`,
        data: { forecast },
      },
      trigger: {
        hour: 7,
        minute: 0,
        repeats: true,
      },
    });
  }

  static async scheduleLocationBasedAlert(location, condition) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Weather Alert for ${location.name}`,
        body: `Current conditions: ${condition.description}`,
        data: { location, condition },
      },
      trigger: null,
    });
  }

  static async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  static async setBadgeCount(count) {
    await Notifications.setBadgeCountAsync(count);
  }
}

export default NotificationService;