import { uuid, integer, pgTable, text, varchar, pgEnum,date,timestamp } from 'drizzle-orm/pg-core';
export const statusEnum = pgEnum('status', ['PENDING', 'APPROVED', 'REJECTED']);
export const roleEnum = pgEnum('role', ['USER', 'ADMIN']);
export const borrow_statusEnum = pgEnum('borrow_status', ['BORROWED', 'RETURNED']);
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: text('email').notNull().unique(),
  universityId: integer('university_id').notNull().unique(),
  password: text('password').notNull(),
  universityCard: text('university_card').notNull(),
  status: statusEnum('status').default('PENDING'),
  role: roleEnum('role').default('USER'),
  lastactivitydate: date('last_activity_date').defaultNow(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow(),
});
