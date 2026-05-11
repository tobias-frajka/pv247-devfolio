import { relations } from 'drizzle-orm';

import { account, session, user } from './auth';
import { experience } from './experience';
import { profile } from './profile';
import { project } from './project';
import { skill } from './skill';
import { social } from './social';
import { profileStar } from './star';

export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(profile, { fields: [user.id], references: [profile.userId] }),
  projects: many(project),
  skills: many(skill),
  experiences: many(experience),
  socials: many(social),
  sessions: many(session),
  accounts: many(account),
  starsReceived: many(profileStar)
}));

export const profileStarRelations = relations(profileStar, ({ one }) => ({
  profileUser: one(user, { fields: [profileStar.profileUserId], references: [user.id] })
}));

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, { fields: [profile.userId], references: [user.id] })
}));

export const projectRelations = relations(project, ({ one }) => ({
  user: one(user, { fields: [project.userId], references: [user.id] })
}));

export const skillRelations = relations(skill, ({ one }) => ({
  user: one(user, { fields: [skill.userId], references: [user.id] })
}));

export const experienceRelations = relations(experience, ({ one }) => ({
  user: one(user, { fields: [experience.userId], references: [user.id] })
}));

export const socialRelations = relations(social, ({ one }) => ({
  user: one(user, { fields: [social.userId], references: [user.id] })
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] })
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] })
}));
