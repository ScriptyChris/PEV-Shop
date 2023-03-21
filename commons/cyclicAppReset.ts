import { CronJob } from 'cron';
import getLogger from '@commons/logger';

const logger = getLogger(module.filename);

let cronjobSchedulesCounter = 0;
let previousCronJobTimestamp = 0,
  nextCronJobTimestamp = previousCronJobTimestamp;

export default function cyclicDatabaseCleanup(executeDBPopulation: () => Promise<boolean>) {
  cronjobSchedulesCounter++;

  if (cronjobSchedulesCounter > 1) {
    throw Error(
      'Cyclic database cleanup can only be called once per app lifetime! And it should be done by "populate.ts" module.'
    );
  }

  // https://crontab.guru/every-hour
  const SCHEDULE_AT_EVERY_HOUR = '0 * * * *';
  const cronJob = new CronJob(SCHEDULE_AT_EVERY_HOUR, () => {
    logger.log('Triggering database population by cron...');
    executeDBPopulation().then(() => {
      const currentDate = new Date();
      logger.log(`Database populated by cron at: ${currentDate}.`);

      previousCronJobTimestamp = nextCronJobTimestamp;
      // each subsequently scheduled cronjob timestamp
      nextCronJobTimestamp = cronJob.nextDate().valueOf();
    });
  });
  // first scheduled cronjob timestamp
  nextCronJobTimestamp = cronJob.nextDate().valueOf();

  return () => cronJob.start();
}

export const getPreviousAppResetTimestamp = () => previousCronJobTimestamp;
export const getRemainingTimestampToNextAppReset = () => nextCronJobTimestamp - Date.now();
