// import {
//   AbilityBuilder,
//   AbilityClass,
//   ExtractSubjectType,
//   InferSubjects,
//   PureAbility,
// } from '@casl/ability';
// import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
// import { Injectable } from '@nestjs/common';
// import { role_user, User } from '@prisma/client';

// // type Subjects = InferSubjects<typeof UserType> | 'all';
// type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
// type AppSubjects =
//   | Subjects<{
//       User: User;
//     }>
//   | 'all';

// type AppAbility = PureAbility<[Actions, AppSubjects], PrismaQuery>;

// @Injectable()
// export class CaslAbilityFactory {
//   createForUser(user: User) {
//     const { can, cannot, build } = new AbilityBuilder<AppAbility>(
//       createPrismaAbility,
//     );

//     if (user.role === role_user.customer) {
//       can('manage', 'User'); // read-write access to everything
//     }
//     // else if (user.role === role_user.admmin) {
//     //   can(Action.Read, 'all'); // read-only access to everything
//     // } else if (user.role === role_user.superAdmin) {
//     //   can(Action.Manage, 'all');
//     // }

//     // can(Action.Update, Article, { authorId: user.id });
//     // cannot(Action.Delete, Article, { isPublished: true });

//     return build({
//       detectSubjectType: (item) =>
//         item.constructor as ExtractSubjectType<AppSubjects>,
//     });
//   }
// }
