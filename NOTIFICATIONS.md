# NexOffice Notifications Architecture

## Overview
The System Notification module is designed to handle both immediate and recurring announcements.

## Recurrence Engine
The system uses NestJS `@nestjs/schedule` to run a Cron Job every minute.

When the Cron Job runs (`cron/tick`), it:
1. Scans the `Announcement` table for active announcements.
2. Checks the `recurrence` rule (e.g., ONCE, DAILY, TWICE_DAILY).
3. If the current time matches the scheduled interval, it creates a new `AnnouncementOccurrence`.
4. Notifications appear on the user's dashboard based on these occurrences.

## Stopping Notifications
An announcement will stop generating occurrences if:
1. The current date exceeds the `expiresAt` date.
2. An Admin changes the `status` to `STOPPED`.

## Email Deliverability
By default, the system is configured to send the email notification *only once* when the announcement is first created, regardless of the recurrence schedule. This prevents email spam.
