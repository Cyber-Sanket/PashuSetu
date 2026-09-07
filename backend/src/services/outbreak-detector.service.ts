import { prisma } from '../database/prisma';

export class OutbreakDetectorService {
  /**
   * Evaluates clustering for a specific village/block after a new report or death
   */
  public static async evaluateCluster(location: {
    village: string;
    block: string;
    district: string;
    latitude?: number | null;
    longitude?: number | null;
    suspectedDisease?: string;
  }): Promise<void> {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Count recent symptom reports in this village
      const recentReports = await prisma.symptomReport.findMany({
        where: {
          district: location.district,
          block: location.block,
          village: location.village,
          createdAt: { gte: sevenDaysAgo },
        },
      });

      // Count recent mortalities in this village
      const recentDeaths = await prisma.mortalityReport.findMany({
        where: {
          district: location.district,
          block: location.block,
          village: location.village,
          createdAt: { gte: sevenDaysAgo },
        },
      });

      const caseCount = recentReports.length;
      const deathCount = recentDeaths.length;

      // Threshold: 3+ cases in a village OR 2+ deaths OR 5+ cases in a block triggers Outbreak alert
      if (caseCount >= 3 || deathCount >= 2) {
        const riskLevel = caseCount >= 8 || deathCount >= 3 ? 'CRITICAL' : 'HIGH';
        const diseaseLabel = location.suspectedDisease || 'Suspected Infectious Cluster';

        // Check if an active outbreak already exists for this village
        const existingOutbreak = await prisma.outbreak.findFirst({
          where: {
            district: location.district,
            block: location.block,
            village: location.village,
            status: { not: 'RESOLVED' },
          },
        });

        if (existingOutbreak) {
          await prisma.outbreak.update({
            where: { id: existingOutbreak.id },
            data: {
              caseCount,
              deathCount,
              riskLevel,
              updatedAt: new Date(),
            },
          });
        } else {
          // Generate new outbreak code
          const outbreakCount = await prisma.outbreak.count();
          const outbreakCode = `OUT-MH-${new Date().getFullYear()}-${String(outbreakCount + 1).padStart(3, '0')}`;

          // Default fallback coordinates if not passed (e.g. Pune district defaults)
          const lat = location.latitude || 18.5204 + (Math.random() - 0.5) * 0.2;
          const lng = location.longitude || 73.8567 + (Math.random() - 0.5) * 0.2;

          await prisma.outbreak.create({
            data: {
              outbreakCode,
              district: location.district,
              block: location.block,
              village: location.village,
              latitude: lat,
              longitude: lng,
              suspectedDisease: diseaseLabel,
              caseCount,
              deathCount,
              riskLevel,
              status: 'DETECTED',
              assignedTeam: `Rapid Response Team (${location.district})`,
              detectedAt: new Date(),
            },
          });

          // Create notification for Government & local Vets
          const officials = await prisma.user.findMany({
            where: { role: { in: ['GOVERNMENT', 'VETERINARIAN'] } },
          });

          for (const official of officials) {
            await prisma.notification.create({
              data: {
                userId: official.id,
                title: `🚨 OUTBREAK DETECTED: ${location.village}, ${location.block}`,
                message: `Disease cluster detected: ${caseCount} cases, ${deathCount} deaths reported within 7 days in ${location.village}, ${location.district}. Priority veterinary investigation required.`,
                type: 'OUTBREAK',
                link: '/government/outbreaks',
              },
            });
          }
        }
      }
    } catch (error) {
      console.error('Error evaluating outbreak cluster:', error);
    }
  }
}
