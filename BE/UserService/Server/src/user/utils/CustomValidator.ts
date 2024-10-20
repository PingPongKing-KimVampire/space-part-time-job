import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'validateId', async: false })
export class IdValidator implements ValidatorConstraintInterface {
  validate(id: string, args: ValidationArguments) {
    if (id.length < 5 || 20 < id.length) return false;
    return /^[a-z0-9]+$/.test(id);
  }

  defaultMessage(args: ValidationArguments) {
    return 'ID는 5~20자의 영문 소문자와 숫자만 사용 가능합니다.';
  }
}

@ValidatorConstraint({ name: 'validatePassword', async: false })
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (password.length < 8 || 16 < password.length) return false;

    const hasOther = /[^a-zA-Z0-9~!?@#$%^&*()_\-+=<>,."'`;|/:\[\]{}\\]/.test(
      password,
    );
    if (hasOther) return false;

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[~!?@#$%^&*()_\-+=<>,."'`;|/:\[\]{}\\]/.test(
      password,
    );
    const typesCount = [
      hasLowerCase,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
    ].filter(Boolean).length;
    return 3 <= typesCount;
  }

  defaultMessage(args: ValidationArguments) {
    return '비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.';
  }
}

@ValidatorConstraint({ name: 'validateNickname', async: false })
export class NicknameValidator implements ValidatorConstraintInterface {
  validate(nickname: string, args: ValidationArguments) {
    if (nickname.length < 1 || 10 < nickname.length) return false;
    return /^[가-힣a-zA-Z0-9]+$/.test(nickname);
  }

  defaultMessage(args: ValidationArguments) {
    return '닉네임은 1~10자의 한글, 영문자, 숫자만 사용 가능합니다.';
  }
}

@ValidatorConstraint({ name: 'validatePhoneNumber', async: false })
export class PhoneNumberValidator implements ValidatorConstraintInterface {
  validate(phoneNumber: string, args: ValidationArguments) {
    if (phoneNumber.length !== 11) return false;
    if (phoneNumber.slice(0, 3) !== '010') return false;
    return /^[0-9]+$/.test(phoneNumber);
  }

  defaultMessage(args: ValidationArguments) {
    return '휴대폰 번호는 010으로 시작하는 11자리 숫자여야 합니다.';
  }
}

@ValidatorConstraint({ name: 'validateAuthNumber', async: false })
export class AuthNumberValidator implements ValidatorConstraintInterface {
  validate(authNumber: string, args: ValidationArguments) {
    return authNumber.length > 0;
  }

  defaultMessage(args: ValidationArguments) {
    return '인증 번호는 필수 항목입니다.';
  }
}
