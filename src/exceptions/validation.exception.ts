// import { HttpException, HttpStatus } from '@nestjs/common';

// export class ValidationException extends HttpException {
//   messages;

//   constructor(response) {
//     super(response, HttpStatus.BAD_REQUEST);
//     this.messages = response;
//   }
// }

import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(message: string) {
    super(message || 'Validation failed');
  }
}
