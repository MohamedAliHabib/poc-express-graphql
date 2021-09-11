import Joi from 'joi';

export default function validationLoader(): void {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  (Joi as any).objectId = require('joi-objectid')(Joi);
}
