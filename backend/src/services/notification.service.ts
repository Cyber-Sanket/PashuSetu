import { prisma } from '../database/prisma';

export class NotificationService {
  public static async notifyUser(
    userId: string,
    title: string,
    message: string,
    type: 'ALERT' | 'VACCINE' | 'CASE_UPDATE' | 'OUTBREAK' | 'ADVISORY' = 'ALERT',
    link?: string
  ): Promise<void> {
    try {
      await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          link,
        },
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  }

  public static async notifyRole(
    role: 'FARMER' | 'VETERINARIAN' | 'GOVERNMENT',
    title: string,
    message: string,
    type: 'ALERT' | 'VACCINE' | 'CASE_UPDATE' | 'OUTBREAK' | 'ADVISORY' = 'ALERT',
    link?: string
  ): Promise<void> {
    try {
      const users = await prisma.user.findMany({
        where: { role },
        select: { id: true },
      });

      for (const u of users) {
        await prisma.notification.create({
          data: {
            userId: u.id,
            title,
            message,
            type,
            link,
          },
        });
      }
    } catch (error) {
      console.error('Failed to create role notification:', error);
    }
  }
}
