import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValid(
  validatorFn: (value: any) => boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validatorFn],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [fn] = args.constraints;
          return fn(value);
        },
      },
    });
  };
}
