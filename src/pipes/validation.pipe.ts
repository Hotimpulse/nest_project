import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ValidationException } from 'src/exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const metatype = metadata.metatype;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Transform plain object → class instance
    const object = plainToInstance(metatype as ClassConstructor<any>, value);

    const errors = await validate(object);

    if (errors.length > 0) {
      const message = this.formatErrors(errors);
      throw new ValidationException(message);
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]): string {
    return errors
      .map((error) => {
        const constraints = error.constraints ? Object.values(error.constraints).join(', ') : 'is invalid';
        return `${error.property}: ${constraints}`;
      })
      .join('; ');
  }
}
