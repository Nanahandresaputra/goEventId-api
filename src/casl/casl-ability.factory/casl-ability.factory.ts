import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { role_user, User } from '@prisma/client';
import { Action, Feature } from 'src/helpers/utils/global-types';

// type Subjects = InferSubjects<typeof UserType> | 'all';

type AppAbility = PureAbility<
  [
    string,
    Subjects<{
      User: User;
    }>,
  ],
  PrismaQuery
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    if (user.role === role_user.customer) {
      can(Action.Manage, 'User'); // read-write access to everything
    }
    // else if (user.role === role_user.admmin) {
    //   can(Action.Read, 'all'); // read-only access to everything
    // } else if (user.role === role_user.superAdmin) {
    //   can(Action.Manage, 'all');
    // }

    // can(Action.Update, Article, { authorId: user.id });
    // cannot(Action.Delete, Article, { isPublished: true });

    return build();
    // {
    //   detectSubjectType: (item) =>
    //     item.constructor as ExtractSubjectType<Subjects>,
    // }
  }
}
