import Joi, {ValidationResult} from 'joi';
import IAuth from '../interfaces/IAuth';

export default function validate(user: IAuth): ValidationResult {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(user);
}
