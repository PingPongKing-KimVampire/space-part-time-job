export const WooJooNotFoundError = {
  __typename: 'NotFoundError',
  message: '데이터를 찾을 수 없습니다.',
};

export const WooJooBadInputError = {
  __typename: 'BadInputError',
  message: '잘못된 입력입니다.',
};

export const WooJooInternalError = {
  __typename: 'InternalError',
  message: '서버 내부 오류입니다.',
};

export const WooJooForbiddenError = {
  __typename: 'ForbiddenError',
  message: '권한이 없습니다.',
};
