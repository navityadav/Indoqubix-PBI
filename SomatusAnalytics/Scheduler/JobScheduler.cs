using Quartz;
using Quartz.Impl;

namespace SomatusAnalytics.Scheduler
{
    public class JobScheduler
    {
        public static async System.Threading.Tasks.Task StartSubscriberScheduler()
        {
            IScheduler scheduler = await StdSchedulerFactory.GetDefaultScheduler();
            await scheduler.Start();

            IJobDetail job = JobBuilder.Create<ReportSubscriberSchedule>().Build();

            ITrigger trigger = TriggerBuilder.Create()
                .WithDailyTimeIntervalSchedule(
                s => s.WithIntervalInMinutes(5)
                .OnEveryDay()
                .StartingDailyAt(TimeOfDay.HourAndMinuteOfDay(0, 0))
                ).Build();

            await scheduler.ScheduleJob(job, trigger);

        }

        public static async System.Threading.Tasks.Task StartPowerBiReportGenerationScheduler()
        {
            IScheduler scheduler = await StdSchedulerFactory.GetDefaultScheduler();
            await scheduler.Start();

            IJobDetail job = JobBuilder.Create<PowerBIReportDownloadSchedule>().Build();

            ITrigger trigger = TriggerBuilder.Create()
                .WithDailyTimeIntervalSchedule(
                s => s.WithIntervalInMinutes(5)
                .OnEveryDay()
                .StartingDailyAt(TimeOfDay.HourAndMinuteOfDay(0, 0))
                ).Build();

            await scheduler.ScheduleJob(job, trigger);

        }


    }
}