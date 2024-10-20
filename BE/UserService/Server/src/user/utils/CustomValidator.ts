import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'validateId', async: false })
export class IdValidator implements ValidatorConstraintInterface {
  validate(id: string, args: ValidationArguments) {
    return IdValidator.isValidId(id);
  }

  defaultMessage(args: ValidationArguments) {
    return IdValidator.errorMessage();
  }

  static isValidId(id: string): boolean {
    return id.length >= 5 && id.length <= 20 && /^[a-z0-9]+$/.test(id);
  }

  static errorMessage(): string {
    return 'ID는 5~20자의 영문 소문자와 숫자만 사용 가능합니다.';
  }
}

@ValidatorConstraint({ name: 'validatePassword', async: false })
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    return PasswordValidator.isValidPassword(password);
  }

  defaultMessage(args: ValidationArguments) {
    return PasswordValidator.errorMessage();
  }

  static isValidPassword(password: string): boolean {
    if (password.length < 8 || password.length > 16) return false;

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

    return typesCount >= 3;
  }

  static errorMessage(): string {
    return '비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.';
  }
}

@ValidatorConstraint({ name: 'validateNickname', async: false })
export class NicknameValidator implements ValidatorConstraintInterface {
  validate(nickname: string, args: ValidationArguments) {
    return NicknameValidator.isValidNickname(nickname);
  }

  defaultMessage(args: ValidationArguments) {
    return NicknameValidator.errorMessage();
  }

  static isValidNickname(nickname: string): boolean {
    return (
      nickname.length >= 1 &&
      nickname.length <= 10 &&
      /^[가-힣a-zA-Z0-9]+$/.test(nickname)
    );
  }

  static errorMessage(): string {
    return '닉네임은 1~10자의 한글, 영문자, 숫자만 사용 가능합니다.';
  }
}

@ValidatorConstraint({ name: 'validatePhoneNumber', async: false })
export class PhoneNumberValidator implements ValidatorConstraintInterface {
  validate(phoneNumber: string, args: ValidationArguments) {
    return PhoneNumberValidator.isValidPhoneNumber(phoneNumber);
  }

  defaultMessage(args: ValidationArguments) {
    return PhoneNumberValidator.errorMessage();
  }

  static isValidPhoneNumber(phoneNumber: string): boolean {
    return (
      phoneNumber.length === 11 &&
      phoneNumber.startsWith('010') &&
      /^[0-9]+$/.test(phoneNumber)
    );
  }

  static errorMessage(): string {
    return '휴대폰 번호는 010으로 시작하는 11자리 숫자여야 합니다.';
  }
}

@ValidatorConstraint({ name: 'validateAuthNumber', async: false })
export class AuthNumberValidator implements ValidatorConstraintInterface {
  validate(authNumber: string, args: ValidationArguments) {
    return AuthNumberValidator.isValidAuthNumber(authNumber);
  }

  defaultMessage(args: ValidationArguments) {
    return AuthNumberValidator.errorMessage();
  }

  static isValidAuthNumber(authNumber: string): boolean {
    return authNumber.length > 0;
  }

  static errorMessage(): string {
    return '인증 번호는 필수 항목입니다.';
  }
}
