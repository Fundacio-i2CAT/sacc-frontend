// @flow

export const USER_TYPE_ENUM = Object.freeze({
  END_USER: 'END_USER',
  INSTITUTION: 'RESEARCH_INSTITUTION_MANAGER'
});

export type UserTypesType = $Values<typeof USER_TYPE_ENUM>;
